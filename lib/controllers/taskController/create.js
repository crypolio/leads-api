const taskModel = require('@models/taskModel');

const create = async (req, res) => {
	try {
		let { www } = req.body;

		if (!www || !www.length) {
			return res.status(401).json({
				reason: 'TASK_FIELD_MISSING',
				message: 'Task `www` field is missing',
			});
		}

		const taskData = await taskModel.get(www);

		if (taskData && taskData.length) {
			return res.status(401).json({
				reason: 'TASK_ALREADY_EXIST',
				message: 'Task already exists',
			});
		}

		const result = await taskModel.create(www);

		if (result) {
			return res.status(201).send({
				reason: 'TASK_ADDED',
				message: 'Task successfully added.',
				result,
			});
		} else {
			return res.status(401).send({
				reason: 'TASK_NOT_ADDED',
				message: 'Task unsuccessfully added.',
			});
		}
	} catch (error) {
		return res.status(501).json({
			reason: 'SERVER_ERROR',
			message: `Error caught in '/v1/task/list' api end point.`, 
			error
		});
	}
};

module.exports = create;
