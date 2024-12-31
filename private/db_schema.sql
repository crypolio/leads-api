DROP TABLE IF EXISTS core_settings;

CREATE TABLE core_settings ( 
	name 				VARCHAR(100) 				 NOT NULL,
	data 				VARCHAR(250) 				 NOT NULL
);

INSERT  INTO core_settings (name, data) VALUES  
('init_geoip', 	 		'0'), 
('init_exchanges', 	 	'0'), 
('init_markets', 	 	'0'), 
('verify_email', 	 	'1'), 
('allow_registration', 	 	'1'), 
('bruteforce_limit', 	 	'25'), 
('bruteforce_timeout', 	 	'3600'), 
('account_lock_timeout', 	'1800'), 
('email_timeout', 	 	'300'),
('email_process_interval',  	'300000'),
('sms_timeout', 	 	'300'),
('sms_process_interval',  	'300000'),
('market_process_interval',  	'300000'),
('base_language', 	 	'en'),
('base_country', 	 	'us'),
('base_currency', 	 	'usd'),
('transaction_fee', 	 	'0.2'),
('minor_currency', 	 	'100000000'),
('minor_currency_precision',  	'8'),
('jwt_secret', 		 	'Jsb3rc!rl3lt@lnyt'),
('min_confirmation', 		'6'),
('transaction_max_amount', 	'1000000000000'),
('transaction_min_amount', 	'1');

-- Helper function to get core_settings account_lock_timeout -----------------------------------------------------------
CREATE OR REPLACE FUNCTION get_account_lock_timeout()
    RETURNS INTEGER  
    LANGUAGE PLPGSQL
AS $$
DECLARE
    res INTEGER;
BEGIN
	    SELECT CAST(data AS INTEGER) INTO res FROM core_settings WHERE name = 'account_lock_timeout' LIMIT 1;
	    RETURN res;
END; 
$$; 

-- Helper function to get core_settings verify_email -------------------------------------------------------------------
CREATE OR REPLACE FUNCTION get_verify_email()
    RETURNS INTEGER  
    LANGUAGE PLPGSQL
AS $$
DECLARE
    res INTEGER;
BEGIN
	    SELECT CAST(data AS INTEGER) INTO res FROM core_settings WHERE name = 'verify_email' LIMIT 1;
	    RETURN res;
END; 
$$; 

-- Helper function to get core_settings email_timeout ------------------------------------------------------------------
CREATE OR REPLACE FUNCTION get_email_timeout()
    RETURNS INTEGER  
    LANGUAGE PLPGSQL
AS $$
DECLARE
    res INTEGER;
BEGIN
	    SELECT CAST(data AS INTEGER) INTO res FROM core_settings WHERE name = 'email_timeout' LIMIT 1;
	    RETURN res;
END; 
$$; 

-- Helper function to get core_settings minor_currency -----------------------------------------------------------------
CREATE OR REPLACE FUNCTION get_minor_currency()
    RETURNS INTEGER  
    LANGUAGE PLPGSQL
AS $$
DECLARE
    res INTEGER;
BEGIN
	    SELECT CAST(data AS INTEGER) INTO res FROM core_settings WHERE name = 'minor_currency' LIMIT 1;
	    RETURN res;
END; 
$$; 

-- Helper function to get core_settings bruteforce_limit ---------------------------------------------------------------
CREATE OR REPLACE FUNCTION get_bruteforce_limit()
    RETURNS INTEGER  
    LANGUAGE PLPGSQL
AS $$
DECLARE
    res INTEGER;
BEGIN
	    SELECT CAST(data AS INTEGER) INTO res FROM core_settings WHERE name = 'bruteforce_limit' LIMIT 1;
	    RETURN res;
END; 
$$; 

-- Helper function to get core_settings bruteforce_timeout -------------------------------------------------------------
CREATE OR REPLACE FUNCTION get_bruteforce_timeout()
    RETURNS INTEGER  
    LANGUAGE PLPGSQL
AS $$
DECLARE
    res INTEGER;
BEGIN
	SELECT CAST(data AS INTEGER) INTO res FROM core_settings WHERE name = 'bruteforce_timeout' LIMIT 1;
	RETURN res;
END; 
$$; 

-- Helper function to get core_settings allow_registration -------------------------------------------------------------
CREATE OR REPLACE FUNCTION get_allow_registration()
    RETURNS INTEGER  
    LANGUAGE PLPGSQL
