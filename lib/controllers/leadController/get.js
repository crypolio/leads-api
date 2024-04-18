const leadModel = require('@models/leadModel');

const list = async (req, res) => {
	try {
		const { id } = req.params;

		if (!id) {
			return res.status(401).json({
				reason: 'LEAD_NOT_FETCHED',
				message: `Lead(s) unsuccessfully fetched`,
			});
		}

		const result = await leadModel.get(id);

		if (!result) {
			return res.status(401).json({
				reason: 'LEAD_NOT_PROCESS',
				message: `Lead has not being process`,
			});
		} else {
			return res.status(201).send({
				reason: 'LEAD_FETCHED',
				message: `Lead(s) successfully fetched`,
				result,
			});
		}
	} catch (error) {
		return res.status(501).json({
			reason: 'SERVER_ERROR', 
			message: `Error caught in '/v1/lead/:id' api end point.`,
			error
		});
	}
};

module.exports = list;
