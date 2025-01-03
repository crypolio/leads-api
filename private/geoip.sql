-- Ip geonames.
DROP TABLE IF EXISTS ip_geonames;

CREATE TABLE ip_geonames (
	id 				DECIMAL(10,0) 				 NOT NULL,
	country_iso 			VARCHAR(3) 				 NOT NULL,
	subdivision1_iso 		VARCHAR(3) 				 DEFAULT NULL,
	subdivision2_en_name 		VARCHAR(70) 				 DEFAULT NULL
);

-- Contineents.
DROP TABLE IF EXISTS continents;

CREATE TABLE continents (
	iso 				VARCHAR(2) 				 NOT NULL,
	name_de 			VARCHAR(20) 				 DEFAULT NULL,
	name_en 			VARCHAR(20) 				 DEFAULT NULL,
	name_es 			VARCHAR(20) 				 DEFAULT NULL,
	name_fr 			VARCHAR(20) 				 DEFAULT NULL,
	name_ja 			VARCHAR(20) 				 DEFAULT NULL,
	name_pt_br 			VARCHAR(20) 				 DEFAULT NULL,
	name_ru 			VARCHAR(20) 				 DEFAULT NULL,
	name_zh_cn 			VARCHAR(20) 				 DEFAULT NULL,
	PRIMARY KEY ("iso")
);

DROP TABLE IF EXISTS countries;

CREATE TABLE countries (
	continent_iso 			VARCHAR(2) 				 NOT NULL,
	iso 				VARCHAR(2) 				 NOT NULL,
	is_in_european_union 		BOOLEAN 				 NOT NULL DEFAULT false,
	name_de 			VARCHAR(60) 				 DEFAULT NULL,
	name_en 			VARCHAR(60) 				 DEFAULT NULL,
	name_es 			VARCHAR(60) 				 DEFAULT NULL, 
	name_fr 			VARCHAR(60) 				 DEFAULT NULL,
	name_ja 			VARCHAR(60) 				 DEFAULT NULL,
	name_pt_br 			VARCHAR(60) 				 DEFAULT NULL,
	name_ru 			VARCHAR(60) 				 DEFAULT NULL,
	name_zh_cn 			VARCHAR(60) 				 DEFAULT NULL,
	PRIMARY KEY ("iso")
);

-- States / provinces
DROP TABLE IF EXISTS subdivision1;

CREATE TABLE subdivision1 (
	country_iso 			VARCHAR(2) 				 NOT NULL,
	iso 				VARCHAR(3) 				 NOT NULL,
	time_zone 			VARCHAR(70) 				 DEFAULT NULL,
	name_de 			VARCHAR(70) 				 DEFAULT NULL,
	name_en 			VARCHAR(70) 				 DEFAULT NULL,
	name_es 			VARCHAR(70) 				 DEFAULT NULL,
	name_fr 			VARCHAR(70) 				 DEFAULT NULL,
	name_ja 			VARCHAR(70) 				 DEFAULT NULL,
	name_pt_br 			VARCHAR(70) 				 DEFAULT NULL,
	name_ru 			VARCHAR(70) 				 DEFAULT NULL,
	name_zh_cn 			VARCHAR(70) 				 DEFAULT NULL
);

-- City
DROP TABLE IF EXISTS subdivision2;

CREATE TABLE subdivision2 (
	subdivision1_iso 		VARCHAR(3) 				 NOT NULL,
	name_de 			VARCHAR(70) 				 DEFAULT NULL,
	name_en 			VARCHAR(70) 				 DEFAULT NULL,
	name_es 			VARCHAR(70) 				 DEFAULT NULL,
	name_fr 			VARCHAR(70) 				 DEFAULT NULL,
	name_ja 			VARCHAR(70) 				 DEFAULT NULL,
	name_pt_br 			VARCHAR(70) 				 DEFAULT NULL,
	name_ru 			VARCHAR(70) 				 DEFAULT NULL,
	name_zh_cn 			VARCHAR(70) 				 DEFAULT NULL
);

-- Countries currency symbol, language.
DROP TABLE IF EXISTS country_info;

CREATE TABLE country_info ( 
	country_iso 			VARCHAR(2) 				 NOT NULL,
	currency_symbol 		VARCHAR(5) 				 NOT NULL,
	lang_locale 			VARCHAR(5) 				 NOT NULL,
	is_issuer 			BOOLEAN 				 NOT NULL DEFAULT false,
	is_supported 			BOOLEAN 				 NOT NULL DEFAULT false
);