AS $$
DECLARE
    res INTEGER;
BEGIN
	    SELECT CAST(data AS INTEGER) INTO res FROM core_settings WHERE name = 'allow_registration' LIMIT 1;
	    RETURN res;
END; 
$$; 

-- Helper function to get core_settings minor_currency_precision -------------------------------------------------------
CREATE OR REPLACE FUNCTION get_allow_registration()
    RETURNS INTEGER  
    LANGUAGE PLPGSQL
AS $$
DECLARE
    res INTEGER;
BEGIN
	    SELECT CAST(data AS INTEGER) INTO res FROM core_settings WHERE name = 'minor_currency_precision' LIMIT 1;
	    RETURN res;
END; 
$$; 

------------------------------------------------------------------------------------------------------------------------
DROP TABLE IF EXISTS access_logs;

CREATE TABLE access_logs (
	user_id 			INTEGER 			       	 NOT NULL,
	ip_address 			VARCHAR(45) 				 NOT NULL,
	datetime 			INTEGER 			       	 NOT NULL,
	country_iso 			VARCHAR(3) 				 NOT NULL,
	state 				VARCHAR(3) 				 DEFAULT NULL,
	city 				VARCHAR(70) 				 DEFAULT NULL,
	browser 			VARCHAR(25) 				 DEFAULT NULL,
	os 				VARCHAR(15) 				 DEFAULT NULL
);

DROP TABLE IF EXISTS account_locks;

CREATE TABLE account_locks (
	user_id 			INTEGER 				 NOT NULL,
	code 				VARCHAR(10) 				 NOT NULL,
	datetime 			INTEGER 				 NOT NULL,
	PRIMARY KEY ("user_id")
);

DROP TABLE IF EXISTS activation_links;

CREATE TABLE activation_links (
	email 				VARCHAR(255) 				 NOT NULL,
	hash 				VARCHAR(255) 				 NOT NULL,
	done 				BOOLEAN 				 NOT NULL
);

DROP TABLE IF EXISTS bruteforce_watchlist;

CREATE TABLE bruteforce_watchlist (
	ip_address 			VARCHAR(45) 				 NOT NULL,
	datetime 			INTEGER 				 NOT NULL,
	attempt 			INTEGER 				 NOT NULL
);

DROP TABLE IF EXISTS password_links;

CREATE TABLE password_links ( 
	-- id 				INTEGER 		 		 NOT NULL,
	email 				VARCHAR(255) 				 NOT NULL,
	hash 				VARCHAR(15) 				 NOT NULL
	-- PRIMARY KEY ("id")
);

DROP TABLE IF EXISTS kyc_status CASCADE;

CREATE TABLE kyc_status ( 
	code 				INTEGER					 NOT NULL,
	slug 				VARCHAR(45) 				 NOT NULL DEFAULT '',
	PRIMARY KEY ("code")
);

INSERT INTO kyc_status VALUES (-2, 'declined'), (-1, 'na'), (0, 'pending'), (1, 'approved');

DROP TABLE IF EXISTS account_infos CASCADE;

CREATE TABLE account_infos ( 
	user_id				INTEGER 				 NOT NULL,
	email				VARCHAR(254) 				 NOT NULL,
	phone				VARCHAR(150) 				 DEFAULT '',
	alt_email			VARCHAR(254) 				 DEFAULT '',
	alt_phone			VARCHAR(150) 				 DEFAULT '',
	first_name			VARCHAR(46) 				 NOT NULL DEFAULT '',
	last_name			VARCHAR(46) 				 NOT NULL DEFAULT '',
	gender				CHAR(1) 				 NOT NULL,
	dbo_year 			INTEGER 				 NULL,
	dbo_month			INTEGER 				 NULL,
	dbo_day				INTEGER 				 NULL,
	currency			VARCHAR(5)  				 DEFAULT 'usd',
	locale 				VARCHAR(15) 				 DEFAULT 'en-US',
	PRIMARY KEY ("user_id")
);

INSERT INTO account_infos VALUES (769912, 'choleski@gmx.com', '', '', '', 'Super', 'Admin', 'm', 1995, 29, 05, 'cad', 'en-US');


DROP TABLE IF EXISTS users;

