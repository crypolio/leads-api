const leadModel = require('@models/leadModel');

const create = async (req, res) => {
	try {
		let { www } = req.body;

		if (!www || !www.length) {
			return res.status(401).json({
				reason: 'LEAD_FIELD_MISSING',
				message: 'Lead `www` field is missing',
			});
		}

		const leadData = await leadModel.get(www);

		if (leadData && leadData.length) {
			return res.status(401).json({
				reason: 'LEAD_ALREADY_EXIST',
				message: 'Lead already exists',
			});
		}

		const result = await leadModel.create(www);

		if (result) {
			return res.status(201).send({
				reason: 'LEAD_ADDED',
				message: 'Lead successfully added.',
				result,
			});
		} else {
			return res.status(401).send({
				reason: 'LEAD_NOT_ADDED',
				message: 'Lead unsuccessfully added.',
			});
		}
	} catch (error) {
		return res.status(501).json({
			reason: 'SERVER_ERROR',
			message: `Error caught in '/v1/lead/list' api end point.`, 
			error
		});
	}
};

module.exports = create;
