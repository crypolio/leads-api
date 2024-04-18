// External libraries dependencies.
const moment = require('moment-timezone');
const os = require('os');

// Internal libraries dependencies.
const SQLiteUtil = require('./classes/SQLiteUtil');
const config = require('./../config');

const index = {};

const pg = new SQLiteUtil();

/**
 * Get the user IP throught the webkitRTCPeerConnection
 * @param onNewIP {Function} listener function to expose the IP locally
 * @return undefined
 */
const getPrivateIp = (type = 'ipv4', device = false, alias = false) => {
	// Set network interface(s).
	const ifaces = os.networkInterfaces();

	const res = [];

	Object.keys(ifaces).map((ifname) => {
		let a = 0;

		ifaces[ifname].map((iface) => {
			// Evaluate if user want ip v6 or ipv4.
			if (type.includes('6')) {
				// Skip over internal (i.e. ::1) and non-ipv6 addresses
				if ('IPv6' !== iface.family || iface.internal !== false) return;
			} else {
				// Skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
				if ('IPv4' !== iface.family || iface.internal !== false) return;
			}

			// Evaluate.
			res.push(
				a >= 1
				? // this single interface has multiple ipv4/ipv6 addresses.
				`${device ? `${ifname} :` : ''}` +
				`${alias ? a : ''}` +
				`${iface.address}`
				: // this interface has only one ipv4/ipv6 adress.
				`${device ? `${ifname} :` : ''}` + `${iface.address}`,
			);
			++a;
		});
	});
	return res;
};
index['getPrivateIp'] = getPrivateIp;

/*
 * Generate unique identifier v4.
 * @returns {string} Returns unique v4 identifier.
 */
const uuidv4 = () => {
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
		const r = (Math.random() * 16) | 0,
			v = c == 'x' ? r : (r & 0x3) | 0x8;
		return v.toString(16);
	});
};
index['uuidv4'] = uuidv4;

/*
 * Get health
 */
const getHealth = () => {
	const app = config.app;
	const { env, id, service, version } = app;
	return {
		id,
		service,
		version,
		mode: env,
		message: 'OK',
		timestamp: Date.now(),
		uptime: process.uptime(),
	};
};
index['getHealth'] = getHealth;

/*
 * Console server start msg.
 */
const startServerMsg = (configuration) => {
	const { env, id, name, service, version, host, port } = configuration.app;
	const [ ip ] = getPrivateIp('ipv4');
	console.log(
		` Started LeadEasyGen Api ` +
		`${(env || '').includes('dev') ? 'development' : 'production'} mode on ` +
		`${ip ? ip : 'localhost'} port ${port}; ` +
		`Press Ctrl-C to terminate apps.\n`,
	);
};
index['startServerMsg'] = startServerMsg;

/*
 * Display credit.
 */
const credit = () => {
	console.log(
		'\x1b[36m%s\x1b[0m',
		'\n' +
		` ██╗     ███████╗ █████╗ ██████╗ ███████╗ █████╗ ███████╗██╗   ██╗ ██████╗ ███████╗███╗   ██╗ \n` +
		` ██║     ██╔════╝██╔══██╗██╔══██╗██╔════╝██╔══██╗██╔════╝╚██╗ ██╔╝██╔════╝ ██╔════╝████╗  ██║ \n` +
		` ██║     █████╗  ███████║██║  ██║█████╗  ███████║███████╗ ╚████╔╝ ██║  ███╗█████╗  ██╔██╗ ██║ \n` +
		` ██║     ██╔══╝  ██╔══██║██║  ██║██╔══╝  ██╔══██║╚════██║  ╚██╔╝  ██║   ██║██╔══╝  ██║╚██╗██║ \n` +
		` ███████╗███████╗██║  ██║██████╔╝███████╗██║  ██║███████║   ██║   ╚██████╔╝███████╗██║ ╚████║ \n` +
		` ╚══════╝╚══════╝╚═╝  ╚═╝╚═════╝ ╚══════╝╚═╝  ╚═╝╚══════╝   ╚═╝    ╚═════╝ ╚══════╝╚═╝  ╚═══╝ `
	);
};
index['credit'] = credit;

/*
 * TODO : Add slack api channel support.
 */
const log = {
	info: (...args) => {
		if (config.app.env !== 'production') {
			console.log(...args);
		}
	},
	warning: (...args) => {
		if (config.app.env !== 'production') {
			console.warn(...args);
		}
	},
	success: (...args) => {
		if (config.app.env !== 'production') {
			console.log(...args);
			// TODO : Register success console.
		}
	},
	error: (...args) => {
		if (config.app.env !== 'production') {
			console.error(...args);
			// TODO : Register error console.
		}
	},
};
index['log'] = log;

/*
 * Get SQLite Database
 * @returns {Object} Return new sqlite db connection.
 */
const query = async (sql, args) => {
	try {
		log.info(sql);
		return await pg.query(sql, args);
	} catch(e) {
		console.error(e);
	}
};
index['query'] = query;

/*
 * Get UTC timestramp
 * @returns {Object} Return utc unix timestamp.
 */
const getUtcTimestamp = () => {
	return moment.utc().unix();
};
index['getUtcTimestamp'] = getUtcTimestamp;

module.exports = index;
