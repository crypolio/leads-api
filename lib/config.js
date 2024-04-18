const path = require('path');

// Import .env variables
require('dotenv-safe').config({
	path: path.join(__dirname, './../.env'),
	sample: path.join(__dirname, './../.env.example'),
});

const env = process.env.NODE_ENV || 'development';

const [ isDevEnv, isInitEnv ] = [ env === 'development', env === 'init' ];

const config = {
	app: {
		env,
		key: process.env.KEY,
		secret: process.env.SECRET,
		resendApi: process.env.RESEND_API,
		sslConfig: process.env.OPENSSL_CONF,
		port: process.env.NODE_PORT,
		jwt: {
			algo: process.env.JWT_ALGO || '',
			expiry: process.env.JWT_EXPIRY || '',
			secret: process.env.JWT_SECRET || '',
		}
	},
	mail: {
		host: process.env.MAIL_HOST || '',
		port: process.env.MAIL_PORT || '',
		user: process.env.MAIL_USER || '',
		pass: process.env.MAIL_PASS || '',
	},
	services: {
		googleMap: process.env.GOOGLE_MAP_API_KEY,
	},
	db: {
		system: {
			uri: process.env.DATABASE || '',
		}
	}
};

module.exports = config;
