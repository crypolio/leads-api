"use strict";

const usersModel = ({ api, utils, config, constats, models }: any) => {

	const {
		log,
		query,
		bcrypt,
		cleanDate,
		getHealth,
		generateId,
		generateHash,
		generatePassword,
		getEpochDatetime,
		capitalizeString,
		setMinorPrecision,
	} = utils;

	const systemModel: any = {};

	// const systemModel = models.system(modalOptions);

	// const emailTimeout = systemModel.fetchEmailTimeout(),

	/*
	 * Delete confirm email link.
	 * @params {string} uEmail - Email address.
	 * @params {string} uHash - Hash code.
	 */
	const deleteConfirmEmailLink = async (uEmail: string, uHash: string) => {
		try {
			await query(
				`DELETE FROM password_links WHERE email = $1 AND hash = $2`,
				[uEmail, uHash]
			);
		} catch (e) {
			throw new Error("while deleting email confirmation link.");
		}
	};

	/*
	 * TODO: Set user password
	 * @params {string} uEmail - Email address.
	 * @params {string} uHash - Hash code.
	 */
	const setPassword = async (uEmail: string, uHash: string) => {
		// try{
		// TODO : Validate
		const plainPassword = generatePassword();

		// Get user salt from email.
		const [res] = await query(
			`SELECT u0.user_id, u0.salt FROM user_credentials AS u0 ` +
			`INNER JOIN account_infos AS u1 ON u1.user_id = u0.user_id ` +
			`WHERE u1.email = $1 LIMIT 1`,
			[uEmail]
		);

		if (res) {
			const { user_id, salt } = res;

			// Hash the password with user salt.
			const saltedHash = await bcrypt.hash(plainPassword, salt);
			const newPassword = saltedHash.replace(salt, "");

			// Update password.
			await query(
				`UPDATE user_credentials SET password = $1 WHERE userId = $2`,
				[newPassword, user_id]
			);

			// Send email.
			// await new Mail({
			// 	"id" 	: 5,
			// 	"to" 	: uEmail,
			// 	"from" 	: `${config.app.name} <info@${config.app.clientHost}>`,
			// 	"data"	: {
			// 		"{{plain_password}}" : plainPassword
			// 	}
			// }).sendEmail();

			await deleteConfirmEmailLink(uEmail, uHash);

			return 'Your new password has been mailed.';
		} else {
			return 'Your password can\'t be change.';
		}
		// }catch(e){
		// 	throw new Error('while setting recovery password.');
		// }
	};

	const resendCode = async (email: string, code: string) => {
		// try{
		// await new Mail({
		// 	'id' 	: 4,
		// 	'to' 	: email,
		// 	'from' 	: `${config.app.name} <info@${config.app.host}>`,
		// 	'data' : {
		// 		'{{WWW}}' 	: config.app.host,
		// 		'{{SITE_NAME}}' : config.app.name,
		// 		'{{email}}' 	: email,
		// 		'{{code}}' 	: code
		// 	}
		// }).sendEmail();

		return `unlock-code-resent`;
		// }catch(e){
		// 	throw new Error('white resend activation code.');
		// }
	};

	/*
	 * Get account type id.
	 * @params {string} accountType - Account type slug.
	 * @returns {number} returns account type id.
	 */
	const getAccountTypeId = (accountType: string = 'checking') => {
		return accountType === 'savings' ? 39 : 38;
	};

	/*
	 * Format user data.
	 * @param {object} data - User data.
	 * @returns {object} Returns user account data.
	 */
	const _formatUserData = (data: any) => {
		return Object.keys(data).length
			? {
				account: {
					type: data['level_name'],
					basePath: data['redirect_page'],
					lock: data['locked'] ? true : false,
				},
				userId: data['id'],
				dob: {
					day: data['dbo_day'],
					month: data['dbo_month'],
					year: data['dbo_year'],
				},
				firstname: data['first_name'],
				lastname: data['last_name'],
				gender: data['gender'],
				email: data['email'],
				country: data['country_iso'],
				phone: data['phone'],
				altEmail: data['alt_email'],
				currency: data['currency'],
				locale: data['locale'],
				whitelist: data['whitelist'],
				ipWhitelist: data['ip_whitelist'],
				confirmed: data['activated'] ? true : false,
			}
			: false;
	};

	/*
	 * Get user account by id.
	 * @param {string} email - User email.
	 * @returns {Array|boolean} Returns user account data or boolean status.
	 */
	const getByUserEmail = async (email: string) => {
		try {
			const [res] = await query(
				`SELECT DISTINCT u1.user_id, u0.*, u1.*, u2.slug AS level_name, ` +
				`u2.redirect_page, u3.country_iso FROM users as u0 ` +
				`INNER JOIN account_infos AS u1 ON u1.user_id = u0.id ` +
				`INNER JOIN account_levels AS u2 ON u2.id = u0.level_id ` +
				`FULL OUTER JOIN access_logs AS u3 ON u3.user_id = u0.id ` +
				`WHERE u1.email = '${email}' LIMIT 1`,
			);
			return res ? _formatUserData(res) : false;
		} catch (e) {
			// throw new Error('while finding user by email.');
			return false;
		}
	};

	/*
	 * Find user account by id.
	 * @param {Number} User id.
	 * @returns {Array|boolean} Returns user account data or boolean status.
	 */
	const findById = async (userId: number) => {
		try {
			const [res] = await query(
				`SELECT DISTINCT u1.user_id, u0.*, u1.*, u2.slug AS level_name, ` +
				`u2.redirect_page, u3.country_iso FROM users as u0 ` +
				`INNER JOIN account_infos AS u1 ON u1.user_id = u0.id ` +
				`INNER JOIN account_levels AS u2 ON u2.id = u0.level_id ` +
				`FULL JOIN access_logs AS u3 ON u3.user_id = u0.id ` +
				`WHERE u0.id = ${userId} AND u1.user_id = ${userId} LIMIT 1`,
			);
			return res ? _formatUserData(res) : false;
		} catch (e) {
			return false;
		}
	};

	/*
	 * Get user account by id.
	 * @param {Number} User id.
	 * @returns {Array|boolean} Returns user account data or boolean status.
	 */
	const getUserById = async (userId: number) => {
		try {
			const data = await findById(userId);
			return _formatUserData(data);
		} catch (e) {
			// throw new Error('while getting user by id.');
			return false;
		}
	};

	/*
	 * Find all user account.
	 * @returns {Array|boolean} Returns users account data or boolean status.
	 */
	const getUsers = async () => {
		try {
			const res = await query(
				`SELECT DISTINCT u1.user_id, u0.*, u1.*, u2.slug AS level_name, ` +
				`u2.redirect_page, u3.country_iso FROM users as u0 ` +
				`INNER JOIN account_infos AS u1 ON u1.user_id = u0.id ` +
				`INNER JOIN account_levels AS u2 ON u2.id = u0.id ` +
				`INNER JOIN access_logs AS u3 ON u3.user_id = u0.id `,
			);
			return res && res.length
				? res.map((data: any) => _formatUserData(data))
				: false;
		} catch (e) {
			// throw new Error('while finding all user account.');
			return [];
		}
	};

	/*
	 * Generate unique user id.
	 * @returns {number} Returns unique user id.
	 */
	const genUserId = async () => {
		try {
			let flag: boolean = false,
				res: any = [],
				userId: number = generateId();
			while (!flag) {
				res = await findById(userId);
				if (res) {
					userId = generateId();
				} else {
					flag = true;
				}
			}
			return userId;
		} catch (e) {
			// throw new Error('while setting an unique user id.');
			return false;
		}
	};

	/*
	 * Check user account login status.
	 * @returns {object|string} Returns user account data or status message.
	 */
	const checkLogin = async (
		email: string,
		password: string,
		currentIp: string,
		os: string,
		browser: string,
	) => {
		try {
			// Check db to see if email/password exist.
			let userData: any = await authenticate(currentIp, email, password);

			if (userData.stat === 'success') {
				// Let's see if the user's account has been activated.
				const activated = await checkActivation(email);

				// Let's see if the user's account has been suspended.
				const suspended = await checkIfSuspended(email);

				// Let's see if the user's account has ip whitelist enabled.
				const whitelist = await checkWhitelist(email);

				console.log('LO:::', activated, suspended, whitelist);

				if (!suspended) {
					const row = await query(
						`SELECT u0.*, u1.slug AS level_name, u1.redirect_page, u2.* FROM users as u0 ` +
						`INNER JOIN account_levels AS u1 ON u1.id = u0.level_id ` +
						`INNER JOIN account_infos AS u2 ON u2.user_id = u0.id ` +
						`WHERE u2.email = '${email}' LIMIT 1`,
					);

					if (whitelist) {
						if (row && row.length) {
							const ipList: string = row[0].ip_whitelist;
							if (ipList.includes(currentIp)) {
								await query(
									`UPDATE account_infos SET last_ip = '${currentIp}' ` +
									`WHERE email = '${row[0].id}'`,
								);
							} else {
								// Return error message;
								return 'Please sign in using an authorized whitelisted ip address.';
							}
						}
					} else {
						await query(
							`UPDATE users SET last_ip = '${currentIp}' ` +
							`WHERE id = ${row[0].id}`,
						);
					}
					await logAccess(row[0].id, currentIp, browser, os);
					return userData;
				} else {
					return `Your account has been temporarily suspended.`;
				}
			} else if (userData.stat === 'fail') {
				// Return 'You\'ve entered an invalid email address / password combination.';
				return userData;
			} else if (userData.stat === 'ban') {
				// Return `Your account has been disabled for ${userData.timeout} minutes`;
				return userData;
			}
		} catch (e) {
			throw new Error('while checking user login');
		}
	};

	/*
	 * Check admin user account login status.
	 * @returns {object|string} Returns user account data or status message.
	 */
	const checkAdminLogin = async () => {
		// try{
		// TODO
		// }catch(e){
		// 	throw new Error('while checking admin login.');
		// }
	};

	/*
	 * Check user account activation status.
	 * @param {string} email - User email address.
	 * @returns {boolean} Returns activation satus.
	 */
	const checkActivation = async (email: string) => {
		try {
			const [row] = await query(
				`SELECT u0.activated FROM users AS u0 ` +
				`INNER JOIN account_infos AS u1 ` +
				`ON u1.user_id = u0.id ` +
				`WHERE u1.email = '${email}' LIMIT 1`,
			);
			return !!row.activated;
		} catch (e) {
			return false;
		}
	};

	/*
	 * Check user account bruteforce status.
	 * @param {string} Ip.
	 * @returns {boolean} Returns bruteforce satus.
	 */
	const checkBruteforce = async (currentIp: string) => {
		try {
			// Verify for previous bruteforce attemps.
			let allowed: boolean = true;

			const [{ bruteforce_timeout }, { bruteforce_limit }] = await Promise.all([
				query(`SELECT get_bruteforce_timeout() AS bruteforce_timeout`),
				query(`SELECT get_bruteforce_limit() AS bruteforce_limit`),
			]);

			const row = await query(
				`SELECT * FROM bruteforce_watchlist ` +
				`WHERE ip_address = $1 LIMIT 1`,
				[currentIp]
			);

			if (row && row.length) {
				if (row.attempt >= bruteforce_limit) {
					const releaseTime = bruteforce_timeout + row.datetime;
					const datetime = getEpochDatetime();
					if (datetime >= releaseTime) {
						await query(
							`DELETE FROM bruteforce_watchlist ` +
							`WHERE ip_address = $1`,
							[currentIp]
						);
					} else {
						allowed = false;
					}
				}
			}

			return allowed;
		} catch (e) {
			throw new Error('while checking user bruteforce attempt(s).');
		}
	};

	/*
	 * Check if suspended
	 * @returns {boolean} Returns suspended satus.
	 */
	const checkIfSuspended = async (email: string) => {
		try {
			const [res] = await query(
				`SELECT u0.suspended FROM users AS u0 ` +
				`INNER JOIN account_infos AS u1 ` +
				`ON u1.user_id = u0.id ` +
				`WHERE u1.email = '${email}' LIMIT 1`,
			);
			return res && res.suspended ? true : false;
		} catch (e) {
			return true;
		}
	};

	/*
	 * Check whitelist
	 * @returns {boolean} Returns suspended satus.
	 */
	const checkWhitelist = async (email: string) => {
		try {
			const [res] = await query(
				`SELECT u0.whitelist FROM users AS u0 ` +
				`INNER JOIN account_infos AS u1 ` +
				`ON u1.user_id = u0.id ` +
				`WHERE u1.email = '${email}' LIMIT 1`,
			);
			return res && res.whitelist ? true : false;
		} catch (e) {
			return true;
		}
	};

	/*
	 * Authenticate user.
	 * @param {string} Ip.
	 * @param {string} Email.
	 * @param {string} Password.
	 * @returns {object} Returns user data.
	 */
	const authenticate = async (currentIp: string, email: string, password: string) => {
		try {
			let failed: boolean = false;

			// Verify for previous bruteforce attemps.
			const allowed: boolean = await checkBruteforce(currentIp);

			if (allowed) {
				// Attempt to encrypt user password.
				let row = await query(
					`SELECT u1.password, u1.salt FROM users AS u0 ` +
					`INNER JOIN user_credentials AS u1 ` +
					`ON u1.user_id = u0.id ` +
					`INNER JOIN account_infos AS u2 ` +
					`ON u2.user_id = u0.id ` +
					`WHERE u2.email = $1 LIMIT 1;`,
					[email]
				);

				let hash: string = '';
				if (row && row.length) {
					hash = await bcrypt.hash(password, row[0].salt);
					hash = hash.replace(row[0].salt, '');
				} else {
					failed = true;
				}

				if (row && row.length && !failed) {
					// Verify account hash against db password.
					if (row[0].password === hash) {
						await query(
							`DELETE FROM bruteforce_watchlist ` +
							`WHERE ip_address = '${currentIp}'`,
						);

						return {
							stat: 'success',
							data: await getByUserEmail(email),
						};
					} else {
						failed = true;
					}
				}

				if (failed) {
					row = await query(
						`SELECT * FROM bruteforce_watchlist ` +
						`WHERE ip_address = '${currentIp}' LIMIT 1`,
					);

					const datetime: number = getEpochDatetime();

					// Append to bruteforce.
					if (row && row.length) {
						await query(
							`UPDATE bruteforce_watchlist ` +
							`SET datetime = ${datetime}, ` +
							`attempt = ${row[0].attempt + 1} ` +
							`WHERE ip_address = '${row[0].ip_address}'`,
						);
					} else {
						await query(
							`INSERT INTO bruteforce_watchlist ` +
							`(ip_address, datetime, attempt) ` +
							`VALUES ('${currentIp}', ${datetime}, 1)`,
						);
					}

					return {
						stat: 'fail',
						message: 'authentication failed',
					};
				}
			} else {
				const [{ bruteforce_timeout }] = await query(
					`SELECT get_bruteforce_timeout() AS bruteforce_timeout`
				);
				return {
					stat: 'ban',
					message: 'your account is ban.',
					data: {
						timeout: bruteforce_timeout,
					},
				};
			}
		} catch (e) {
			return {
				stat: 'error',
				message: 'while authenticating user.',
			};
		}
	};

	/*
	 * Check invite code.
	 * @return {boolean} Activation code status.
	 */
	const checkReferralCode = async (referralCode: string) => {
		// try{
		const [
			res,
		]: any[any] = await `SELECT * FROM users WHERE id = '${referralCode}' LIMIT 1`;
		return res && res.length ? true : false;
		// }catch(e){
		// 	throw new Error('while checking invite code.');
		// }
	};

	/*
	 * Get balance.
	 * @return {boolean} Activation code status.
	 */
	const getUserWalletBalance = async (userId: number, accountType: string) => {
		// try{
		if (accountType) {
			return await api.payment.getBalance({
				userId,
				accountType,
			});
		} else {
			return {
				checking: await api.payment.getBalance({
					userId,
					accountType: 'checking',
				}),
				savings: await api.payment.getBalance({
					userId,
					accountType: 'savings',
				}),
			};
		}
		// }catch(e){
		// 	throw new Error('while creating user wallets.');
		// }
	};

	/*
	 * Create wallets.
	 * @return {boolean} Activation code status.
	 */
	const addUserWallets = async (userId: number) => {
		try {
			// Get a list of supported wallets.
			const supportedAsset: any[] = await api.asset.list();
			return void 0;
			supportedAsset.map(async (asset: string) => {
				// Set checking account.
				await api.payment.addCryptoWallet({
					asset,
					userId,
					// address	: await new Wallet({}).genAddressDEV(),
					// aliasName	: '',
					accountType: 'checking',
				});

				// Set savings account.
				await api.payment.addCryptoWallet({
					asset,
					userId,
					// address	: await new Wallet({}).genAddressDEV(),
					// aliasName	: '',
					accountType: 'savings',
				});
			});
		} catch (e) {
			throw new Error('while creating user wallets.');
		}
	};

	/*
	 * Create user account.
	 * @return {object|strinf} User account or account creation status.
	 */
	const createAccount = async ({
		currentIp,
		referralCode,
		email,
		password,
		firstname,
		lastname,
		gender,
		currency,
		locale = 'en-US',
	}: any) => {
		try {
			// Check bruteforce.
			const allowed: any = await checkBruteforce(currentIp);

			if (allowed) {
				let flag: boolean = false;

				const [allow_registration] = await query(
					`SELECT get_allow_registration() AS allow_registration`
				);

				// Check if registration is allowed.
				if (allow_registration) {
					flag = true; // Allowed
				} else {
					// Check for referral code and validate code.
					flag = referralCode && referralCode.length && (await checkReferralCode(referralCode));
				}

				if (flag) {
					// Check unique email
					const emailExists: any = await getByUserEmail(email);
					if (!emailExists) {
						// Generate unique user id.
						let userId: number | false = await genUserId();

						// Get base user level.
						let [[accountLevel], [{ verify_email }]] = await Promise.all([
							query(`SELECT * FROM account_levels WHERE auto = 1 LIMIT 1`),
							query(`SELECT get_verify_email() AS verify_email`),
						]);

						const userLevel = accountLevel.id;

						// Generate a salt hash the password along with our new salt
						const salt: string = await bcrypt.genSalt(10);
						const saltedHash: string = await bcrypt.hash(password, salt);
						const hash: string = saltedHash.replace(salt, '');

						let activated: boolean = false;

						if (verify_email) {
							await setActivationLink(email, password);
						} else {
							activated = true;

							// Set email
							// await new Mail({
							// 	'id' 	: 3,
							// 	'to' 	: this.email,
							// 	'from' 	: `${config.app.name} <info@${config.app.clientHost}>`,
							// 	'data' 	: {
							// 		'{{WWW}}' 		: config.app.host,
							// 		'{{SITE_NACME}}' 	: config.app.name,
							// 		'{{plain_password}}' 	: this.password
							// 	}
							// }).sendEmail();
						}

						const creationDate: number = getEpochDatetime();

						await query(
							`INSERT INTO account_infos ` +
							`(user_id, email, phone, alt_email, ` +
							`alt_phone, first_name, last_name, gender, ` +
							`dbo_year, dbo_month, dbo_day, currency, locale) ` +
							`VALUES (${userId}, '${email}', '', ` +
							`'', '', '${firstname}', '${lastname}', ` +
							`'${gender}', 1994, 05, 29, ` +
							`'${currency}', '${locale}');`,
						);

						await query(
							`INSERT INTO users ` +
							`(id, level_id, ` +
							`activated, suspended, date_created, ` +
							`last_ip, signup_ip, last_login, login_count, ` +
							`referred_by, locked, whitelist, ip_whitelist) ` +
							`VALUES (${userId}, ${userLevel}, ` +
							`${activated}, ${false}, ${creationDate}, ` +
							`'${currentIp}', '${currentIp}', ` +
							`${creationDate}, 0, '${referralCode}', ` +
							`${false}, ${false}, '');`,
						);

						await query(
							`INSERT INTO user_credentials ` +
							`(user_id, password, salt) ` +
							`VALUES (${userId}, '${hash}', '${salt}');`,
						);

						// Create user wallets.
						// await addUserWallets(userId);

						// (this.referralCode.length) && (
						// 	log.info('Rmv code')
						// 	await query(
						// 		`DELETE FROM invites ` +
						// 		`WHERE EXISTS (` +
						// 		`SELECT * FROM invites WHERE code = ${referralCode})`
						// 	);
						// )

						// Add user default currency.
						await setUserBalance(userId, 'savings');
						await setUserBalance(userId, 'checking');

						return {
							stat: 'account-created',
							confirmation: verify_email ? false : true,
						};
					} else {
						// Email already taken.
						return {
							stat: 'email-taken',
						};
					}
				} else {
					return {
						stat: 'not-permitted',
					};
				}
			} else {
				return {
					stat: 'account-suspended',
				};
			}
		} catch (e) {
			return {
				stat: 'error while creating user account.',
			};
		}
	};

	/*
	 * Update user account.
	 * @return {string} User account update status.
	 */
	const updateUser = async ({
		userId,
		email,
		firstname,
		lastname,
		phone,
		whitelist,
		ipWhitelist,
		password,
		gender,
		country,
		state,
		city,
		altEmail,
		currency,
		locale = 'en-US',
	}: any) => {
		// TODO: FIX
		// try{
		// Verify user exist.
		let [user] = await query(
			`SELECT u0.*, u1.password, u1.salt FROM users AS u0 ` +
			`INNER JOIN user_credentials AS u1 ON u1.user_id = u0.id ` +
			`WHERE u0.id = ${userId} LIMIT 1;`,
		);
		if (user) {
			let count: number = 0,
				q0: string = '';
			// Verify if user account is lock.
			if (user.locked == 1) {
				return 'Sorry, we are unable to change your settings while your account lock is active. Please deactivate your account lock and try again.';
			} else {
				let count: number = 0,
					q0: string = `UPDATE account_infos SET`,
					q1: string = ` WHERE user_id = ${userId};`;
				// Verify if the user want to change his first name.
				if (firstname !== '') {
					q0 += `${count > 0 ? ',' : ''} first_name = '${capitalizeString(
						firstname,
					)}'`;
					count += 1;
				}
				// Verify if the user want to change his last name.
				if (lastname !== '') {
					q0 += `${count > 0 ? ',' : ''} last_name = '${capitalizeString(
						lastname,
					)}'`;
					count += 1;
				}
				// TODO: Verify if the user want to change his email.
				if (email !== '') {
					// Verify if email is already taken.
					let [res] = await query(
						`SELECT * FROM users WHERE email = '${email}' LIMIT 1`,
					);
					if (res) {
						return `Email already taken.`;
					} else {
						q0 += `${count > 0 ? ',' : ''} email = '${email}'`;
						count += 1;
					}
				}
				// Verify if the user want to change his phone number.
				if (phone !== '') {
					q0 += `${count > 0 ? ',' : ''} phone = '${phone}'`;
					count += 1;
				}
				// Verify if the user want to enable whitelist.
				if (typeof whitelist == 'number') {
					q0 += `${count > 0 ? ',' : ''} whitelist = '${whitelist}'`;
					count += 1;
				}
				// Verify if the user want to add/remove ip from whitelist.
				if (ipWhitelist !== '') {
					q0 += `${count > 0 ? ',' : ''} ip_whitelist = '${ipWhitelist}'`;
					count += 1;
				}
				await query(q0 + q1);
				return 'account-updated';
			}

			// Verify if the user want to change his password.
			if (password !== '') {
				// Get account salt.
				const salt: string = user.salt;
				// Hash the password with user salt.
				const saltedHash: string = await bcrypt.hash(password, salt);
				const hash: string = saltedHash.replace(salt, '');
				// Update password.
				await query(
					`UPDATE user_credentials SET password = '${hash}' WHERE user_id = ${userId}`,
				);
			}
			// Verify if the user want to change his/her gender.
			if (gender !== '') {
				q0 += `${count ? ',' : ''} gender = '${gender}'`;
				count += 1;
			}
			// Verify if the user want to change his country.
			if (country !== '') {
				q0 += `${count ? ',' : ''} country = '${country}'`;
				count += 1;
			}
			// Verify if the user want to change his state.
			if (state !== '') {
				q0 += `${count ? ',' : ''} state = '${state}'`;
				count += 1;
			}
			// Verify if the user want to change his city.
			if (city !== '') {
				q0 += `${count ? ',' : ''} city = '${city}'`;
				count += 1;
			}
			// Verify if the user want to change his alt email.
			if (altEmail !== '') {
				q0 += `${count ? ',' : ''} alt_email = '${altEmail}'`;
				count += 1;
			}
			// Verify if the user want to default prefered currency.
			if (currency !== '') {
				q0 += `${count ? ',' : ''} currency = '${currency}'`;
				count += 1;
			}
			// Verify if the user want to change his locale.
			if (locale !== '') {
				q0 += `${count ? ',' : ''} locale = '${locale}'`;
				count += 1;
			}
		} else {
			return 'account-not-found';
		}
		// }catch(e){
		// 	throw new Error('while updating user account.');
		// }
	};

	/*
	 * Delete user account by id.
	 * @param {Number} User id.
	 * @param {string} User ip.
	 */
	const deleteUserById = async (userId: number) => {
		try {
			// Remove user by id.
			await query(
				`DELETE FROM users id = ${userId};` +
				`DELETE FROM account_infos user_id = ${userId};` +
				`DELETE FROM users_credntial user_id = ${userId};`,
			);
			return true;
		} catch (e) {
			// throw new Error('while deleting user account.');
			return false;
		}
	};

	/*
	 * Log user account access.
	 * @param {Number} User id.
	 * @param {string} User ip.
	 */
	const logAccess = async (
		userId: number,
		ip: string,
		browser: string = 'api',
		os: string = 'unknow',
	) => {
		try {
			const {
				country = 'unknow',
				city = 'unknow',
				state = 'unknow',
			}: any = await models.geoip.getIpGeoInfo(ip);

			await query(
				`INSERT INTO access_logs ` +
				`(user_id, ip_address, datetime, country_iso, state, city, browser, os) ` +
				`VALUES ` +
				`(${userId}, '${ip}', ${getEpochDatetime()}, '${country}', '${state}', ` +
				`'${city}', '${browser}', '${os}')`,
			);
			return true;
		} catch (e) {
			// throw new Error('while loging user access.');
			return false;
		}
	};

	/*
	 * Get user account log access.
	 * @returns {Array} User access log.
	 */
	const getAccessLogs = async (userId: number) => {
		try {
			const logs = await query(
				`SELECT * FROM access_logs ` +
				`WHERE user_id = ${userId} ` +
				`ORDER BY datetime ASC LIMIT 10`,
			);
			return logs && logs.length
				? logs.map(
					({
						os = '',
						city = '',
						state = '',
						browser = '',
						datetime = 0,
						ip_address = '',
						country_iso = '',
					}: any) => ({
						os,
						city,
						state,
						browser,
						datetime,
						ip: ip_address,
						country: country_iso,
					}),
				)
				: [];
		} catch (e) {
			return [];
		}
	};

	/* ============================================ [ ACCOUNT LOCK ] =========================================== */

	/*
	 * Set user account lock.
	 * @returns {string} Return setting lock status.
	 */
	const setAccountLock = async (userId: number) => {
		// try{
		// Verify if account lock ia already set.
		let [res] = await query(
			`SELECT * FROM account_locks WHERE user_id = ${userId} LIMIT 1`,
		);

		if (res) {
			return 'settings-already-locked';
		} else {
			// Generate the hash.
			let code: string = generatePassword(10);

			// Insert into database.
			await query(
				`INSERT INTO account_locks (user_id, code, datetime) ` +
				`VALUES (${userId}, '${code}', ${getEpochDatetime()})`,
			);

			// Update users table.
			await query(
				`UPDATE users SET account_lock = '1' WHERE id = ${userId}`,
			);

			// Get user email data.
			const [row] = await query(
				`SELECT email FROM users WHERE user_id = ${userId} LIMIT 1`,
			);
			const email: string = row.email;

			// Set email template.
			// await new Mail({
			// 	'id' 	: 6,
			// 	'to' 	: email,
			// 	'from' 	: `${config.app.name} <info@${config.app.clientHost}>`,
			// 	'data' 	: {
			// 		'{{code}}' : code
			// 	}
			// }).sendEmail();

			return 'settings-locked';
		}
		// }catch(e){
		// 	throw new Error('while setting account lock.');
		// }
	};

	/*
	 * Check lock
	 * @returns {boolean} Returns suspended satus.
	 */
	const checkAccountLock = async (userId: number) => {
		// try{
		const [account_lock_timeout] = await query(
			`SELECT get_account_lock_timeout() AS account_lock_timeout `
		);

		const [res] = await query(
			`SELECT * FROM account_locks WHERE user_id = '${userId}' LIMIT 1`,
		);

		if (res) {
			const { code, datetime } = res;
			if (getEpochDatetime() <= datetime + account_lock_timeout) {
				return code;
			} else {
				return false;
			}
		} else {
			return false;
		}
		return res.whitelist > 0 ? true : false;
		// }catch(e){
		// 	throw new Error('while checking user account lock.');
		// }
	};

	/*
	 * Check user account lock status.
	 * @returns {string} Return setting lock status.
	 */
	const checkLockStatus = async (userId: number, code: string) => {
		// try{
		let [res] = await query(
			`SELECT account_lock FROM users WHERE user_id = ${userId} LIMIT 1`,
		);
		if (res) {
			// Check if there is an unlock code associated with the account.
			let [res] = await query(
				`SELECT * FROM account_locks WHERE user_id = ${userId} AND code = '${code}' LIMIT 1`,
			);
			if (res) {
				// Ok, now deactivate account lock.
				await query(
					`UPDATE users SET locked = ${false} WHERE id = ${userId}; ` +
					`DELETE FROM account_locks WHERE user_id = ${userId} AND code = '${code}'`
				);
				return 'settings-unlocked';
			} else {
				// No unlock code.
				return 'No unlock code have been found';
			}
		} else {
			return 'Account not lock';
		}
		// }catch(e){
		// 	throw new Error('while checking lock status.');
		// }
	};

	/*
	 * Check user account resend lock code.
	 * @returns {string} Return setting lock code status.
	 */
	// const checkResendCode = async (userId: number) => {
	// 	// try{
	// 		// Set current date time.
	// 		const datetime: number = getEpochDatetime();
	// 		let [res] = await query(`SELECT * FROM account_locks WHERE user_id = ${userId} LIMIT 1`);
	// 		// If it does not find anything it will try again until an account is found.
	// 		if(res){
	// 			// Check acount lock timeout.
	// 			let releaseTime: number = emailTimeout + res.datetime;
	// 			if(datetime >= releaseTime){

	// 				// Check if their is an activation link associated with the account.
	// 				let code: string = res.code;

	// 				// Get user email data.
	// 				const [userData] = await query(`SELECT email FROM users WHERE id = ${userId} LIMIT 1`);
	// 				const userEmail: string = userData.email;

	// 				// Set email template id.
	// 				// await new Mail({
	// 				// 	'id' 	: 7,
	// 				// 	'to' 	: userEmail,
	// 				// 	'from' 	: `${config.app.name} <info@${config.app.clientHost}>`,
	// 				// 	'data'	: {
	// 				// 		'{{code}}' : code
	// 				// 	}
	// 				// }).sendEmail();

	// 				return 'unlock-code-resent';
	// 			}else{
	// 				return 'unlock-code-already-sent';
	// 			}
	// 		}else{
	// 			// No unlock code have been found generate one.
	// 			return await setAccountLock(userId);
	// 		}
	// 	// }catch(e){
	// 	// 	throw new Error('while checking resend lock code.');
	// 	// }
	// };

	/* ========================================= [ ACCOUNT ACTIVATION ] ======================================== */

	/*
	 * Set user account activation link.
	 */
	const setActivationLink = async (email: string, password: string) => {
		// try{
		// Generate the hash.
		const hash: string = generateHash();

		// Insert data into db.
		await query(
			`INSERT INTO activation_links(email, hash, done) VALUES ('${email}', '${hash}',false)`,
		);

		// Send email.
		// await new Mail({
		// 	'id' 	: 1,
		// 	'to' 	: email,
		// 	'from' 	: `${config.app.name} <info@${config.app.host}>`,
		// 	'data' : {
		// 		'{{WWW}}' 		: config.app.clientHost,
		// 		'{{SITE_NAME}}' 	: config.app.name,
		// 		'{{plain_password}}' 	: password,
		// 		'{{email}}' 		: email,
		// 		'{{code}}' 		: hash
		// 	}
		// }).sendEmail();
		// }catch(e){
		// 	throw new Error('while setting user account activation link.');
		// }
	};

	/*
	 * Activate user account.
	 * @param {string} uEmail - User account email.
	 * @param {string} uHash - User account hash.
	 */
	const activateAccount = async (email: string, hash: string) => {
		// try{
		// Update user activation status from users table.
		await query(
			`UPDATE users SET activated = ${true} WHERE email = "${email}"`,
		);
		await deleteActivationLink(email, hash);
		// }catch(e){
		// 	throw new Error('while activating user account.');
		// }
	};

	/*
	 * Check user account activation.
	 * @returns {boolean} Returns activation status.
	 */
	const checkActivationLink = async (email: string, hash: string) => {
		// try{
		// Check their is an activation link associated with the account.
		const [activationLink] = await query(
			`SELECT * FROM activation_links ` +
			`WHERE email = '${email}' ` +
			`AND hash = '${hash}' ` +
			`AND done = false IMIT 1`,
		);
		if (activationLink) {
			// Activate user account with given link.
			await activateAccount(email, hash);
			return true;
		} else {
			// Activation link with such email/hash combination has not eben found.
			return false;
		}
		// }catch(e){
		// 	throw new Error('while checking activation.');
		// }
	};

	/*
	 * Delete user account activation link.
	 * @param {string} uEmail - User account email.
	 * @param {string} uHash - User account hash.
	 */
	const deleteActivationLink = async (email: string, hash: string) => {
		// try{
		// Delete activation link.
		await query(
			`DELETE FROM activation_links ` +
			`WHERE email = "${email}" ` +
			`AND hash = "${hash}"`,
		);
		// }catch(e){
		// 	throw new Error('while deleting activation link.');
		// }
	};

	/*
	 * Check user account activation code.
	 * @param {string} uEmail - User account email.
	 */
	// const checkResendCode = async (email: string) => {
	// 	// try{
	// 		// TODO :: Reevaluate
	// 		// Check if the user exists.
	// 		let rows: any[] = await query(`SELECT * FROM activation_links WHERE email = "${email}"`);
	// 		if(rows && rows.length){
	// 			// Check their is an activation link associated with the account.
	// 			rows = await query(`SELECT * FROM activation_links WHERE email = "${email}"`);
	// 			if(rows && rows.length){
	//	 			let hash: string = rows[2];
	// 				// Ok you can now activate the account.
	// 				resendCode(email, hash);
	// 			}else{
	// 				// No resend link found.
	// 				log.info('No password link found');
	// 				log.info('Redirect to login');
	// 			}
	// 		}else{
	// 			log.error('No activation code associated with this email has been found.');
	// 		}
	// 	// }catch(e){
	// 	// 	throw new Error('while resending activation code.');
	// 	// }
	// };

	/* ========================================== [ ACCOUNT RECOVERY ] ========================================= */

	/*
	 * Set confirmation email link.
	 * @return {string} Returns confirmation email string status.
	 */
	const setConfirmEmailLink = async (email: string) => {
		// try{
		// Verify if provided email is valid.
		let row = await query(
			`SELECT * FROM account_infos WHERE email = '${email}' LIMIT 1`,
		);
		if (row && row.length) {
			if (!email) {
				// Generate password hash and insert it.
				let hash = generatePassword();
				await query(
					`INSERT INTO password_links (email, hash) VALUES ('${email}','${hash}')`,
				);
				// Get email template data.
				// await new Mail({
				// 	'id' 	: 4,
				// 	'to' 	: email,
				// 	'from' 	: `${config.app.name} <info@${config.app.name}>`,
				// 	'data' : {
				// 		'{{WWW}}' 	: config.app.host,
				// 		'{{SITE_NAME}}' : config.app.name,
				// 		'{{email}}' 	: email,
				// 		'{{code}}' 	: hash
				// 	}
				// }).sendEmail();
				return 'code-sent';
			} else {
				// Remove generated password hash.
				await query(`DELETE FROM password_links WHERE email = '${email}'`);
				// Generate password hash and insert it.
				const hash: string = generatePassword();
				await query(
					`INSERT INTO password_links(email, hash) VALUES ('${email}','${hash}')`,
				);

				// Get email template data.
				// await new Mail({
				// 	'id' 	: 4,
				// 	'to' 	: email,
				// 	'from' 	: `${config.app.name} <info@${config.app.name}>`,
				// 	'data' : {
				// 		'{{WWW}}' 	: config.app.host,
				// 		'{{SITE_NAME}}' : config.app.name,
				// 		'{{email}}' 	: email,
				// 		'{{code}}' 	: hash

				// 	}
				// }).sendEmail();

				return 'code-sent';
			}
		} else {
			return 'Invalid email account.';
		}
		// }catch(e){
		// 	throw new Error('while setting confirmation email link');
		// }
	};

	/*
	 * Check confirm link.
	 * @return {string} Returns confirmation code.
	 */
	const checkConfirmLink = async (email: string, hash: string) => {
		// try {
		// Check if the user exist.
		let [res] = await query(
			`SELECT * FROM users WHERE email = '${email}' LIMIT 1`,
		);
		if (res) {
			// If it does try again till you find an id that does not exist.
			let [res] = await query(
				`SELECT * FROM password_links ` +
				`WHERE email = '${email}' AND hash = '${hash}' LIMIT 1`,
			);
			if (res) {
				// Ok you can set the password for user account.
				return await setPassword(email, hash);
			} else {
				// no activation link found.
				return 'no activation link found';
			}
		} else {
			return 'Account with such code confirmation not found';
		}
		// }catch(e){
		// 	throw new Error('while checking confirm link.');
		// }
	};

	/*
	 * Check resend code.
	 * @return {string} Returns account lock code.
	 */
	// const checkResendCode = (email = this.email) => {
	// 	// try{
	// 		let [res] = await query(`SELECT * FROM users WHERE email = '${email}' LIMIT 1`);
	// 		// If it does try again until you find an inexisting id.
	// 		if(res){
	// 			// Check if there is an activation link associated with the account.
	// 			let [res] = await query(`SELECT * FROM password_links WHERE email = '${email}' LIMIT 1`);
	// 			if(res){
	// 				// Ok you can now activate the account.
	// 				await resendCode(email, res[2]);
	// 			}else{
	// 				// No, resend link found.
	// 				return await setConfirmEmailLink();
	// 				// return 'no-activation-link';
	// 			}
	// 		}else{
	// 			return 'code-not-found';
	// 		}
	// 	// }catch(e){
	// 	// 	throw new Error('while checking resend code.');
	// 	// }
	// };

	/* ------------------------------------------- [ PORTFOLIO ] --------------------------------------- */

	/*
	 * Set uset default fiat supported currencies according to country.
	 * @params {number} userId - User id.
	 * @params {string} accountType - Account type slug.
	 */
	const setUserBalance = async (
		userId: number | false,
		accountType: string,
	) => {
		// try{
		// Get supported asset(s).
		// const supportedAssets = await api.asset.getSupported();
		const supportedAssets: any[] = ['btc', 'ltc', 'dash', 'eth', 'usd'];
		const typeId: number = getAccountTypeId(accountType);

		// Get default supported currencies (fiat/crypto).
		const res = await query(
			`SELECT DISTINCT asset_symbol ` +
			`FROM account_balances ` +
			`WHERE user_id = ${userId} ` +
			`AND type_id = ${typeId}`,
		);

		supportedAssets.map(async (symbol: string) => {
			// if((res.length) && (res.indexOf(symbol) < 0)){
			// 	await this.updateBalance(userId, accountType, symbol, 0, 0, 0);
			// }else{
			await updateBalance(userId, accountType, symbol, 0, 0, 0);
			// }
		});

		// }catch(e){
		// 	throw new Error('While setting user country default currencies.');
		// }
	};

	/*
	 * Get user fiat wallet(s) Balance.
	 * @params {boolean} secifyAssetType - Specify asset type.
	 * @params {string} accountType - Account type slug.
	 * @return {object} Return list of user crypto wallet.
	 */
	const getFiatWalletBalance = async (
		userId: number,
		specifyAssetType: boolean = false,
		accountType: string,
	) => {
		// try{
		const typeId: number = getAccountTypeId(accountType);

		const [[minor_currency], [minor_currency_precision]] = await Promise.all([
			query(`SELECT get_minor_currency() AS minor_currency`),
			query(`SELECT get_minor_currency_precision() AS minor_currency_precision`)
		]);

		const res = await query(
			`SELECT w0.asset_symbol, w0.asset_symbol AS symbol, w0.amount, ` +
			`w0.expense, w0.total, w0.last_updated AS updated ` +
			`FROM account_balances AS w0 ` +
			`WHERE w0.user_id = ${userId} AND w0.type_id = ${typeId} `,
		);

		return await (res && res.length
			? Promise.all(
				res.map(async (c: any) => {
					const assetInfo = await api.asset.get(c['symbol']);
					return {
						[c['asset_symbol']]: {
							name: assetInfo['name'],
							color: assetInfo['color'],
							assetAlias: assetInfo['symbolAlias'],
							symbol: c['symbol'],
							amount: setMinorPrecision(
								c['amount'],
								false,
								minor_currency,
								minor_currency_precision,
							),
							expense: setMinorPrecision(
								c['expense'],
								false,
								minor_currency,
								minor_currency_precision,
							),
							total: setMinorPrecision(
								c['total'],
								false,
								minor_currency,
								minor_currency_precision,
							),
							weight: setMinorPrecision(
								0,
								false,
								minor_currency,
								minor_currency_precision,
							),
							// country	 : c['country_iso'],
							// address 	 : c['address'],
							variance: Number(0),
							updated: Number(c['updated']),
							type: assetInfo['type']['slug'],
						},
					};
				}),
			)
			: []);
		// }catch(e){
		// 	throw new Error('while getting user fiat wallet.');
		// }
	};

	/*
	 * Get user crypto wallet(s).
	 * @params {string} accountType - Account type slug.
	 * @params {boolean} secifyAssetType - Specify asset type.
	 * @return {object} Return list of user crypto wallet.
	 */
	const getCryptoWalletBalance = async (
		userId: number,
		specifyAssetType: boolean = false,
		accountType: string,
	) => {
		// try{
		const typeId: number = getAccountTypeId(accountType);

		const [[minor_currency], [minor_currency_precision]] = await Promise.all([
			query(`SELECT get_minor_currency() AS minor_currency`),
			query(`SELECT get_minor_currency_precision() AS minor_currency_precision`)
		]);

		const res = await query(
			`SELECT w0.asset_symbol, w0.asset_symbol AS symbol, w0.amount, ` +
			`w0.expense, w0.total, w0.last_updated AS updated ` +
			`FROM account_balances AS w0 ` +
			`WHERE w0.user_id = ${userId} AND w0.type_id = ${typeId} `,
		);

		return res && res.length ? res.map((c: any) => ({
			[c['asset_symbol']]: {
				// name 	 : c['name'],
				// color	 : c['color'],
				// assetAlias	 : c['symbol_alias'],
				symbol: c['symbol'],
				amount: setMinorPrecision(
					c['amount'],
					false,
					minor_currency,
					minor_currency_precision,
				),
				expense: setMinorPrecision(
					c['expense'],
					false,
					minor_currency,
					minor_currency_precision,
				),
				total: setMinorPrecision(
					c['total'],
					false,
					minor_currency,
					minor_currency_precision,
				),
				weight: setMinorPrecision(
					0,
					false,
					minor_currency,
					minor_currency_precision,
				),
				// country	 : c['country_iso'],
				// address 	 : res[c]['address'],
				variance: Number(0),
				updated: Number(c['updated']),
				type: 'crypto',
			},
		})) : [];
		// }catch(e){
		// 	throw new Error('while getting user crypto wallet.');
		// }
	};

	/*
	 * Update user account_balances.
	 * @params {number} userID - User id.
	 * @params {string} asset - Portfolio asset.
	 * @params {string} accountType - Account type slug.
	 * @params {number} amount - Asset amount.
	 * @params {number} expense - Asset expense.
	 * @params {number} total - Asset total value.
	 */
	const updateBalance = async (
		userId: number | false,
		accountType: string,
		asset: string,
		amount: number = 0,
		expense: number = 0,
		total: number = 0,
	) => {
		// try{
		const typeId: number = getAccountTypeId(accountType);

		const res = await query(
			`SELECT * FROM account_balances ` +
			`WHERE user_id = ${userId} ` +
			`AND asset_symbol = '${asset}' ` +
			`AND type_id = ${typeId} LIMIT 1`,
		);

		if (res && res.length) {
			// Update if exist.
			await query(
				`UPDATE account_balances SET amount = amount + ${amount}, ` +
				`expense = expense + ${expense}, total = total + ${total}, ` +
				`last_updated = ${getEpochDatetime()} WHERE user_id = ${userId} ` +
				`AND asset_symbol = '${asset}' AND type_id = ${typeId}; `,
			);
		} else {
			// Insert if not exist.
			await query(
				`INSERT INTO account_balances ` +
				`(user_id, type_id, asset_symbol, amount, expense, total, last_updated) ` +
				`VALUES (${userId}, ${typeId}, '${asset}', ${amount}, ${expense}, ${total}, ${getEpochDatetime()})`,
			);
		}
		// }catch(e){
		// 	throw new Error('While inserting/updating account_balances.');
		// }
	};

	/*
	 * Evaluate user portfolio.
	 * @param {array} data - Data.
	 * @returns {object} data - Wallet list & variance.
	 */
	const evaluatePortfolio = async (accountType: string = 'savings') => {
		// try{
		// log.info('Evaluate 0');
		// const wallet: any = await getCryptoWallet(accountType);
		// log.info(wallet);
		// const data: any[] = wallet.list;
		//
		// // TOTO
		// var walletElts: any[] = [], walletReturn: number = 0, totalExpense: number = 0, totalValue: number = 0;
		// // a.0) Get asset(s) 24h market historical data while evaluating asset(s) expense & value.
		// for(let i = data.length - 1; i >= 0; i -= 1){
		// 	// Initializing account controller and get asset historical data.
		// 	const marketData: any = await new Asset({
		// 		'day' 		: 1,
		// 		'assetSymbol' 	: data[i].symbol
		// 	}).getHistory();
		// 	totalExpense += data[i].expense;
		// 	totalValue += data[i].amount * marketData.price[marketData.price.length - 1][1];
		// 	// walletElts.push(
		// 	// 	Object.assign({}, data[i], {
		// 	// 		'market' : {
		// 	// 			'cap' 	 : marketData.cap,
		// 	// 			'price'  : marketData.price,
		// 	// 			'volume' : marketData.volume
		// 	// 		}
		// 	// 	})
		// 	// );
		// 	walletElts.push({
		// 		...data[i], {
		// 			'market' : {
		// 				'cap' 	 : marketData.cap,
		// 				'price'  : marketData.price,
		// 				'volume' : marketData.volume
		// 			}
		// 		}
		// 	});
		// }
		// log.info('Evaluate 0');
		// // a.1) Evaluate asset(s) return and wallet weight (%).
		// for(let i = walletElts.length - 1; i >= 0; i -= 1){
		// 	var assetWeight: number = (walletElts[i].amount * walletElts[i].market.price[walletElts[i].market.price.length - 1][1]) * (100/totalValue);
		// 	// walletElts[i] = (
		// 	// 	Object.assign({}, walletElts[i], {
		// 	// 		'return' : ((walletElts[i]['expense'] * (100/totalExpense))),
		// 	// 		'weight' : assetWeight
		// 	// 	})
		// 	// );
		// 	walletElts[i] = {
		// 		...walletElts[i], {
		// 			'return' : walletElts[i]['expense'] * (100/totalExpense),
		// 			'weight' : assetWeight
		// 		}
		// 	};
		// }
		// log.info('Evaluate 1');
		// // a.2 Evaluate asset(s) standard deviation.
		// for(let i = walletElts.length - 1; i >= 0; i--){
		// 	var assetPrices: any[] = [];
		// 	// Get asset(s) price.
		// 	for(let j = walletElts[i].market.price.length - 1; j >= 0; j--){
		// 		assetPrices.push(walletElts[i].market.price[j][1]);
		// 	}
		// 	// Evaluate asset(s) sample deviation.
		// 	// const assetDeviation: number = new SM({
		// 	// 	'elts' : assetPrices
		// 	// }).stdS();
		// 	const assetDeviation: number = 0;
		// 	// walletElts[i] = (
		// 	// 	Object.assign({}, walletElts[i], {
		// 	// 		'deviation' 	: assetDeviation,
		// 	// 		'price' 	: assetPrices
		// 	// 	})
		// 	// );
		//
		// 	walletElts[i] = {
		// 		...walletElts[i], {
		// 			'deviation' 	: assetDeviation,
		// 			'price' 	: assetPrices
		// 		}
		// 	};
		// }
		// log.info('Evaluate 2');
		// // a.3) Evaluate wallet variance.
		// var variance: number = 0;
		// for(var m = walletElts.length - 1; m >= 0; m -= 1){
		// 	for(var n = m; n >= 0; n -= 1){
		// 		if(m == n){
		// 			// Variance element for m = n.
		// 			variance += (Math.pow(walletElts[m].weight, 2) * Math.pow(walletElts[m].deviation, 2));
		// 		}else{
		// 			// Variance element for m != n.
		// 			// const cov = new SM({ 'elts'	: [walletElts[m].price, walletElts[n].price] }).covariance();
		// 			const cov: number = 0;
		// 			variance += (2*(walletElts[m].weight * walletElts[n].weight * cov));
		// 		}
		// 	}
		// }
		//
		// log.info('Evaluate 3');
		// // return walletElts;
		// // Return evaluated protfolio.
		// return {
		// 	'list' 		: walletElts,
		// 	'variance' 	: variance
		// }
		// }catch(e){
		// 	throw new Error('while getting asset historical market data.');
		// }
	};

	/*
	 * Get user service health.
	 */
	const getUserHealth = getHealth;

	return Object.freeze({
		_formatUserData,
		getByUserEmail,
		findById,
		getUserById,
		getUsers,
		genUserId,
		checkLogin,
		checkAdminLogin,
		checkActivation,
		checkBruteforce,
		checkIfSuspended,
		checkWhitelist,
		authenticate,
		checkReferralCode,
		getUserWalletBalance,
		addUserWallets,
		createAccount,
		updateUser,
		deleteUserById,
		logAccess,
		getAccessLogs,
		setAccountLock,
		checkAccountLock,
		checkLockStatus,
		// checkResendCode,
		setActivationLink,
		activateAccount,
		checkActivationLink,
		deleteActivationLink,
		resendCode,
		setConfirmEmailLink,
		checkConfirmLink,
		setUserBalance,
		getFiatWalletBalance,
		getCryptoWalletBalance,
		updateBalance,
		evaluatePortfolio,
		getUserHealth,
	});
};

export default usersModel;
