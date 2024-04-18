require('module-alias/register');

const utils = require('@utils');
const config = require('@config');
const processModel = require('@models/processModel');

// Make sure we are running node 7.6+
const [ major, minor ] = process.versions.node.split('.').map(parseFloat);

if (major < 18 || (major === 18 && minor <= 0)) {
	console.log('Please go to nodejs.org and download version 18 or greater. 👌\n ');
	process.exit();
}

// Start our app!
const app = require('./app');

const port = process.env.port || 5050;

app.set('port', port);

const server = app.listen(port, async () => {
	// Console log credit and server message.
	utils.credit();
	utils.startServerMsg(config);

	try {
		await processModel.subscribe();
	} catch (error) {
		console.error(`Error subscribing to task(s)`, error);
	}
});