INSERT INTO country_info (country_iso, currency_symbol, lang_locale, is_issuer) VALUES 
('aa',		 'awg', 	'en',		true),
('aa',		 'awg', 	'es',		true),
('aa',		 'awg', 	'nl-AW',	true),
('ac',		 'xcd', 	'en-AG',	false),
('ae',		 'aed', 	'ar-AE',	false),
('ae',		 'aed', 	'en',		false),
('ae',		 'aed', 	'fa',		false),
('ae',		 'aed', 	'hi',		false),
('ae',		 'aed', 	'ur',		false),
('af',		 'afn', 	'fa-AF',	true),
('af',		 'afn', 	'ps',		true),
('af',		 'afn', 	'tk',		true),
('af',		 'afn', 	'uz-AF',	true),
('ag',		 'dzd', 	'ar-DZ',	false),
('aj',		 'azn', 	'az',		true),
('aj',		 'azn', 	'hy',		true),
('aj',		 'azn', 	'ru',		true),
('al',		 'all', 	'el',		true),
('al',		 'all', 	'sq',		true),
('am',		 'amd', 	'hy',		false),
('an',		 'eur', 	'ca',		false),
('ao',		 'aoa', 	'pt-AO',	false),
('aq',		 'usd', 	'en-AS',	false),
('aq',		 'usd', 	'sm',		false),
('aq',		 'usd', 	'to',		false),
('ar',		 'ars', 	'de',		true),
('ar',		 'ars', 	'en',		true),
('ar',		 'ars', 	'es-AR',	true),
('ar',		 'ars', 	'fr',		true),
('ar',		 'ars', 	'gn',		true),
('ar',		 'ars', 	'it',		true),
('as',		 'aud', 	'en-AU',	false),
('at',		 'aud', 	'en-AU',	false),
('au',		 'eur', 	'de-AT',	false),
('au',		 'eur', 	'hr',		false),
('au',		 'eur', 	'hu',		false),
('au',		 'eur', 	'sl',		false),
('av',		 'xcd', 	'en-AI',	false),
('ba',		 'bhd', 	'ar-BH',	false),
('ba',		 'bhd', 	'en',		false),
('ba',		 'bhd', 	'fa',		false),
('ba',		 'bhd', 	'ur',		false),
('bb',		 'bbd', 	'en-BB',	true),
('bc',		 'bwp', 	'en-BW',	true),
('bc',		 'bwp', 	'tn-BW',	true),
('bd',		 'bmd', 	'en-BM',	true),
('bd',		 'bmd', 	'pt',		true),
('be',		 'eur', 	'de-BE',	false),
('be',		 'eur', 	'fr-BE',	false),
('be',		 'eur', 	'nl-BE',	false),
('bf',		 'bsd', 	'en-BS',	true),
('bg',		 'bdt', 	'bn-BD',	false),
('bg',		 'bdt', 	'en',		false),
('bh',		 'bzd', 	'en-BZ',	true),
('bh',		 'bzd', 	'es',		true),
('bk',		 'bam', 	'bs',		true),
('bk',		 'bam', 	'hr-BA',	true),
('bk',		 'bam', 	'sr-BA',	true),
('bl',		 'bob', 	'ay',		true),
('bl',		 'bob', 	'es-BO',	true),
('bl',		 'bob', 	'qu',		true),
('bm',		 'mmk', 	'my',		false),
('bn',		 'xof', 	'fr-BJ',	false),
('bo',		 'byn', 	'be',		true),
('bo',		 'byn', 	'ru',		true),
('bp',		 'sbd', 	'en-SB',	true),
('bp',		 'sbd', 	'tpi',		true),
('bq',		 'usd', 	'en-UM',	false),
('br',		 'brl', 	'en',		true),
('br',		 'brl', 	'es',		true),
('br',		 'brl', 	'fr',		true),
('br',		 'brl', 	'pt-BR',	true),
('bt',		 'btn', 	'dz',		false),
('bt',		 'inr', 	'dz',		false),
('bu',		 'bgn', 	'bg',		true),
('bu',		 'bgn', 	'rom',		true),
('bu',		 'bgn', 	'tr-BG',	true),
('bx',		 'bnd', 	'en-BN',	true),
('bx',		 'bnd', 	'ms-BN',	true),
('by',		 'bif', 	'fr-BI',	false),
('by',		 'bif', 	'rn',		false),
('ca',		 'cad', 	'en-CA',	true),
('ca',		 'cad', 	'fr-CA',	true),
('ca',		 'cad', 	'iu',		true),
('cb',		 'khr', 	'en',		true),
('cb',		 'khr', 	'fr',		true),
('cb',		 'khr', 	'km',		true),
('cd',		 'xaf', 	'ar-TD',	false),
('cd',		 'xaf', 	'fr-TD',	false),
('cd',		 'xaf', 	'sre',		false),
('ce',		 'lkr', 	'en',		true),
('ce',		 'lkr', 	'si',		true),
('ce',		 'lkr', 	'ta',		true),
('cf',		 'xaf', 	'fr-CG',	false),
('cf',		 'xaf', 	'kg',		false),
('cf',		 'xaf', 	'ln-CG',	false),
('cg',		 'cdf', 	'fr-CD',	false),
('cg',		 'cdf', 	'kg',		false),
('cg',		 'cdf', 	'ln',		false),
('ch',		 'cny', 	'dta',		true),
('ch',		 'cny', 	'ug',		true),
('ch',		 'cny', 	'wuu',		true),
('ch',		 'cny', 	'yue',		true),
('ch',		 'cny', 	'za',		true),
('ch',		 'cny', 	'zh-CN',	true),
('ci',		 'clp', 	'es-CL',	true),
('cj',		 'kyd', 	'en-KY',	true),
('ck',		 'aud', 	'en',		false),
('ck',		 'aud', 	'ms-CC',	false),
('cm',		 'xaf', 	'en-CM',	false),
('cm',		 'xaf', 	'fr-CM',	false),
('cn',		 'kmf', 	'ar',		false),
('cn',		 'kmf', 	'fr-KM',	false),
('co',		 'cop', 	'es-CO',	true),
('cq',		 'usd', 	'ch-MP',	false),
('cq',		 'usd', 	'en-MP',	false),
('cq',		 'usd', 	'fil',		false),
('cq',		 'usd', 	'tl',		false),
('cq',		 'usd', 	'zh',		false),
('cs',		 'crc', 	'en',		true),
('cs',		 'crc', 	'es-CR',	true),
('ct',		 'xaf', 	'fr-CF',	false),
('ct',		 'xaf', 	'kg',		false),
('ct',		 'xaf', 	'ln',		false),
('ct',		 'xaf', 	'sg',		false),
('cu',		 'cuc', 	'es-CU',	true),
('cu',		 'cup', 	'es-CU',	true),
('cv',		 'cve', 	'pt-CV',	false),
('cw',		 'nzd', 	'en-CK',	false),
('cw',		 'nzd', 	'mi',		false),
('cy',		 'eur', 	'el-CY',	false),
('cy',		 'eur', 	'en',		false),
('cy',		 'eur', 	'tr-CY',	false),
('da',		 'dkk', 	'da-DK',	false),
('da',		 'dkk', 	'de-DK',	false),
('da',		 'dkk', 	'en',		false),
('da',		 'dkk', 	'fo',		false),
('dj',		 'djf', 	'aa',		false),
('dj',		 'djf', 	'ar',		false),
('dj',		 'djf', 	'fr-DJ',	false),
('dj',		 'djf', 	'so-DJ',	false),
('do',		 'xcd', 	'en-DM',	false),
('dq',		 'usd', 	'en-UM',	false),
('dr',		 'dop', 	'es-DO',	true),
('ec',		 'usd', 	'es-EC',	false),
('eg',		 'egp', 	'ar-EG',	true),
('eg',		 'egp', 	'en',		true),
('eg',		 'egp', 	'fr',		true),
('ei',		 'eur', 	'en-IE',	false),
('ei',		 'eur', 	'ga-IE',	false),
('ek',		 'xaf', 	'es-GQ',	false),
('ek',		 'xaf', 	'fr',		false),
('en',		 'eur', 	'et',		false),
('en',		 'eur', 	'ru',		false),
('er',		 'ern', 	'aa-ER',	false),
('er',		 'ern', 	'ar',		false),
('er',		 'ern', 	'kun',		false),
('er',		 'ern', 	'ti-ER',	false),
('er',		 'ern', 	'tig',		false),
('es',		 'svc', 	'es-SV',	true),
('es',		 'usd', 	'es-SV',	false),
('et',		 'etb', 	'am',		false),
('et',		 'etb', 	'en-ET',	false),
('et',		 'etb', 	'om-ET',	false),
('et',		 'etb', 	'sid',		false),
('et',		 'etb', 	'so-ET',	false),
('et',		 'etb', 	'ti-ET',	false),
('ez',		 'czk', 	'cs',		true),
('ez',		 'czk', 	'sk',		true),
('fg',		 'eur', 	'fr-GF',	false),
('fi',		 'eur', 	'fi-FI',	false),
('fi',		 'eur', 	'smn',		false),
('fi',		 'eur', 	'sv-FI',	false),
('fj',		 'fjd', 	'en-FJ',	true),
('fj',		 'fjd', 	'fj',		true),
('fm',		 'usd', 	'chk',		false),
('fm',		 'usd', 	'en-FM',	false),
('fm',		 'usd', 	'kos',		false),
('fm',		 'usd', 	'kpg',		false),
('fm',		 'usd', 	'nkr',		false),
('fm',		 'usd', 	'pon',		false),
('fm',		 'usd', 	'uli',		false),
('fm',		 'usd', 	'woe',		false),
('fm',		 'usd', 	'yap',		false),
('fo',		 'dkk', 	'da-FO',	false),
('fo',		 'dkk', 	'fo',		false),
('fp',		 'xpf', 	'fr-PF',	false),
('fp',		 'xpf', 	'ty',		false),
('fq',		 'usd', 	'en-UM',	false),
('fr',		 'eur', 	'br',		false),
('fr',		 'eur', 	'ca',		false),
('fr',		 'eur', 	'co',		false),
('fr',		 'eur', 	'eu',		false),
('fr',		 'eur', 	'fr-FR',	false),
('fr',		 'eur', 	'frp',		false),
('fr',		 'eur', 	'oc',		false),
('fs',		 'eur', 	'fr',		false),
('ga',		 'gmd', 	'en-GM',	false),
('ga',		 'gmd', 	'ff',		false),
('ga',		 'gmd', 	'mnk',		false),
('ga',		 'gmd', 	'wo',		false),
('ga',		 'gmd', 	'wof',		false),
('gb',		 'xaf', 	'fr-GA',	false),
('gg',		 'gel', 	'az',		false),
('gg',		 'gel', 	'hy',		false),
('gg',		 'gel', 	'ka',		false),
('gg',		 'gel', 	'ru',		false),
('gh',		 'ghs', 	'ak',		true),
('gh',		 'ghs', 	'ee',		true),
('gh',		 'ghs', 	'en-GH',	true),
('gh',		 'ghs', 	'tw',		true),
('gi',		 'gip', 	'en-GI',	true),
('gi',		 'gip', 	'es',		true),
('gi',		 'gip', 	'it',		true),
('gi',		 'gip', 	'pt',		true),
('gj',		 'xcd', 	'en-GD',	false),
('gk',		 'gbp', 	'en',		false),
('gk',		 'gbp', 	'fr',		false),
('gl',		 'dkk', 	'da-GL',	false),
('gl',		 'dkk', 	'en',		false),
('gl',		 'dkk', 	'kl',		false),
('gm',		 'eur', 	'de',		false),
('gp',		 'eur', 	'fr-GP',	false),
('gq',		 'usd', 	'ch-GU',	false),
('gq',		 'usd', 	'en-GU',	false),
('gr',		 'eur', 	'el-GR',	false),
('gr',		 'eur', 	'en',		false),
('gr',		 'eur', 	'fr',		false),
('gt',		 'gtq', 	'es-GT',	true),
('gv',		 'gnf', 	'fr-GN',	false),
('gy',		 'gyd', 	'en-GY',	true),
('ha',		 'htg', 	'fr-HT',	true),
('ha',		 'htg', 	'ht',		true),
('ha',		 'usd', 	'fr-HT',	false),
('ha',		 'usd', 	'ht',		false),
('hk',		 'hkd', 	'en',		true),
('hk',		 'hkd', 	'yue',		true),
('hk',		 'hkd', 	'zh',		true),
('hk',		 'hkd', 	'zh-HK',	true),
('ho',		 'hnl', 	'es-HN',	true),
('hq',		 'usd', 	'en-UM',	false),
('hr',		 'hrk', 	'hr-HR',	true),
('hr',		 'hrk', 	'sr',		true),
('hu',		 'huf', 	'hu-HU',	true),
('ic',		 'isk', 	'da',		true),
('ic',		 'isk', 	'de',		true),
('ic',		 'isk', 	'en',		true),
('ic',		 'isk', 	'is',		true),
('ic',		 'isk', 	'no',		true),
('ic',		 'isk', 	'sv',		true),
('id',		 'idr', 	'en',		true),
('id',		 'idr', 	'id',		true),
('id',		 'idr', 	'jv',		true),
('id',		 'idr', 	'nl',		true),
('im',		 'gbp', 	'en',		false),
('im',		 'gbp', 	'gv',		false),
('in',		 'inr', 	'as',		true),
('in',		 'inr', 	'bh',		true),
('in',		 'inr', 	'bn',		true),
('in',		 'inr', 	'doi',		true),
('in',		 'inr', 	'en-IN',	true),
('in',		 'inr', 	'fr',		true),
('in',		 'inr', 	'gu',		true),
('in',		 'inr', 	'hi',		true),
('in',		 'inr', 	'inc',		true),
('in',		 'inr', 	'kn',		true),
('in',		 'inr', 	'kok',		true),
('in',		 'inr', 	'ks',		true),
('in',		 'inr', 	'lus',		true),
('in',		 'inr', 	'ml',		true),
('in',		 'inr', 	'mni',		true),
('in',		 'inr', 	'mr',		true),
('in',		 'inr', 	'ne',		true),
('in',		 'inr', 	'or',		true),
('in',		 'inr', 	'pa',		true),
('in',		 'inr', 	'sa',		true),
('in',		 'inr', 	'sat',		true),
('in',		 'inr', 	'sd',		true),
('in',		 'inr', 	'sit',		true),
('in',		 'inr', 	'ta',		true),
('in',		 'inr', 	'te',		true),
('in',		 'inr', 	'ur',		true),
('io',		 'usd', 	'en-IO',	false),
('ir',		 'irr', 	'fa-IR',	true),
('ir',		 'irr', 	'ku',		true),
('is',		 'ils', 	'',		true),
('is',		 'ils', 	'ar-IL',	true),
('is',		 'ils', 	'en-IL',	true),
('is',		 'ils', 	'he',		true),
('it',		 'eur', 	'ca',		false),
('it',		 'eur', 	'co',		false),
('it',		 'eur', 	'de-IT',	false),
('it',		 'eur', 	'fr-IT',	false),
('it',		 'eur', 	'it-IT',	false),
('it',		 'eur', 	'sc',		false),
('it',		 'eur', 	'sl',		false),
('iv',		 'xof', 	'fr-CI',	false),
('iz',		 'iqd', 	'ar-IQ',	false),
('iz',		 'iqd', 	'hy',		false),
('iz',		 'iqd', 	'ku',		false),
('ja',		 'jpy', 	'ja',		true),
('je',		 'gbp', 	'en',		false),
('je',		 'gbp', 	'pt',		false),
('jm',		 'jmd', 	'en-JM',	true),
('jn',		 'nok', 	'no',		false),
('jn',		 'nok', 	'ru',		false),
('jo',		 'jod', 	'ar-JO',	false),
('jo',		 'jod', 	'en',		false),
('jq',		 'usd', 	'en-UM',	false),
('ke',		 'kes', 	'en-KE',	false),
('ke',		 'kes', 	'sw-KE',	false),
('kg',		 'kgs', 	'ky',		true),
('kg',		 'kgs', 	'ru',		true),
('kg',		 'kgs', 	'uz',		true),
('kn',		 'kpw', 	'ko-KP',	true),
('kq',		 'usd', 	'en-UM',	false),
('kr',		 'aud', 	'en-KI',	false),
('kr',		 'aud', 	'gil',		false),
('ks',		 'krw', 	'en',		true),
('ks',		 'krw', 	'ko-KR',	true),
('kt',		 'aud', 	'en',		false),
('kt',		 'aud', 	'ms-CC',	false),
('kt',		 'aud', 	'zh',		false),
('ku',		 'kwd', 	'ar-KW',	false),
('ku',		 'kwd', 	'en',		false),
('kv',		 'rsd', 	'bs',		false),
('kv',		 'rsd', 	'hu',		false),
('kv',		 'rsd', 	'rom',		false),
('kv',		 'rsd', 	'sr',		false),
('kz',		 'kzt', 	'kk',		true),
('kz',		 'kzt', 	'ru',		true),
('la',		 'lak', 	'en',		true),
('la',		 'lak', 	'fr',		true),
('la',		 'lak', 	'lo',		true),
('le',		 'lbp', 	'ar-LB',	true),
('le',		 'lbp', 	'en',		true),
('le',		 'lbp', 	'fr-LB',	true),
('le',		 'lbp', 	'hy',		true),
('lg',		 'eur', 	'lt',		false),
('lg',		 'eur', 	'lv',		false),
('lg',		 'eur', 	'ru',		false),
('lh',		 'eur', 	'lt',		false),
('lh',		 'eur', 	'pl',		false),
('lh',		 'eur', 	'ru',		false),
('li',		 'lrd', 	'en-LR',	true),
('lo',		 'eur', 	'hu',		false),
('lo',		 'eur', 	'sk',		false),
('lq',		 'usd', 	'en-UM',	false),
('ls',		 'chf', 	'de-LI',	true),
('lt',		 'lsl', 	'en-LS',	true),
('lt',		 'lsl', 	'st',		true),
('lt',		 'lsl', 	'xh',		true),
('lt',		 'lsl', 	'zu',		true),
('lt',		 'zar', 	'en-LS',	false),
('lt',		 'zar', 	'st',		false),
('lt',		 'zar', 	'xh',		false),
('lt',		 'zar', 	'zu',		false),
('lu',		 'eur', 	'de-LU',	false),
('lu',		 'eur', 	'fr-LU',	false),
('lu',		 'eur', 	'lb',		false),
('ly',		 'lyd', 	'ar-LY',	false),
('ly',		 'lyd', 	'en',		false),
('ly',		 'lyd', 	'it',		false),
('ma',		 'mga', 	'fr-MG',	false),
('ma',		 'mga', 	'mg',		false),
('mb',		 'eur', 	'fr-MQ',	false),
('mc',		 'mop', 	'pt',		false),
('mc',		 'mop', 	'zh',		false),
('mc',		 'mop', 	'zh-MO',	false),
('md',		 'mdl', 	'gag',		false),
('md',		 'mdl', 	'ro',		false),
('md',		 'mdl', 	'ru',		false),
('md',		 'mdl', 	'tr',		false),
('mf',		 'eur', 	'fr-YT',	false),
('mg',		 'mnt', 	'mn',		true),
('mg',		 'mnt', 	'ru',		true),
('mh',		 'xcd', 	'en-MS',	false),
('mi',		 'mwk', 	'ny',		false),
('mi',		 'mwk', 	'swk',		false),
('mi',		 'mwk', 	'tum',		false),
('mi',		 'mwk', 	'yao',		false),
('mj',		 'eur', 	'bs',		false),
('mj',		 'eur', 	'hr',		false),
('mj',		 'eur', 	'hu',		false),
('mj',		 'eur', 	'rom',		false),
('mj',		 'eur', 	'sq',		false),
('mj',		 'eur', 	'sr',		false),
('mk',		 'mkd', 	'mk',		true),
('mk',		 'mkd', 	'rmm',		true),
('mk',		 'mkd', 	'sq',		true),
('mk',		 'mkd', 	'sr',		true),
('mk',		 'mkd', 	'tr',		true),
('ml',		 'xof', 	'bm',		false),
('ml',		 'xof', 	'fr-ML',	false),
('mn',		 'eur', 	'en',		false),
('mn',		 'eur', 	'fr-MC',	false),
('mn',		 'eur', 	'it',		false),
('mo',		 'mad', 	'ar-MA',	false),
('mo',		 'mad', 	'ber',		false),
('mo',		 'mad', 	'fr',		false),
('mp',		 'mur', 	'bho',		true),
('mp',		 'mur', 	'en-MU',	true),
('mp',		 'mur', 	'fr',		true),
('mq',		 'usd', 	'en-UM',	false),
('mr',		 'mro', 	'ar-MR',	false),
('mr',		 'mro', 	'fr',		false),
('mr',		 'mro', 	'fuc',		false),
('mr',		 'mro', 	'mey',		false),
('mr',		 'mro', 	'snk',		false),
('mr',		 'mro', 	'wo',		false),
('mt',		 'eur', 	'en-MT',	false),
('mt',		 'eur', 	'mt',		false),
('mu',		 'omr', 	'ar-OM',	true),
('mu',		 'omr', 	'bal',		true),
('mu',		 'omr', 	'en',		true),
('mu',		 'omr', 	'ur',		true),
('mv',		 'mvr', 	'dv',		false),
('mv',		 'mvr', 	'en',		false),
('mx',		 'mxn', 	'es-MX',	true),
('my',		 'myr', 	'en',		true),
('my',		 'myr', 	'ml',		true),
('my',		 'myr', 	'ms-MY',	true),
('my',		 'myr', 	'pa',		true),
('my',		 'myr', 	'ta',		true),
('my',		 'myr', 	'te',		true),
('my',		 'myr', 	'th',		true),
('my',		 'myr', 	'zh',		true),
('mz',		 'mzn', 	'pt-MZ',	true),
('mz',		 'mzn', 	'vmw',		true),
('nc',		 'xpf', 	'fr-NC',	false),
('ne',		 'nzd', 	'en-NU',	false),
('ne',		 'nzd', 	'niu',		false),
('nf',		 'aud', 	'en-NF',	false),
('ng',		 'xof', 	'dje',		false),
('ng',		 'xof', 	'fr-NE',	false),
('ng',		 'xof', 	'ha',		false),
('ng',		 'xof', 	'kr',		false),
('nh',		 'vuv', 	'bi',		false),
('nh',		 'vuv', 	'en-VU',	false),
('nh',		 'vuv', 	'fr-VU',	false),
('ni',		 'ngn', 	'en-NG',	true),
('ni',		 'ngn', 	'ff',		true),
('ni',		 'ngn', 	'ha',		true),
('ni',		 'ngn', 	'ig',		true),
('ni',		 'ngn', 	'yo',		true),
('nl',		 'eur', 	'fy-NL',	false),
('nl',		 'eur', 	'nl-NL',	false),
('nl',		 'usd', 	'en',		false),
('nl',		 'usd', 	'nl',		false),
('nl',		 'usd', 	'pap',		false),
('nn',		 'ang', 	'en',		false),
('nn',		 'ang', 	'nl',		false),
('no',		 'nok', 	'fi',		true),
('no',		 'nok', 	'nb',		true),
('no',		 'nok', 	'nn',		true),
('no',		 'nok', 	'no',		true),
('no',		 'nok', 	'se',		true),
('np',		 'npr', 	'en',		true),
('np',		 'npr', 	'ne',		true),
('nr',		 'aud', 	'en-NR',	false),
('nr',		 'aud', 	'na',		false),
('ns',		 'srd', 	'en',		true),
('ns',		 'srd', 	'hns',		true),
('ns',		 'srd', 	'jv',		true),
('ns',		 'srd', 	'nl-SR',	true),
('ns',		 'srd', 	'srn',		true),
('nu',		 'nio', 	'en',		true),
('nu',		 'nio', 	'es-NI',	true),
('nz',		 'nzd', 	'en-NZ',	false),
('nz',		 'nzd', 	'mi',		false),
('od',		 'ssp', 	'en',		false),
('pa',		 'pyg', 	'es-PY',	true),
('pa',		 'pyg', 	'gn',		true),
('pc',		 'nzd', 	'en-PN',	false),
('pe',		 'pen', 	'ay',		true),
('pe',		 'pen', 	'es-PE',	true),
('pe',		 'pen', 	'qu',		true),
('pk',		 'pkr', 	'brh',		true),
('pk',		 'pkr', 	'en-PK',	true),
('pk',		 'pkr', 	'pa',		true),
('pk',		 'pkr', 	'ps',		true),
('pk',		 'pkr', 	'sd',		true),
('pk',		 'pkr', 	'ur-PK',	true),
('pl',		 'pln', 	'pl',		true),
('pm',		 'pab', 	'en',		true),
('pm',		 'pab', 	'es-PA',	true),
('pm',		 'usd', 	'en',		false),
('pm',		 'usd', 	'es-PA',	false),
('po',		 'eur', 	'mwl',		false),
('po',		 'eur', 	'pt-PT',	false),
('pp',		 'pgk', 	'en-PG',	false),
('pp',		 'pgk', 	'ho',		false),
('pp',		 'pgk', 	'meu',		false),
('pp',		 'pgk', 	'tpi',		false),
('ps',		 'usd', 	'en-PW',	false),
('ps',		 'usd', 	'fil',		false),
('ps',		 'usd', 	'ja',		false),
('ps',		 'usd', 	'pau',		false),
('ps',		 'usd', 	'sov',		false),
('ps',		 'usd', 	'tox',		false),
('ps',		 'usd', 	'zh',		false),
('pu',		 'xof', 	'pov',		false),
('pu',		 'xof', 	'pt-GW',	false),
('qa',		 'qar', 	'ar-QA',	true),
('qa',		 'qar', 	'es',		true),
('re',		 'eur', 	'fr-RE',	false),
('ri',		 'rsd', 	'bs',		true),
('ri',		 'rsd', 	'hu',		true),
('ri',		 'rsd', 	'rom',		true),
('ri',		 'rsd', 	'sr',		true),
('rm',		 'usd', 	'en-MH',	false),
('rm',		 'usd', 	'mh',		false),
('rn',		 'eur', 	'fr',		false),
('ro',		 'ron', 	'hu',		true),
('ro',		 'ron', 	'ro',		true),
('ro',		 'ron', 	'rom',		true),
('rp',		 'php', 	'en-PH',	true),
('rp',		 'php', 	'fil',		true),
('rp',		 'php', 	'tl',		true),
('rq',		 'usd', 	'en-PR',	false),
('rq',		 'usd', 	'es-PR',	false),
('rs',		 'rub', 	'ady',		true),
('rs',		 'rub', 	'av',		true),
('rs',		 'rub', 	'ba',		true),
('rs',		 'rub', 	'bua',		true),
('rs',		 'rub', 	'cau',		true),
('rs',		 'rub', 	'ce',		true),
('rs',		 'rub', 	'chm',		true),
('rs',		 'rub', 	'cv',		true),
('rs',		 'rub', 	'inh',		true),
('rs',		 'rub', 	'kbd',		true),
('rs',		 'rub', 	'krc',		true),
('rs',		 'rub', 	'kv',		true),
('rs',		 'rub', 	'mdf',		true),
('rs',		 'rub', 	'mns',		true),
('rs',		 'rub', 	'myv',		true),
('rs',		 'rub', 	'nog',		true),
('rs',		 'rub', 	'ru',		true),
('rs',		 'rub', 	'sah',		true),
('rs',		 'rub', 	'tt',		true),
('rs',		 'rub', 	'tut',		true),
('rs',		 'rub', 	'tut',		true),
('rs',		 'rub', 	'tyv',		true),
('rs',		 'rub', 	'udm',		true),
('rs',		 'rub', 	'xal',		true),
('rw',		 'rwf', 	'en-RW',	false),
('rw',		 'rwf', 	'fr-RW',	false),
('rw',		 'rwf', 	'rw',		false),
('rw',		 'rwf', 	'sw',		false),
('sa',		 'sar', 	'ar-SA',	true),
('sb',		 'eur', 	'fr-PM',	false),
('sc',		 'xcd', 	'en-KN',	false),
('se',		 'scr', 	'en-SC',	true),
('se',		 'scr', 	'fr-SC',	true),
('sf',		 'zar', 	'af',		true),
('sf',		 'zar', 	'en-ZA',	true),
('sf',		 'zar', 	'nr',		true),
('sf',		 'zar', 	'nso',		true),
('sf',		 'zar', 	'ss',		true),
('sf',		 'zar', 	'st',		true),
('sf',		 'zar', 	'tn',		true),
('sf',		 'zar', 	'ts',		true),
('sf',		 'zar', 	've',		true),
('sf',		 'zar', 	'xh',		true),
('sf',		 'zar', 	'zu',		true),
('sg',		 'xof', 	'fr-SN',	false),
('sg',		 'xof', 	'fuc',		false),
('sg',		 'xof', 	'mnk',		false),
('sg',		 'xof', 	'wo',		false),
('sh',		 'shp', 	'en-SH',	true),
('si',		 'eur', 	'sh',		false),
('si',		 'eur', 	'sl',		false),
('sl',		 'sll', 	'en-SL',	false),
('sl',		 'sll', 	'men',		false),
('sl',		 'sll', 	'tem',		false),
('sm',		 'eur', 	'it-SM',	false),
('sn',		 'sgd', 	'cmn',		true),
('sn',		 'sgd', 	'en-SG',	true),
('sn',		 'sgd', 	'ms-SG',	true),
('sn',		 'sgd', 	'ta-SG',	true),
('sn',		 'sgd', 	'zh-SG',	true),
('so',		 'sos', 	'ar-SO',	true),
('so',		 'sos', 	'en-SO',	true),
('so',		 'sos', 	'it',		true),
('so',		 'sos', 	'so-SO',	true),
('sp',		 'eur', 	'ca',		false),
('sp',		 'eur', 	'es-ES',	false),
('sp',		 'eur', 	'eu',		false),
('sp',		 'eur', 	'gl',		false),
('sp',		 'eur', 	'oc',		false),
('st',		 'xcd', 	'en-LC',	false),
('su',		 'sdg', 	'ar-SD',	false),
('su',		 'sdg', 	'en',		false),
('su',		 'sdg', 	'fia',		false),
('sv',		 'nok', 	'no',		false),
('sv',		 'nok', 	'ru',		false),
('sw',		 'sek', 	'fi-SE',	true),
('sw',		 'sek', 	'se',		true),
('sw',		 'sek', 	'sma',		true),
('sw',		 'sek', 	'sv-SE',	true),
('sy',		 'syp', 	'arc',		true),
('sy',		 'syp', 	'ar-SY',	true),
('sy',		 'syp', 	'en',		true),
('sy',		 'syp', 	'fr',		true),
('sy',		 'syp', 	'hy',		true),
('sy',		 'syp', 	'ku',		true),
('sz',		 'chf', 	'de-CH',	false),
('sz',		 'chf', 	'fr-CH',	false),
('sz',		 'chf', 	'it-CH',	false),
('sz',		 'chf', 	'rm',		false),
('tb',		 'eur', 	'fr',		false),
('td',		 'ttd', 	'en-TT',	true),
('td',		 'ttd', 	'es',		true),
('td',		 'ttd', 	'fr',		true),
('td',		 'ttd', 	'hns',		true),
('td',		 'ttd', 	'zh',		true),
('th',		 'thb', 	'en',		true),
('th',		 'thb', 	'th',		true),
('ti',		 'tjs', 	'ru',		false),
('ti',		 'tjs', 	'tg',		false),
('tk',		 'usd', 	'en-TC',	false),
('tl',		 'nzd', 	'en-TK',	false),
('tl',		 'nzd', 	'tkl',		false),
('tn',		 'top', 	'en-TO',	false),
('tn',		 'top', 	'to',		false),
('to',		 'xof', 	'dag',		false),
('to',		 'xof', 	'ee',		false),
('to',		 'xof', 	'fr-TG',	false),
('to',		 'xof', 	'ha',		false),
('to',		 'xof', 	'hna',		false),
('to',		 'xof', 	'kbp',		false),
('tp',		 'std', 	'pt-ST',	false),
('ts',		 'tnd', 	'ar-TN',	false),
('ts',		 'tnd', 	'fr',		false),
('tt',		 'usd', 	'en',		false),
('tt',		 'usd', 	'id',		false),
('tt',		 'usd', 	'pt-TL',	false),
('tt',		 'usd', 	'tet',		false),
('tu',		 'try', 	'av',		true),
('tu',		 'try', 	'az',		true),
('tu',		 'try', 	'diq',		true),
('tu',		 'try', 	'ku',		true),
('tu',		 'try', 	'tr-TR',	true),
('tv',		 'aud', 	'en',		false),
('tv',		 'aud', 	'gil',		false),
('tv',		 'aud', 	'sm',		false),
('tv',		 'aud', 	'tvl',		false),
('tx',		 'tmt', 	'ru',		false),
('tx',		 'tmt', 	'tk',		false),
('tx',		 'tmt', 	'uz',		false),
('tz',		 'tzs', 	'ar',		false),
('tz',		 'tzs', 	'en',		false),
('tz',		 'tzs', 	'sw-TZ',	false),
('uc',		 'ang', 	'nl',		true),
('uc',		 'ang', 	'pap',		true),
('ug',		 'ugx', 	'ar',		false),
('ug',		 'ugx', 	'en-UG',	false),
('ug',		 'ugx', 	'lg',		false),
('ug',		 'ugx', 	'sw',		false),
('uk',		 'gbp', 	'cy-GB',	true),
('uk',		 'gbp', 	'en-GB',	true),
('uk',		 'gbp', 	'gd',		true),
('up',		 'uah', 	'hu',		true),
('up',		 'uah', 	'pl',		true),
('up',		 'uah', 	'rom',		true),
('up',		 'uah', 	'ru-UA',	true),
('up',		 'uah', 	'uk',		true),
('us',		 'usd', 	'en-US',	true),
('us',		 'usd', 	'es-US',	true),
('us',		 'usd', 	'fr',		true),
('us',		 'usd', 	'haw',		true),
('uv',		 'xof', 	'fr-BF',	false),
('uy',		 'uyu', 	'es-UY',	true),
('uz',		 'uzs', 	'ru',		true),
('uz',		 'uzs', 	'tg',		true),
('uz',		 'uzs', 	'uz',		true),
('vc',		 'xcd', 	'en-VC',	false),
('vc',		 'xcd', 	'fr',		false),
('ve',		 'vef', 	'es-VE',	true),
('vi',		 'usd', 	'en-VG',	false),
('vm',		 'vnd', 	'en',		true),
('vm',		 'vnd', 	'fr',		true),
('vm',		 'vnd', 	'km',		true),
('vm',		 'vnd', 	'vi',		true),
('vm',		 'vnd', 	'zh',		true),
('vq',		 'usd', 	'en-VI',	false),
('vt',		 'eur', 	'fr',		false),
('vt',		 'eur', 	'it',		false),
('vt',		 'eur', 	'la',		false),
('wa',		 'nad', 	'af',		true),
('wa',		 'nad', 	'de',		true),
('wa',		 'nad', 	'en-NA',	true),
('wa',		 'nad', 	'hz',		true),
('wa',		 'nad', 	'naq',		true),
('wa',		 'zar', 	'af',		true),
('wa',		 'zar', 	'de',		true),
('wa',		 'zar', 	'en-NA',	true),
('wa',		 'zar', 	'hz',		true),
('wa',		 'zar', 	'naq',		true),
('wf',		 'xpf', 	'fr-WF',	false),
('wf',		 'xpf', 	'fud',		false),
('wf',		 'xpf', 	'wls',		false),
('wi',		 'mad', 	'ar',		false),
('wi',		 'mad', 	'mey',		false),
('wq',		 'usd', 	'en-UM',	false),
('ws',		 'wst', 	'en-WS',	false),
('ws',		 'wst', 	'sm',		false),
('wz',		 'szl', 	'en-SZ',	false),
('wz',		 'szl', 	'ss-SZ',	false),
('ym',		 'yer', 	'ar-YE',	true),
('za',		 'zmw', 	'bem',		false),
('za',		 'zmw', 	'en-ZM',	false),
('za',		 'zmw', 	'loz',		false),
('za',		 'zmw', 	'lue',		false),
('za',		 'zmw', 	'lun',		false),
('za',		 'zmw', 	'ny',		false),
('za',		 'zmw', 	'toi',		false),
('zi',		 'zwl', 	'en-ZW',	true),
('zi',		 'zwl', 	'nd',		true),
('zi',		 'zwl', 	'nr',		true),
('zi',		 'zwl', 	'sn',		true);

