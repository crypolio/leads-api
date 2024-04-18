const express = require('express');

const { catchErrors } = require('@handlers/errorHandlers');
const leadController = require('@controllers/leadController');

const leadRouter = express.Router();

leadRouter.route('/lead/:id').get(catchErrors(leadController.get));

module.exports = leadRouter;
