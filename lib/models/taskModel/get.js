const utils = require('@utils');

const get = async (www = '') => {
	try {
		return await utils.query(
			'SELECT * FROM tasks WHERE www = ? LIMIT 1', 
			[ www ]
		);
	} catch {
		return false;
	}
};

module.exports = get;

