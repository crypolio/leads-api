"use strict";

import geoipController from "./geoipController";
import usersController from "./usersController";

const controllers: { [key: string]: any } = {};

controllers["geoip"] = geoipController;
controllers["users"] = usersController;

export default controllers;
