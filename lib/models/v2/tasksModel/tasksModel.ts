const tasksModel = (modelOptions: any) => {
	const { api, utils, config, constants, models } = modelOptions;

	const { log, query, getHealth, uuidv4, getEpochDatetime } = utils;

	/*
	 * List all supported tasks.
	 * @returns {array} Returns tasks.
	 */
	const list = async () => {
		try {
			const res = await query(
				`SELECT * FROM tasks AS t0 ORDER BY t0.date_created DESC`
			);

			return res;
		} catch (e) {
			throw new Error("while listing tasks.");
		}
	};

	/*
	 * Create task.
	 * @returns {boolean} Returns procedure status.
	 */
	const create = async (www: string = "") => {
		const result = await utils.query(
			'INSERT INTO tasks (id, www, status, date_created) VALUES ($1, $2, $3, $4)',
			[ uuidv4(), www, 0, getEpochDatetime() ]
		);

		return result;
	};

	return Object.freeze({
		list,
		create,
		getHealth,
	});
};

export default tasksModel;

