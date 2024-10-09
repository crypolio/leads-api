"use strict";

import leadsRouter from "./v2/leadsRouter";
import tasksRouter from "./v2/tasksRouter";
import processRouter from "./v2/processRouter";

const routers: { [key: string]: any } = {};

routers["leads"] = leadsRouter;
routers["tasks"] = tasksRouter;
routers["process"] = processRouter;

export default routers;
