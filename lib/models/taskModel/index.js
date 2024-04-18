'use strict';

const get = require('./get');
const list = require('./list');
const create = require('./create');

const taskModel = {
	get,
	list,
	create,
}

module.exports = taskModel;
