const DNSServer = require('./dns-server');
const RedisClient = require('./redis-client');
const SERVER_PORT = process.env.SERVER_PORT || 53;

const logger = {
	log: () => {},
	error: () => {},
};

const server = new DNSServer('0.0.0.0', SERVER_PORT, logger);
const redis = new RedisClient('127.0.0.1', 6379, logger);

redis.run();
server.run();

server.onMessage(async (domain, callback) => {
	redis.get(domain, (err, reply) => {
		if (err)
			return callback(err);
		
		return callback(reply, 128);
	});
});
