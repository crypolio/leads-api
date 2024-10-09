import leadsModel from "./v2/leadsModel";
import tasksModel from "./v2/tasksModel";
import processModel from "./v2/processModel";

const models: { [key: string]: any } = {};

models["leads"] = leadsModel;
models["tasks"] = tasksModel;
models["process"] = processModel;

export default models;

