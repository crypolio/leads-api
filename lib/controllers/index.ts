import leadsController from "./v2/leadsController";
import tasksController from "./v2/tasksController";
import processController from "./v2/processController";

const controllers: { [key: string]: any } = {};

controllers["leads"] = leadsController;
controllers["tasks"] = tasksController;
controllers["process"] = processController;

export default controllers;

