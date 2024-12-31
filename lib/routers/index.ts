"use strict";

import geoipRouter from "./geoipRouter";
import usersRouter from "./usersRouter";

const routers: { [key: string]: any } = {};

routers["geoip"] = geoipRouter;
routers["users"] = usersRouter;

export default routers;
