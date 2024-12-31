"use strict";

const usersController = ({ utils, config, constants, models }: any) => {
	const auth = async (ctx: any, next: any) => {
		// try {
		const credentials = ctx.request.body;

		if (credentials) {
			const { email, password, browser, os } = credentials;
			if (email && password) {
				// Initializing user controller.
				const userAccount = await models.users.checkLogin(
					email,
					password,
					ctx.request.ip,
					os, browser,
				);

				if (userAccount.stat === "success") {
					const userData = userAccount?.data;
					const token = utils.signJWT({
						email: email,
						userId: userData?.userId,
						lastname: userData?.lastname,
						firstname: userData?.firstname,
						confirmed: userData?.confirmed,
					});

					// Set response cookies.
					ctx.cookies.set(constants.COOKIE_NAME, token, constants.COOKIE_OPTIONS);

					// Set response body.
					ctx.body = {
						reason: "ACCOUNT_NOT_BLOCKED",
						explanation: "Account currently not blocked",
						result: {
							token,
							...userData,
						},
					};
					ctx.status = 201;
				} else if (userAccount.stat === "fail") {
					ctx.body = {
						reason: "AUTH_FAILED",
						explanation: "Account currently blocked",
					};
					ctx.status = 400;
				} else if (userAccount.stat === "ban") {
					ctx.body = {
						reason: "ACCOUNT_BLOCKED",
						explanation: "Account currently blocked",
					};
					ctx.status = 400;
				}
			} else {
				ctx.body = {
					reason: "INVALID_PARAMETER",
					explanation: "Invalid parameter(s)",
				};
				ctx.status = 400;
			}
		} else {
			ctx.body = {
				reason: "INVALID_PARAMETER",
				explanation: "Invalid parameter(s)",
			};
			ctx.status = 400;
		}
		// } catch(e) {
		// 	ctx.body = {
		// 		reason		: "SERVER_ERROR",
		// 		explanation	: `Error caught in "/v2/user/auth" api end point.`,
		// 	};
		// 	ctx.status = 500;
		// }
	};

	const register = async (ctx: any, next: any) => {
		try {
			const user = ctx.request.body;
			if (user) {
				// Deconstruct user object.
				const {
					email,
					password,
					firstName,
					lastName,
					referralCode,
					language,
					browser,
					os,
				} = user;
				if (email && password && firstName && lastName) {
					// Initializing user controller.
					// const userAccount = new User({
					// 	signupIp 	: ctx.request.ip,
					// 	currentIp 	: ctx.request.ip,
					// 	referralCode 	: referralCode,
					// 	firstname 	: firstName,
					// 	lastname 	: lastName,
					// 	country 	: "ca",
					// 	gender 		: "m",
					// 	currency	: "cad",		// Not required
					// 	password,
					// 	language,
					// 	browser,
					// 	email,
					// 	os,
					// });

					// Set user info.
					const accountStatus = await models.users.createAccount({
						currentIp: ctx.request.ip,
						referralCode: referralCode,
						firstname: firstName,
						lastname: lastName,
						gender: "m",
						currency: "cad", // Not required
						password,
						language,
						email,
					});

					if (accountStatus.stat === "account-created") {
						const account = await models.users.checkLogin(
							email,
							password,
							ctx.request.ip,
							os,
							browser,
						);
						const userData = account.data;

						const token = utils.signJWT({
							email,
							userId: userData.userId,
							lastname: userData.lastname,
							firstname: userData.firstname,
							confirmed: userData.confirmed,
						});

						// Set response cookies.
						ctx.cookies.set(constants.COOKIE_NAME, token, constants.COOKIE_OPTIONS);

						ctx.body = {
							reason: "ACCOUNT_CREATED",
							explanation: "Account successfully created.",
							result: {
								token,
								...userData,
							},
						};
						ctx.status = 201;
					} else {
						ctx.body = {
							reason: "ACCOUNT_NOT_CREATED",
							explanation: "Account unsuccessfully created.",
						};
						ctx.status = 400;
					}
				} else {
					ctx.body = {
						reason: "INVALID_PARAMETER",
						explanation: "Invalid parameter(s)",
					};
					ctx.status = 400;
				}
			} else {
				ctx.body = {
					reason: "INVALID_PARAMETER",
					explanation: "Invalid parameter(s)",
				};
				ctx.status = 400;
			}
		} catch (e) {
			ctx.body = {
				reason: "SERVER_ERROR",
				explanation: `Error caught in "/v2/user/register" api end point.`,
			};
			ctx.status = 500;
		}
	};

	const activate = async (ctx: any, next: any) => {
		try {
			const { token } = ctx.request.body;
			if (token) {
				const { email, code } = token;
				if (email && code) {
					// Initializing account controller.
					const actionStatus = await models.users.checkActivation(email);

					if (actionStatus) {
						ctx.body = {
							reason: "ACCOUNT_ACTIVATED",
							explanation: "Account successfully activated.",
							result: true,
						};
						ctx.status = 201;
					} else {
						ctx.body = {
							reason: "ACCOUNT_NOT_ACTIVATED",
							explanation: "Account unsuccessfully activated.",
						};
						ctx.status = 400;
					}
				} else {
					ctx.body = {
						reason: "INVALID_PARAMETER",
						explanation: "Invalid parameter(s)",
					};
					ctx.status = 400;
				}
			} else {
				ctx.body = {
					reason: "INVALID_PARAMETER",
					explanation: "Invalid parameter(s)",
				};
				ctx.status = 400;
			}
		} catch (e) {
			ctx.body = {
				reason: "SERVER_ERROR",
				explanation: `Error caught in "/v2/user/activate" api end point.`,
			};
			ctx.status = 500;
		}
	};

	const recover = async (ctx: any, next: any) => {
		// try {
		const { email, code } = ctx.request.body;
		if (email || code) {
			let linkStatus = "";
			if (code && code.length) {
				linkStatus = await models.users.checkConfirmLink(email, code);
				if (linkStatus === "code-sent") {
					ctx.body = {
						reason: "CODE_SENT",
						explanation: "Code successfully sent",
					};
					ctx.status = 201;
				} else {
					ctx.body = {
						reason: "CODE_NOT_SENT",
						explanation: "Code unsuccessfully sent",
					};
					ctx.status = 400;
				}
			} else {
				linkStatus = await models.users.setConfirmEmailLink(email);
				if (linkStatus === "code-sent") {
					ctx.body = {
						reason: "CODE_SENT",
						explanation: "Code successfully sent",
					};
					ctx.status = 201;
				} else {
					ctx.body = {
						reason: "CODE_NOT_SENT",
						explanation: "Code unsuccessfully sent",
					};
					ctx.status = 400;
				}
			}
		} else {
			ctx.body = {
				reason: "INVALID_PARAMETER",
				explanation: "Invalid parameter(s)",
			};
			ctx.status = 400;
		}
		// } catch(e) {
		// 	ctx.body = {
		// 		reason		: "SERVER_ERROR",
		// 		explanation	: `Error caught in "/v2/user/recover" api end point.`,
		// 	};
		// 	ctx.status = 500;
		// }
	};

	const account = async (ctx: any, next: any) => {
		try {
			const { userId } = ctx.request;

			const actionStatus = await new models.users.findById(userId);

			if (actionStatus) {
				ctx.body = {
					reason: "USER_FETCHED",
					explanation: "User successfully fetched.",
					result: actionStatus,
				};
				ctx.status = 201;
			} else {
				ctx.body = {
					reason: "USER_NOT_FETCHED",
					explanation: "User unsuccessfully fetched.",
				};
				ctx.status = 401;
			}
		} catch (e) {
			ctx.body = {
				reason: "SERVER_ERROR",
				explanation: `Error caught in "/v2/user/account" api end point.`,
			};
			ctx.status = 500;
		}
	};

	const balance = async (ctx: any, next: any) => {
		try {
			const { userId } = ctx.request;
			if (userId) {
				ctx.body = {
					reason: "USER_BALANCE",
					explanation: "User balance successfully fetched",
					result: await models.users.getUserWalletBalance(userId, null),
				};
				ctx.status = 201;
			} else {
				ctx.body = {
					reason: "INVALID_PARAMETER",
					explanation: "Invalid parameter(s)",
				};
				ctx.status = 400;
			}
		} catch (e) {
			ctx.body = {
				reason: "SERVER_ERROR",
				explanation: `Error caught in "/v2/user/balance" mjapi end point.`,
			};
			ctx.status = 500;
		}
	};

	const update = async (ctx: any, next: any) => {
		try {
			const { user } = ctx.request.body;
			if (user) {
				const {
					firstname,
					lastname,
					email,
					password,
					gender,
					country,
					state,
					city,
					zip,
					year,
					month,
					day,
					addr1,
					addr2,
					language,
					whitelist,
					ipWhitelist,
					altEmail,
					currency,
					phone,
				} = user;

				const updateStatus = await models.users.updateUser({
					userId: ctx.request.userId,
					firstname: firstname,
					lastname: lastname,
					email: email,
					password: password,
					gender: gender,
					country: country,
					state: state,
					city: city,
					zip: zip,
					year: year,
					month: month,
					day: day,
					addr1: addr1,
					addr2: addr2,
					language: language,
					whitelist: whitelist,
					ipWhitelist: ipWhitelist,
					altEmail: altEmail,
					phone: phone,
					currency: currency,
				});

				if (updateStatus === "account-updated") {
					ctx.body = {
						reason: "ACCOUNT_UPDATED",
						explanation: "Account successfully updated.",
					};
					ctx.status = 201;
				} else {
					ctx.body = {
						reason: "ACCOUNT_NOT_UPDATED",
						explanation: "Account unsuccessfully updated.",
					};
					ctx.status = 201;
				}
			} else {
				ctx.body = {
					reason: "INVALID_PARAMETER",
					explanation: "Invalid parameter(s)",
				};
				ctx.status = 400;
			}
		} catch (e) {
			ctx.body = {
				reason: "SERVER_ERROR",
				explanation: `Error caught in "/v2/user/update" api end point.`,
			};
			ctx.status = 500;
		}
	};

	const accessLogs = async (ctx: any, next: any) => {
		try {
			const { userId } = ctx.request;
			ctx.body = {
				reason: "ACCESS_LOGS",
				explanation: `Access log fetch.`,
				result: await new models.users.getAccessLogs(userId),
			};
			ctx.status = 201;
		} catch (e) {
			ctx.body = {
				reason: "SERVER_ERROR",
				explanation: `Error caught in "/v2/user/accessLogs" api end point.`,
			};
			ctx.status = 500;
		}
	};

	const accountLock = async (ctx: any, next: any) => {
		try {
			const { userId } = ctx.request;
			const actionResponse = await models.users.findById(userId);
			if (actionResponse) {
				ctx.body = {
					reason: "INVALID_USER_ID",
					explanation: "user id not found.",
					result: actionResponse,
				};
				ctx.status = 201;
			} else {
				ctx.body = {
					reason: "INVALID_USER_ID",
					explanation: "user id not found.",
				};
				ctx.status = 400;
			}
		} catch (e) {
			ctx.body = {
				reason: "SERVER-ERROR",
				explanation: `Error caught in "/v2/user/accountLock" api end point.`,
			};
			ctx.status = 500;
		}
	};

	const resendLock = async (ctx: any, next: any) => {
		try {
			const { userId } = ctx.request;
			const actionStatus = await models.users.checkResendCode(userId);

			if (actionStatus === "unlock-code-resent") {
				ctx.body = {
					reason: "UNLOCK_CODE_RESENT",
					explanation: "Unlock code resent",
				};
				ctx.status = 201;
			} else {
				ctx.body = {
					reason: "unlock-code-not-found",
					explanation: "No unlock code was found",
				};
				ctx.status = 400;
			}
		} catch (e) {
			ctx.body = {
				reason: "SERVER_ERROR",
				explanation: `Error caught in "/v2/user/resendLock" api end point.`,
			};
			ctx.status = 500;
		}
	};

	const activateLock = async (ctx: any, next: any) => {
		try {
			const { userId } = ctx.request;

			const actionStatus = await models.users.setAccountLock(userId);

			if (actionStatus) {
				ctx.body = {
					reason: "LOCK_ACTIVATED",
					explanation: "Account lock activated",
					result: true,
				};
				ctx.status = 201;
			} else {
				ctx.body = {
					reason: "LOCK_NOT_ACTIVATED",
					explanation: "Account lock not activated",
				};
				ctx.status = 400;
			}
		} catch (e) {
			ctx.body = {
				reason: "SERVER_ERROR",
				explanation: `Error caught in "/v2/user/activateLock" api end point.`,
			};
			ctx.status = 500;
		}
	};

	const deactivateLock = async (ctx: any, next: any) => {
		try {
			const { userId } = ctx.request;
			const { code } = ctx.request.body;
			if (code) {
				const actionStatus = await models.users.checkLockStatus(userId, code);

				if (actionStatus === "settings-unlocked") {
					ctx.body = {
						reason: "SETTINGS_UNLOCKED",
						explanation: `Account settings unlocked`,
						result: false,
					};
					ctx.status = 201;
				} else {
					ctx.body = {
						reason: "SETTINGS_LOCKED",
						explanation: `Account settings locked`,
					};
					ctx.status = 400;
				}
			} else {
				ctx.body = {
					reason: "INVALID_PARAMETER",
					explanation: "Invalid parameter(s).",
				};
				ctx.status = 400;
			}
		} catch (e) {
			ctx.body = {
				reason: "SERVER_ERROR",
				explanation: `Error caught in "/v2/user/deactivateLock" api end point.`,
			};
			ctx.status = 500;
		}
	};

	// TODO: To refactor.
	const logout = async (ctx: any, next: any) => {
		try {
			const { userId } = ctx.request;
			if (userId) {
				ctx.request.session.destroy();
				ctx.body = {
					reason: "USER_DISCONNECTED",
					explanation: "User successsfully disconnected.",
				};
				ctx.status = 201;
			} else {
				ctx.body = {
					reason: "INVALID_PARAMETER",
					explanation: "Invalid-parameter(s).",
				};
				ctx.status = 400;
			}
		} catch (e) {
			ctx.body = {
				reason: "SERVER_ERROR",
				explanation: `Error caught in "/v2/user/get" api end point.`,
			};
			ctx.status = 500;
		}
	};

	/************************************************** [ ADMIN ] ***********************************************/
	const list = async (ctx: any, next: any) => {
		try {
			ctx.body = {
				reason: "USERS_FETCHED",
				explanation: "Users successfully fetched.",
				result: await models.users.getUsers(),
			};
			ctx.status = 201;
		} catch (e) {
			ctx.body = {
				reason: "SERVER_ERROR",
				explanation: `Error caught in "/v2/user/get" api end point.`,
			};
			ctx.status = 500;
		}
	};

	const get = async (ctx: any, next: any) => {
		try {
			const { id } = ctx.request.body;
			if (id) {
				ctx.body = {
					reason: "INVALID_ERROR",
					explanation: "Invalid parameter(s)",
					result: await models.users.getUserById(id),
				};
				ctx.status = 201;
			} else {
				ctx.body = {
					reason: "INVALID_ERROR",
					explanation: "Invalid parameter(s)",
				};
				ctx.status = 400;
			}
		} catch (e) {
			ctx.body = {
				reason: "SERVER_ERROR",
				explanation: `Error caught in "/v2/user/get" api end point.`,
			};
			ctx.status = 500;
		}
	};

	const updateAccount = async (ctx: any, next: any) => {
		try {
			const { user } = ctx.request.body;
			if (user) {
				const { userId } = ctx.request;
				const {
					firstname,
					lastname,
					email,
					password,
					gender,
					country,
					language,
					whitelist,
					ipWhitelist,
					altEmail,
					currency,
					phone,
				} = user;

				const actionStatus = await models.users.updateUser({
					userId,
					email: email,
					phone: phone,
					gender: gender,
					country: country,
					language: language,
					password: password,
					altEmail: altEmail,
					currency: currency,
					lastname: lastname,
					firstname: firstname,
					whitelist: whitelist,
					ipWhitelist: ipWhitelist,
				});

				if (actionStatus === "account-updated") {
					ctx.body = {
						reason: "ACCOUNT_UPDATED",
						explanation: "Account successfully updated",
					};
					ctx.status = 201;
				} else {
					ctx.body = {
						reason: "account-not-updated",
						explanation: "Account not updated.",
					};
					ctx.status = 400;
				}
			} else {
				ctx.body = {
					reason: "INVALID_PARAMETER",
					explanation: "Invalid parameter(s)",
				};
				ctx.status = 400;
			}
		} catch (e) {
			ctx.body = {
				reason: "server-error",
				explanation: `Error caught in "/v2/user/deleteAccount" api end point.`,
			};
			ctx.status = 500;
		}
	};

	const deleteAccount = async (ctx: any, next: any) => {
		try {
			const { userId } = ctx.request.body;
			if (userId) {
				const actionStatus = await models.users.deleteUserById(userId);
				if (actionStatus) {
					ctx.body = {
						reason: "ACCOUNT_DELETED",
						explanation: "Account successfully deleted.",
					};
					ctx.status = 201;
				} else {
					ctx.body = {
						reason: "ACCOUNT_NOT_DELETED",
						explanation: "Account unsuccessfully deleted.",
					};
					ctx.status = 201;
				}
			} else {
				ctx.body = {
					reason: "INVALID_PARAMETER",
					explanation: "Invalid parameter(s)",
				};
				ctx.status = 400;
			}
		} catch (e) {
			ctx.body = {
				reason: "SERVER_ERROR",
				explanation: `Error caught in "/v2/user/deleteAccount" api end point.`,
			};
			ctx.status = 500;
		}
	};

	const getUserHealth = async (ctx: any, next: any) => {
		const healthcheck = await models.users.getUserHealth();
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
		auth,
		register,
		activate,
		recover,
		account,
		balance,
		accessLogs,
		accountLock,
		resendLock,
		activateLock,
		deactivateLock,
		logout,
		//  Admin
		list,
		get,
		update,
		deleteAccount,
		getUserHealth,
	});
};

export default usersController;
