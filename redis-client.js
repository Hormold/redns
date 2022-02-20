/* eslint-disable no-unused-vars */
const { SocketClientTCP } = require('netlinkwrapper');
const ord = str => str.charCodeAt(0);
class RedisClient {
	constructor (host = '127.0.0.1', port = '6379', logger = console) {
		this.host = host;
		this.port = port;
		this.client = new SocketClientTCP(port, host);
		if (logger) this.logger = logger;
	}

	async run () {
		try {
			this.logger.log('[Redis Client] Connected to Redis server');
		} catch (err) {
			this.logger.log(`[Redis Client] Error connecting to Redis server: ${err.stack}`);
		}
	}

	async get (domainName, callback = () => {}) {
		return this.execute('GET ' + domainName, callback);
	}

	async execute (cmd, callback) {
		const command = (cmd + '\r\n').toString('hex');
		this.logger.log(`[Redis Client] Executing command: ${command}`);

		await this.client.send(command);
		const response = (await this.client.receive()).toString().trimEnd();
		if (response) {
			if (response === '$-1')
				return callback(null, null);
			else if ([ord('+'), ord('-')].includes(response[0]))
				return callback(null, null);
			
			const [_, data] = response.split('\r\n');
			return callback(null, data);
		} else
			callback(new Error('No response from Redis server'), false);
	}
}

module.exports = RedisClient;
