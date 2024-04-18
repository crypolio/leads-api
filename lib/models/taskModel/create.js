const utils = require('@utils');

const create = async (www = '') => {
	try {
		const taskId = utils.uuidv4();

		const result = await utils.query(
			'INSERT INTO tasks (id, www, status, date_created) VALUES (?, ?, ?, ?)', 
			[ taskId, www, 0, utils.getUtcTimestamp() ]
		);

		return result;
	} catch (error) {
		return false;
	}
};

module.exports = create;

