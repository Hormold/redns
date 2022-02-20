
// DNS forward package to 8.8.8.8 and return response udp
const dgram = require('dgram');
const {
	parseRequest,
} = require('./dnslib');

class DNSForwarder {
	constructor (logger = console) {
		this.client = dgram.createSocket('udp4');
		this.host = '8.8.8.8';
		this.port = 53;
		this.queue = {};

		this.client.on('error', err => {
			this.logger.log(`[DNS Forwarder] Error: ${err.stack}`);
		});

		this.client.on('message', (message, remote) => {
			this.logger.log(`[DNS Forwarder] Incoming message from ${remote.address}:${remote.port}`);
			this.onIncomingMessage(message, remote);
		});
	}

	sendMessage (message, transactionId, callback) {
		this.queue[transactionId] = callback;
		this.client.send(message, 0, message.length, this.port, this.host, err => {
			this.logger.log('[DNS Forwarder#sendMessage] Error:', err);
		});
	}

	onIncomingMessage (message, remote) {
		const { transaction_id } = parseRequest(message);
		const callback = this.queue[transaction_id];
		if (!callback) return;
		callback(message, remote);
		delete this.queue[transaction_id];
	}
}

module.exports = DNSForwarder;
