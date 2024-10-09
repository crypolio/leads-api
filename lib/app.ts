/*
 * Start HTTP server.
 * @params config - Server configuration.
 * @params object - utils - Utilities functions.
 * @params array - Server configuration.
 */
export const startServer = ({ config, utils, enabledServices }: any) => {
	const app = new utils.Koa();

	const isProduction = config.app.env != "production";

	// Set app env.
	switch (isProduction) {
		case false:
			require("./utils/logger")(app);
		break;
		case true:
			break;
	}

	// Securing.
	app.use(utils.helmet());

	// Enable CORS.
	app.use(utils.cors());

	// Compress response.
	// app.use(utils.compression());

	// Support parsing of application/json type post data.
	app.use(utils.bodyParser());

	app.listen(config.app.port);

	// Set REST api endpoint(s).
	if (enabledServices && enabledServices.length) {
		enabledServices.map((service: any) => {
			app.use(service);
		});
	}

	// Console log credit and server message.
	utils.credit();
	utils.startServerMsg(config);
};

// Export app root index.
export default startServer;

// Copyright (c) 2012-2021 Choleski Louis - <choleski@gmx.com>
