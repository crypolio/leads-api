#!/usr/utils/env node

import app from "./app";
import api from "./api";
import utils from "./utils";
import config from "./config";
import appModels from "./models";
import appRouters from "./routers";
import constants from "./constants";
import appControllers from "./controllers";

const initApp = async () => {
	// Set service(s) base parameter(s).
	const baseParams = { utils, config, constants };

	// Set available service(s).
	const availableServices = ["leads", "tasks", "process"];

	// Aggregate service(s) models.
	const models = availableServices.reduce((agg: any, service: string) => Object.assign(agg, {
		[service]: appModels[service]({
			...baseParams,
			api,
			models: appModels,
		}),
	}), {});

	// Set enabled api endpoint(s).
	const enabledServices = availableServices.map((service: string) => {
		// Set current service model.
		const model = appModels[service]({
			...baseParams,
			api,
			models: appModels,
		});

		// Set current service controller.
		const controller = appControllers[service]({
			...baseParams,
			model,
		});

		// Set current service router.
		const router = appRouters[service]({
			controller,
			middlewares: utils.middlewares,
			router: new utils.Router({
				prefix: `/v2/${service}`,
			}),
		});

		return router;
	});

	// Start application.
	app({ config, utils, enabledServices });

        try {
                // Subscribe to processes.
                await models.process.subscribe();
        } catch (err) {
                console.error('Error subscribing process, please try again....');
        }
};

if (require.main === module) {
	initApp();
} else {
	module.exports.default = initApp;
}
