// @ts-nocheck
import "module-alias/register";

import utils from "./utils";
import config from "./config";
import startServer from "./app";
import appModels from "./models";
import appRouters from "./routers";
import constants from "./constants";
import middlewares from "./middlewares";
import appControllers from "./controllers";

const initApp = () => {
	// Set service(s) base parameter(s).
	const baseParams = { utils, config, constants };

	// Set available service(s).
	const availableServices = ["geoip", "users"];

	// Aggregate service(s) models.
	const models = availableServices.reduce((agg: any, service: string) => {
		agg[service] = appModels[service]({
			...baseParams,
			models: appModels
		});
		return agg;
	}, {});

	// Set enabled api endpoint(s).
	const enabledServices = availableServices.map((service: string) => {
		// Set controller services.
		const serviceController = appControllers[service]({
			...baseParams,
			models
		});

		// Set router services.
		const serviceRouter = appRouters[service]({
			middlewares,
			controller: serviceController,
			router: new utils.Router({
				prefix: `/v1/${service}`
			})
		});

		return serviceRouter;
	});

	// Start the application and store the app instance
	return startServer({ ...baseParams, middlewares, enabledServices });
};

export default initApp();
