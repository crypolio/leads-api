const processController = ({ utils, config, constants, model }: any) => {
	const get = async (ctx: any, next: any) => {
		try {
			const { id = "" } = ctx.params;

			if (id && id.length) {
				const result = await model.get(id);

				if (result && result.length) {
					ctx.body = {
						reason: "LEAD_FOUND",
						explanation: "Lead(s) successfully fetched",
						result,
					};
					ctx.status = 201;
				} else {
					ctx.body = {
						reason: "LEAD_NOT_FOUND",
						explanation: "Lead(s) unsuccessfully fetched",
					};
					ctx.status = 401;
				}
			} else {
				ctx.body = {
					reason: "INVALID_PARAMETER",
					explanation: "Invalid parameter(s)",
				};
				ctx.status = 401;
			}
		} catch (e) {
			ctx.body = {
				reason: "SERVER_ERROR",
				explanation: `Error caught in '/v2/process' api end point.`,
			};
			ctx.status = 501;
		}
	};

	const getHealth = async (ctx: any, next: any) => {
		const healthcheck = await model.getHealth();
		try {
			ctx.body = {
				reason: "SERVER_SUCCESS",
				explanation: "The connection to the server was successful",
				result: healthcheck,
			};
			ctx.status = 201;
		} catch (e) {
			healthcheck.message = e;
			ctx.body = {
				reason: "SERVER_ERROR",
				explanation: "The connection to the server was unsuccessful",
				result: healthcheck,
			};
			ctx.status = 501;
		}
	};

	return Object.freeze({
		get,
		getHealth,
	});
};

export default processController;
