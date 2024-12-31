// @ts-nocheck

'use strict';

const makeSystemModel = ({ api, utils, config, models }) => {

	const { log, query } = utils;

	/*
	* Fetch system setting allowed registration.
	* @returns {Boolean} Returns allowed registration.
	*/
	const fetchAllowRegistration = async () => {
		// try{
			log.info('Get allow registration system setting.');
			const [res] = await query(
				`SELECT data FROM core_settings `+
				`WHERE name = 'allow_registration' LIMIT 1`
			);
			return Boolean(JSON.parse(res.data));
		// }catch(e){
		// 	throw new Error('while fetching "allow registration" system setting.');
		// }
	};

	/*
	* Fetch system setting verify email.
	* @returns {Boolean} Returns verify email.
	*/
	const fetchVerifyEmail = async () => {
		try{
			log.info('Get verify email.');
			const [res] = await query(
				`SELECT data FROM core_settings `	+
				`WHERE name = 'verify_email' LIMIT 1`
			);
			return Boolean(JSON.parse(res.data));
		}catch(e){
			throw new Error('while fetching "verify email" system setting.');
		}
	};

	/*
	* Get system setting bruteforce limit.
	* @returns {Number} Returns bruteforce limit.
	*/
	const fetchBruteforceLimit = async () => {
		try{
			log.info('Get bruteforce limit system setting.');
			const [res] = await query(
				`SELECT data FROM core_settings `	+
				`WHERE name = 'bruteforce_limit' LIMIT 1`
			);
			return Number(res.data);
		}catch(e){
			throw new Error('while fetching "bruteforce limit" system setting.');
		}
	};

	/*
	* Fetch system setting bruteforce timeout.
	* @returns {Number} Returns bruteforce timeout.
	*/
	const fetchBruteforceTimeout = async () => {
		try{
			log.info('Get bruteforce timeout system setting.');
			const [res] = await query(
				`SELECT data FROM core_settings `	+
				`WHERE name = 'bruteforce_timeout' LIMIT 1`
			);
			return Number(res.data);
		}catch(e){
			throw new Error('while fetching "bruteforce timeout" system setting.');
		}
	};

	/*
	* Fetch system setting account timeout.
	* @returns {Number} Returns account timeout.
	*/
	const fetchAccountLockTimeout = async () => {
		try{
			log.info('Get account lock timeout system setting.');
			const [res] = await query(
				`SELECT data FROM core_settings `	+
				`WHERE name = 'account_lock_timeout' LIMIT 1`
			);
			return Number(res.data);
		}catch(e){
			throw new Error('while fetching "account timeout" system setting.');
		}
	};

	/*
	* Fetch system setting email timeout.
	* @returns {Number} Returns email timeout.
	*/
	const fetchEmailTimeout = async () => {
		try{
			log.info('Get email timeout system setting.');
			const [res] = await query(
				`SELECT data FROM core_settings `+
				`WHERE name = 'email_timeout' LIMIT 1`
			);
			return Number(res.data);
		}catch(e){
			throw new Error('while fetching "email timeout" system setting.');
		}
	};

	/*
	* Fetch system setting email process interval.
	* @returns {Number} Returns email process interval
	*/
	const fetchEmailProcessInterval = async () => {
		// try{
			log.info('Get email process interval system setting.');
			const [res] = await query(
				`SELECT data FROM core_settings `	+
				`WHERE name = 'email_process_interval' LIMIT 1`
			);
			return Number(res.data);
		// }catch(e){
		// 	throw new Error('while fetching "email process interval" system setting.');
		// }
	};

	/*
	* Fetch system setting base language.
	* @returns {String} Returns base language.
	*/
	const fetchBaseLanguage = async () => {
		// try{
			log.info('Get base language system setting.');
			const [res] = await query(
				`SELECT data FROM core_settings `+
				`WHERE name = 'base_language' LIMIT 1`
			);
			return res.data;
		// }catch(e){
		// 	throw new Error('while fetching "base language" system setting.');
		// }
	};

	/*
	* Fetch system setting base country.
	* @returns {String} Returns base country.
	*/
	const fetchBaseCountry = async () => {
		// try{
			log.info('Get base country system setting.');
			const [res] = await query(
				`SELECT data FROM core_settings `+
				`WHERE name = 'base_country' LIMIT 1`
			);
			return res.data;
		// }catch(e){
		// 	throw new Error('while fetching "base country" system setting.');
		// }
	};

	/*
	* Fetch system setting base currency.
	* @returns {String} Returns base currency.
	*/
	const fetchBaseCurrency = async () => {
		// try{
			log.info('Get base currency system setting.');
			const [res] = await query(
				`SELECT data FROM core_settings `+
				`WHERE name = 'base_currency' LIMIT 1`
			);
			return res.data;
		// }catch(e){
		// 	throw new Error('while fetching "base currency" system setting.');
		// }
	};

	/*
	* Fetch system setting minor currency.
	* @returns {Number} Returns minor currency.
	*/
	const fetchMinorCurrency = async () => {
		// try{
			log.info('Get minor currency system setting.');
			const [res] = await query(
				`SELECT data FROM core_settings `+
				`WHERE name = 'minor_currency' LIMIT 1`
			);
			return Number(res.data);
		// }catch(e){
		// 	throw new Error('while fetching "minor currency" system setting.');
		// }
	};

	/*
	* Fetch system setting jwt secret.
	* @returns {String} Returns jwt secret hash.
	*/
	const fetchJWTSecret = async () => {
		// try{
			log.info('Get JWT secret system setting.');
			const [res] = await query(
				`SELECT data FROM core_settings `+
				`WHERE name = 'jwt_secret' LIMIT 1`
			);
			return res.data;
		// }catch(e){
		// 	throw new Error('while fetching "jwt secret" system setting.');
		// }
	};

	/*
	* Fetch system setting currency precision.
	* @returns {Number} Returns currency precision.
	*/
	const fetchCurrencyPrecision = async () => {
		log.info('Get currency precision system setting.');
		const [res] = await query(
			`SELECT data FROM core_settings `+
			`WHERE name = 'minor_currency' LIMIT 1`
		);
		return String(Number(res.data)).length - 1;
	};

	return Object.freeze({
		fetchAllowRegistration,
		fetchVerifyEmail,
		fetchBruteforceLimit,
		fetchBruteforceTimeout,
		fetchAccountLockTimeout,
		fetchEmailTimeout,
		fetchEmailProcessInterval,
		fetchBaseLanguage,
		fetchBaseCountry,
		fetchBaseCurrency,
		fetchMinorCurrency,
		fetchJWTSecret,
		fetchCurrencyPrecision,
	});

};

export default makeSystemModel;
