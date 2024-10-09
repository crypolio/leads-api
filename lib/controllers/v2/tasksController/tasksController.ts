const tasksController = ({ utils, config, constants, model }: any) => {
	const list = async (ctx: any, next: any) => {
		try {
			const { type = "", pageSize, currentPage } = ctx.query;

			const taskType = (type || "").toLowerCase();

			const result = await model.list({ taskType, pageSize, currentPage });

			if (result) {
				ctx.body = {
					reason: "TASK_FOUND",
					explanation: "Task(s) successfully fetched",
					result,
				};
				ctx.status = 201;
			} else {
				ctx.body = {
					reason: "TASK_NOT_FOUND",
					explanation: "Task(s) unsuccessfully fetched",
				};
				ctx.status = 401;
			}
		} catch (e) {
			ctx.body = {
				reason: "SERVER_ERROR",
				explanation: `Error caught in '/v2/tasks' api end point.`,
			};
			ctx.status = 501;
		}
	};

	const create = async (ctx: any, next: any) => {
		try {
			const task = ctx.request.body;

			if (task && Object.keys(task).length) {
				const { www } = task;

				if (www && www.length) {
					const result = await model.create(www);

					if (result) {
						ctx.body = {
							reason: "TASK_ADDED",
							explanation: "Tasks successfully added",
							result,
						};
						ctx.status = 201;
					} else {
						ctx.body = {
							reason: "TASK_NOT_ADDED",
							explanation: "Task unsuccessfully added",
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
				explanation: `Error caught in '/v2/tasks' api end point.`,
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
		list,
		create,
		getHealth,
	});
};

export default tasksController;

