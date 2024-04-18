const express = require('express');

const taskRouter = require('./taskRouter');
const leadRouter = require('./leadRouter');

const appRouter = express();

appRouter.use('/v1', taskRouter);
appRouter.use('/v1', leadRouter);

module.exports = appRouter;
