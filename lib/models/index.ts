"use strict";

import leadsModel from "./leadsModel";
import tasksModel from "./tasksModel";
import processModel from "./processModel";

const models: { [key: string]: any } = {};

models["leads"] = leadsModel;
models["tasks"] = tasksModel;
models["process"] = processModel;

export default models;
