"use strict";

import leadsController from "./leadsController";
import tasksController from "./tasksController";
import processController from "./processController";

const controllers: { [key: string]: any } = {};

controllers["leads"] = leadsController;
controllers["tasks"] = tasksController;
controllers["process"] = processController;

export default controllers;
