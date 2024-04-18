const leadModel = require('@models/leadModel');

const list = async (req, res) => {
	try {
		const result = await leadModel.list();

		if (!result) {
			return res.status(401).json({
				reason: 'LEAD_NOT_FETCHED',
				message: `Lead(s) unsuccessfully fetched`,
			});
		}

		return res.status(201).send({
			reason: 'LEAD_FETCHED',
			message: `Lead(s) successfully fetched`,
			result,
		});
	} catch (error) {
		return res.status(501).json({
			reason: 'SERVER_ERROR', 
			message: `Error caught in '/v1/lead/list' api end point.`,
			error
		});
	}
};

module.exports = list;
