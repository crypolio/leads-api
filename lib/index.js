require('module-alias/register');

const utils = require('@utils');
const config = require('@config');
const processModel = require('@models/processModel');

// Start our app!
const app = require('./app');

const port = config.app.port || 5050;

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
