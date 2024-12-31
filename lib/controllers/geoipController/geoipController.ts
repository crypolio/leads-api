"use strict";

const geoipController = ({ utils, config, constants, models }: any) => {
	const getIp = async (ctx: any, next: any) => {
		try {
			const { ip } = ctx.request.body;
			// GeoIp is behing nginx reverse proxy, can"t use default ctx.request.ip otherwise request ip would be 127.0.0.1 (ipv4) or ::1 (ipv6),
			const dataStatus = await models.geoip.getIpGeoInfo(
				ip ? ip : ctx.request.header["x-forwarded-for"],
			);
			if (dataStatus) {
				ctx.body = {
					reason: "GEOIP_FETCHED",
					explanation: true,
					result: dataStatus,
				};
				ctx.status = 201;
			} else {
				ctx.body = {
					reason: "INVALID_PARAMETER",
					explanation: "Invalid parameter(s)",
				};
				ctx.status = 401;
			}
		} catch (e) {
			ctx.body = {
				reason: "SERVER_ERROR",
				explanation: `Error caught in "/v2/geoip"`,
			};
			ctx.status = 501;
		}
	};

	const getGeoipHealth = async (ctx: any, next: any) => {
		const healthcheck = await models.geoip.getGeoipHealth();
		try {
			ctx.body = {
				reason: "SERVER_SUCCESS",
				explanation: "The connection to the server was successful",
				result: healthcheck,
			};
			ctx.status = 201;
		} catch (e) {
			healthcheck.message = e;
			ctx.body = {
				reason: "SERVER_ERROR",
				explanation: "The connection to the server was unsuccessful",
				result: healthcheck,
			};
			ctx.status = 501;
		}
	};

	return Object.freeze({
		getIp,
		getGeoipHealth,
	});
};

export default geoipController;
