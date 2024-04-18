const taskModel = require('@models/taskModel');

const list = async (req, res) => {
	try {
		const result = await taskModel.list();

		if (!result) {
			return res.status(401).json({
				reason: 'TASK_NOT_FETCHED',
				message: `Task(s) unsuccessfully fetched`,
			});
		}

		return res.status(201).send({
			reason: 'TASK_FETCHED',
			message: `Task(s) successfully fetched`,
			result,
		});
	} catch (error) {
		return res.status(501).json({
			reason: 'SERVER_ERROR', 
			message: `Error caught in '/v1/task/list' api end point.`,
			error
		});
	}
};

module.exports = list;
