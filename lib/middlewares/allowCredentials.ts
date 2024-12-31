'use strict';

/*
 * Allow credentials.
 * @param {object} ctx - HTTP object.
 * @param {object} next - Callback
 */
const allowCredentials = async (ctx: any, next: any) => {
	ctx.set('Access-Control-Allow-Credentials', 'true');
	await next();
};

export default allowCredentials;

