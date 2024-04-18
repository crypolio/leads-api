const utils = require('@utils');

const list = async () => {
	try {
		const res = await utils.query(
			'SELECT * FROM tasks AS t0 ORDER BY t0.date_created DESC'
		);
		return res;
	} catch {
		return [];
	}
};

module.exports = list;

