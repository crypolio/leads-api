"use strict";

import leadsRouter from "./leadsRouter";
import tasksRouter from "./tasksRouter";
import processRouter from "./processRouter";

const routers: { [key: string]: any } = {};

routers["leads"] = leadsRouter;
routers["tasks"] = tasksRouter;
routers["process"] = processRouter;

export default routers;
