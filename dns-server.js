const dgram = require('dgram');
const {
	parseRequest,
	getDomain,
	buildAnswer,
} = require('./dnslib');
const DNSForwarder = require('./dns-forwarder');

class DNSServer {
	constructor (host = '0.0.0.0', port = 53, logger = console) {
		this.dequeue = [];
		this.onMessageRequest = () => {};
		this.server = dgram.createSocket('udp4', {
			reuseAddr: true,
			reusePort: true,
		});
		this.host = host;
		this.port = port;
		if (logger) this.logger = logger;

		this.forwarder = new DNSForwarder();
	}

	run () {
		this.server.bind(this.port, this.host);
		this.server.on('error', err => {
			this.logger.log(`[DNS Server] Server Error: ${err.stack}`);
		});

		this.server.on('listening', () => {
			this.logger.log(`[DNS Server] Listening on port ${this.port}`);
		});

		this.server.on('message', (message, remote) => {
			this.logger.log(`[DNS Server] Incoming message from ${remote.address}:${remote.port}`);
			// header is first 12 bytes
			
			this.processIncomingMessage(message, remote);
		});
	}

	async processIncomingMessage (message, remote) {
		const {
			transaction_id,
			queries,
		} = parseRequest(message);

		const domainQuerys = queries.map(query => getDomain(query));
		this.logger.log(`[DNS Server] Queries: ${domainQuerys.join(',')}`);

		if (!this.onMessageRequest)
			return this.logger.log('[DNS Server] No callback defined');

		for (const domain of domainQuerys)
			try {
				this.onMessageRequest(domain, (ip, ttl) => {
					if (!ip) {
						this.logger.log(`[DNS Server] No IP found for ${domain}, use forwarder`);
						return this.forwarder.sendMessage(message, transaction_id, response => {
							this.server.send(response, 0, response.length, remote.port, remote.address);
						});
					}
					const response = buildAnswer(transaction_id, queries, ip, ttl);
					this.server.send(response, 0, response.length, remote.port, remote.address);
				});
			} catch (err) {
				this.logger.error(`[DNS Server] External Error: ${err.stack}`);
			}
	}

	onMessage (callback) {
		this.onMessageRequest = callback;
	}
}

module.exports = DNSServer;