CREATE TABLE users ( 
	id				INTEGER 				 NOT NULL,
	level_id 			INTEGER 				 NOT NULL,
	kyc_status_id 			INTEGER 				 NOT NULL DEFAULT 1,
	date_created			INTEGER 				 NOT NULL,
	locked 				BOOLEAN 				 NOT NULL DEFAULT false,
	activated			BOOLEAN 				 NOT NULL DEFAULT true,
	suspended			BOOLEAN 				 NOT NULL DEFAULT false,
	last_ip				VARCHAR(45) 				 NOT NULL DEFAULT '',
	signup_ip			VARCHAR(45) 				 NOT NULL DEFAULT '',
	last_login			INTEGER 				 NOT NULL,
	login_count			INTEGER 				 NOT NULL DEFAULT 0,
	referred_by			VARCHAR(15) 				 DEFAULT '',
	country_iso 			VARCHAR(15) 				 DEFAULT 'US',
	whitelist			BOOLEAN 				 NOT NULL DEFAULT false,
	ip_whitelist			TEXT 	    				 DEFAULT '',
	PRIMARY KEY ("id")
);

INSERT INTO users VALUES (769912, 906329, 1, 1553621797, false, true, false, '127.0.0.1', '127.0.0.1', 1553621797, 0, '', 'US', false, '');

DROP TABLE IF EXISTS user_credentials;

CREATE TABLE user_credentials ( 
	user_id 			INTEGER 				 NOT NULL,
	password 			VARCHAR(255) 				 NOT NULL,
	salt 				VARCHAR(255) 				 NOT NULL,
	PRIMARY KEY ("user_id")
);

INSERT INTO user_credentials VALUES (769912,'/QOr.aB2UABfIrHsV7CDNDX7tOW15IO','$2b$10$SDfc1hEv96VjUZkaU1ImOO');

DROP TABLE IF EXISTS account_levels;

CREATE TABLE account_levels ( 
	id 				INTEGER 				 NOT NULL,
	name 				VARCHAR(20) 				 NOT NULL,
	slug 				VARCHAR(20) 				 NOT NULL,
	auto 				INTEGER 				 NOT NULL,
	redirect_page 			VARCHAR(10) 				 NOT NULL DEFAULT '/',
	PRIMARY KEY ("id")
);

INSERT  INTO account_levels (id, name, slug, auto, redirect_page) VALUES 	
(197347, 'Guest', 'guest', 0, '/'),
(549313, 'Quant', 'quant', 1, '/dashboard'),
(906329, 'Admin', 'admin', 0, '/dashboard');

ALTER TABLE users ADD FOREIGN KEY (level_id) REFERENCES account_levels(id);

ALTER TABLE users ADD FOREIGN KEY (id) REFERENCES account_infos(user_id);

ALTER TABLE users ADD FOREIGN KEY (kyc_status_id) REFERENCES kyc_status(code);

-- TODO: Deprtecate
DROP TABLE IF EXISTS account_balances;

CREATE TABLE account_balances ( 
	user_id 			INTEGER 				 NOT NULL,
	type_id 			INTEGER 				 NOT NULL,
	asset_symbol 			VARCHAR(25) 				 NOT NULL,
	amount 				BIGINT 					 NOT NULL DEFAULT 0,
	expense 			BIGINT 					 NOT NULL DEFAULT 0,
	total 				BIGINT 					 NOT NULL DEFAULT 0,
	last_updated 			INTEGER 				 NOT NULL
);

DROP TABLE IF EXISTS addresses;

CREATE TABLE addresses ( 
	id 				INTEGER 				 NOT NULL,
	country_iso 			VARCHAR(3) 				 NOT NULL,
	subdivision1_iso 		VARCHAR(3) 				 DEFAULT NULL,
	subdivision2_iso 		VARCHAR(3) 				 DEFAULT NULL,
	zip_postal_code 		VARCHAR(32) 				 NOT NULL,
	line_1 				VARCHAR(35) 				 DEFAULT NULL,
	line_2 				VARCHAR(35) 				 DEFAULT NULL
);

DROP TABLE IF EXISTS user_addresses;

CREATE TABLE user_addresses ( 
	addr_id 			INTEGER 				 NOT NULL,
	user_id 			INTEGER 				 NOT NULL,
	is_primary 			BOOLEAN 				 NOT NULL DEFAULT false
);