-- Ip addresses.
DROP TABLE IF EXISTS ip_addresses;

CREATE TABLE ip_addresses (
	ip_type 			VARCHAR(4) 				 NOT NULL,
	ip_low 				DECIMAL(10,0) 				 NOT NULL,
	ip_low_str 			VARCHAR(15)				 NOT NULL,
	ip_high 			DECIMAL(10,0) 				 NOT NULL,
	ip_high_str 			VARCHAR(15) 				 NOT NULL,
	prefix_mask 			DECIMAL(10,0) 				 NOT NULL,
	prefix_mask_str 		VARCHAR(15) 				 NOT NULL,
	prefix_size 			DECIMAL(2,0) 				 NOT NULL,
	inverted_mask 			DECIMAL(10,0) 				 NOT NULL,
	inverted_mask_str 		VARCHAR(15) 				 NOT NULL,
	inverted_size 			DECIMAL(2,0) 				 NOT NULL,
	geoname_id 			DECIMAL(10,0) 				 DEFAULT NULL
);

-- Ip location.
DROP TABLE IF EXISTS ip_locations;

CREATE TABLE ip_locations (
	geoname_id 			DECIMAL(10,0) 				  DEFAULT NULL,
	registered_country_geoname_id  	DECIMAL(10,0) 				  DEFAULT NULL,
	represented_country_geoname_id 	DECIMAL(10,0) 				  DEFAULT NULL,
	is_anonymous_proxy 		BOOLEAN 				  NOT NULL DEFAULT false, 
	is_satellite_provider 		BOOLEAN 				  NOT NULL DEFAULT false,
	postal_code 			VARCHAR(8) 				  DEFAULT NULL,
	latitude 			DECIMAL(10,8) 				  DEFAULT NULL,
	longitude			DECIMAL(11,8) 				  DEFAULT NULL,
	accuracy_radius 		DECIMAL(4,0) 				  DEFAULT NULL
);
