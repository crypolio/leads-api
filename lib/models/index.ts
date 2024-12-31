"use strict";

import geoipModel from "./geoipModel";
import usersModel from "./usersModel";
import tasksModel from "./tasksModel";
import systemModel from "./systemModel";

const models: { [key: string]: any } = {};

models["geoip"] = geoipModel;
models["users"] = usersModel;
models["tasks"] = tasksModel;
models["system"] = systemModel;

export default models;
