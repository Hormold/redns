/* eslint-disable no-unused-vars */
const { jspack } = require('./jspack');

// Parse request header and queries
const parseRequest = message => {
	const header = message.slice(0, 12);
	let query = message.slice(12);

	const [transaction_id, _, questions] = jspack.Unpack('>6H', header);
	const queries = [];

	for (let i = 0; i < questions; i++) {
		// find next zero
		const zero = query.indexOf(0) + 5;
		queries.push(query.slice(0, zero));
		query = query.slice(0, zero);
	}

	return {
		transaction_id,
		queries,
	};
};

// Extract domain from query
const getDomain = query => {
	const parts = [];
	while (true) {
		const len = query[0];
		query = query.slice(1);
		if (len === 0) break;
		parts.push(query.slice(0, len).toString());
		query = query.slice(len);
	}
	return parts.join('.');
};

// Build answer u
const buildAnswer = (transaction_id, queries, answer, ttl = 128) => {
	let flags = 0;
	flags |= 0x8000;
	flags |= 0x0400;

	if (!answer)
		flags |= 0x0003; // NXDOMAIN

	// Building header of response

	const header = Buffer.alloc(12);
	header.writeUInt16BE(transaction_id, 0);
	header.writeUInt16BE(flags, 2);
	header.writeUInt16BE(queries.length, 4);
	header.writeUInt16BE(answer ? 1 : 0, 6);
	header.writeUInt16BE(0, 8);
	header.writeUInt16BE(0, 10);

	// Add to beggining of header each query
	let payload = Buffer.alloc(0);
	for (const query of queries)
		payload = Buffer.concat([payload, query]);

	if (answer) {
		// Now add ip address to response
		const packedIpAddress = answer.split('.').map(oct => parseInt(oct, 10));
		payload = Buffer.from([
			...payload,
			0xc0, 0x0c,
			...jspack.Pack('>1H1H1L1H', [1, 1, ttl, 4]),
			...packedIpAddress,
		]);
	}

	// And return header + payload
	return Buffer.concat([header, payload]);
};

module.exports = {
	parseRequest,
	getDomain,
	buildAnswer,
};
