const utils = require('@utils');

const get = async (id = '') => {
	try {
		const results = await utils.query(
			'SELECT t0.*, l0.*, GROUP_CONCAT(l1.email) AS emails ' +
			'FROM tasks AS t0 ' +
			'LEFT JOIN leads AS l0 ON l0.task_id = t0.id ' +
			'LEFT JOIN lead_emails AS l1 ON l1.lead_id = l0.id ' +
			'WHERE t0.status = 1 AND t0.id = ? ' +
			'GROUP BY l1.lead_id',
			[ id ]
		);

		let res = [];

		if (results && results?.length) {
			res = results.map((payload) => ({
				id: payload?.id,
				www: payload?.www,
				name: payload?.name,
				phone: payload?.phone,
				rating: payload?.rating,
				status: payload?.status,
				// task_id: payload?.task_id,
				reviews: payload?.reviews,
				address: payload?.address,
				category: payload?.category,
				date_created: payload?.date_created,
				emails: (
					payload?.emails ? payload?.emails?.split(','): []
				),
			}))
		}

		return res;
	} catch {
		return false;
	}
};

module.exports = get;

