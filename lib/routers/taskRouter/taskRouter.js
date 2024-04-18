const express = require('express');

const { catchErrors } = require('@handlers/errorHandlers');
const taskController = require('@controllers/taskController');

const taskRouter = express.Router();

taskRouter.route('/task/list').get(catchErrors(taskController.list));
taskRouter.route('/task/create').post(catchErrors(taskController.create));

module.exports = taskRouter;
