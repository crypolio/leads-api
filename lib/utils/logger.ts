"use strict";

const logger = require("koa-logger");

const appLogger = (app: any) => {
  app.use(logger());
};

module.exports = appLogger;
