'use strict';

const geoipModel = ({ api, utils, config, models }: any) => {
  const {
    query,
    fixSingleQuote,
    path,
    getHealth,
    readFile,
    readDir,
    csv2Array,
    cutCSVFile,
  } = utils;

  const localeElts: string[] = [
    'de',
    'en',
    'es',
    'fr',
    'ja',
    'pt-BR',
    'ru',
    'zh-CN',
  ];
  const blockElts: string[] = ['IPv4'];

  /*
   * Extract locales continents.
   */
  const processLocales = async () => {
    // try {
    // Get all locales.
    var localesContents = [];
    for (let l = 0; l < localeElts.length; l += 1) {
      // Get current locale.
      let x: any = { lang: localeElts[l] };

      // Set locale path location.
      const localeFile = `GeoLite2-City-Locations-${x.lang}.csv`;

      // Load locale file content.
      const contents = await readFile(
        path.join(__dirname, '/../../private/geolite2/locations/' + localeFile),
        'utf8',
      );

      // Set locale contents.
      x.contents = csv2Array(contents);

      localesContents.push(x);
    }

    // Set locales with respective language.
    const de: any = localesContents[0],
      en: any = localesContents[1],
      es: any = localesContents[2],
      fr: any = localesContents[3],
      ja: any = localesContents[4],
      ptBr: any = localesContents[5],
      ru: any = localesContents[6],
      zhCn: any = localesContents[7];

    const referenceLocaleFileLength = de.contents.length;

    for (var m = 1; m < referenceLocaleFileLength - 1; m += 1) {
      // Extract desired data.
      const data = {
        de: {
          continentISO:
            de.contents[m][2].length > 0
              ? `'${de.contents[m][2].toLowerCase()}'`
              : null,
          continentName:
            de.contents[m][3].length > 0
              ? `'${fixSingleQuote(de.contents[m][3])}'`
              : null,
          isEuropeanUnion: de.contents[m][13] === '1' ? 'true' : 'false',
          countryISO:
            de.contents[m][4].length > 0
              ? `'${fixSingleQuote(de.contents[m][4].toLowerCase())}'`
              : null,
          countryName:
            de.contents[m][5].length > 0
              ? `'${fixSingleQuote(de.contents[m][5])}'`
              : null,
          subdivision1ISO:
            de.contents[m][6].length > 0
              ? `'${fixSingleQuote(de.contents[m][6].toLowerCase())}'`
              : null,
          timeZone:
            de.contents[m][12].length > 0
              ? `'${fixSingleQuote(de.contents[m][12])}'`
              : null,
          subdivision1Name:
            de.contents[m][7].length > 0
              ? `'${fixSingleQuote(de.contents[m][7])}'`
              : null,
          cityName:
            de.contents[m][10].length > 0
              ? `'${fixSingleQuote(de.contents[m][10])}'`
              : null,
        },
        en: {
          continentISO:
            en.contents[m][2].length > 0
              ? `'${en.contents[m][2].toLowerCase()}'`
              : null,
          continentName:
            en.contents[m][3].length > 0
              ? `'${fixSingleQuote(en.contents[m][3])}'`
              : null,
          isEuropeanUnion: en.contents[m][13] === '1' ? 'true' : 'false',
          countryISO:
            en.contents[m][4].length > 0
              ? `'${fixSingleQuote(en.contents[m][4].toLowerCase())}'`
              : null,
          countryName:
            en.contents[m][5].length > 0
              ? `'${fixSingleQuote(en.contents[m][5])}'`
              : null,
          subdivision1ISO:
            en.contents[m][6].length > 0
              ? `'${fixSingleQuote(en.contents[m][6].toLowerCase())}'`
              : null,
          timeZone:
            en.contents[m][12].length > 0
              ? `'${fixSingleQuote(en.contents[m][12])}'`
              : null,
          subdivision1Name:
            en.contents[m][7].length > 0
              ? `'${fixSingleQuote(en.contents[m][7])}'`
              : null,
          cityName:
            en.contents[m][10].length > 0
              ? `'${fixSingleQuote(en.contents[m][10])}'`
              : null,
        },
        es: {
          continentISO:
            es.contents[m][2].length > 0
              ? `'${es.contents[m][2].toLowerCase()}'`
              : null,
          continentName:
            es.contents[m][3].length > 0
              ? `'${fixSingleQuote(es.contents[m][3])}'`
              : null,
          isEuropeanUnion: es.contents[m][13] === '1' ? 'true' : 'false',
          countryISO:
            es.contents[m][4].length > 0
              ? `'${fixSingleQuote(es.contents[m][4].toLowerCase())}'`
              : null,
          countryName:
            es.contents[m][5].length > 0
              ? `'${fixSingleQuote(es.contents[m][5])}'`
              : null,
          subdivision1ISO:
            es.contents[m][6].length > 0
              ? `'${fixSingleQuote(es.contents[m][6].toLowerCase())}'`
              : null,
          timeZone:
            es.contents[m][12].length > 0
              ? `'${fixSingleQuote(es.contents[m][12])}'`
              : null,
          subdivision1Name:
            es.contents[m][7].length > 0
              ? `'${fixSingleQuote(es.contents[m][7])}'`
              : null,
          cityName:
            es.contents[m][10].length > 0
              ? `'${fixSingleQuote(es.contents[m][10])}'`
              : null,
        },
        fr: {
          continentISO:
            fr.contents[m][2].length > 0
              ? `'${fr.contents[m][2].toLowerCase()}'`
              : null,
          continentName:
            fr.contents[m][3].length > 0
              ? `'${fixSingleQuote(fr.contents[m][3])}'`
              : null,
          isEuropeanUnion: fr.contents[m][13] === '1' ? 'true' : 'false',
          countryISO:
            fr.contents[m][4].length > 0
              ? `'${fixSingleQuote(fr.contents[m][4].toLowerCase())}'`
              : null,
          countryName:
            fr.contents[m][5].length > 0
              ? `'${fixSingleQuote(fr.contents[m][5])}'`
              : null,
          subdivision1ISO:
            fr.contents[m][6].length > 0
              ? `'${fixSingleQuote(fr.contents[m][6].toLowerCase())}'`
              : null,
          timeZone:
            fr.contents[m][12].length > 0
              ? `'${fixSingleQuote(fr.contents[m][12])}'`
              : null,
          subdivision1Name:
            fr.contents[m][7].length > 0
              ? `'${fixSingleQuote(fr.contents[m][7])}'`
              : null,
          cityName:
            fr.contents[m][10].length > 0
              ? `'${fixSingleQuote(fr.contents[m][10])}'`
              : null,
        },
        ja: {
          continentISO:
            ja.contents[m][2].length > 0
              ? `'${ja.contents[m][2].toLowerCase()}'`
              : null,
          continentName:
            ja.contents[m][3].length > 0
              ? `'${fixSingleQuote(ja.contents[m][3])}'`
              : null,
          isEuropeanUnion: ja.contents[m][13] === '1' ? 'true' : 'false',
          countryISO:
            ja.contents[m][4].length > 0
              ? `'${fixSingleQuote(ja.contents[m][4].toLowerCase())}'`
              : null,
          countryName:
            ja.contents[m][5].length > 0
              ? `'${fixSingleQuote(ja.contents[m][5])}'`
              : null,
          subdivision1ISO:
            ja.contents[m][6].length > 0
              ? `'${fixSingleQuote(ja.contents[m][6].toLowerCase())}'`
              : null,
          timeZone:
            ja.contents[m][12].length > 0
              ? `'${fixSingleQuote(ja.contents[m][12])}'`
              : null,
          subdivision1Name:
            ja.contents[m][7].length > 0
              ? `'${fixSingleQuote(ja.contents[m][7])}'`
              : null,
          cityName:
            ja.contents[m][10].length > 0
              ? `'${fixSingleQuote(ja.contents[m][10])}'`
              : null,
        },
        ptBr: {
          continentISO:
            ptBr.contents[m][2].length > 0
              ? `'${ptBr.contents[m][2].toLowerCase()}'`
              : null,
          continentName:
            ptBr.contents[m][3].length > 0
              ? `'${fixSingleQuote(ptBr.contents[m][3])}'`
              : null,
          isEuropeanUnion: ptBr.contents[m][13] === '1' ? 'true' : 'false',
          countryISO:
            ptBr.contents[m][4].length > 0
              ? `'${fixSingleQuote(ptBr.contents[m][4].toLowerCase())}'`
              : null,
          countryName:
            ptBr.contents[m][5].length > 0
              ? `'${fixSingleQuote(ptBr.contents[m][5])}'`
              : null,
          subdivision1ISO:
            ptBr.contents[m][6].length > 0
              ? `'${fixSingleQuote(ptBr.contents[m][6].toLowerCase())}'`
              : null,
          timeZone:
            ptBr.contents[m][12].length > 0
              ? `'${fixSingleQuote(ptBr.contents[m][12])}'`
              : null,
          subdivision1Name:
            ptBr.contents[m][7].length > 0
              ? `'${fixSingleQuote(ptBr.contents[m][7])}'`
              : null,
          cityName:
            ptBr.contents[m][10].length > 0
              ? `'${fixSingleQuote(ptBr.contents[m][10])}'`
              : null,
        },
        ru: {
          continentISO:
            ru.contents[m][2].length > 0
              ? `'${ru.contents[m][2].toLowerCase()}'`
              : null,
          continentName:
            ru.contents[m][3].length > 0
              ? `'${fixSingleQuote(ru.contents[m][3])}'`
              : null,
          isEuropeanUnion: ru.contents[m][13] === '1' ? 'true' : 'false',
          countryISO:
            ru.contents[m][4].length > 0
              ? `'${fixSingleQuote(ru.contents[m][4].toLowerCase())}'`
              : null,
          countryName:
            ru.contents[m][5].length > 0
              ? `'${fixSingleQuote(ru.contents[m][5])}'`
              : null,
          subdivision1ISO:
            ru.contents[m][6].length > 0
              ? `'${fixSingleQuote(ru.contents[m][6].toLowerCase())}'`
              : null,
          timeZone:
            ru.contents[m][12].length > 0
              ? `'${fixSingleQuote(ru.contents[m][12])}'`
              : null,
          subdivision1Name:
            ru.contents[m][7].length > 0
              ? `'${fixSingleQuote(ru.contents[m][7])}'`
              : null,
          cityName:
            ru.contents[m][10].length > 0
              ? `'${fixSingleQuote(ru.contents[m][10])}'`
              : null,
        },
        zhCn: {
          continentISO:
            zhCn.contents[m][2].length > 0
              ? `'${zhCn.contents[m][2].toLowerCase()}'`
              : null,
          continentName:
            zhCn.contents[m][3].length > 0
              ? `'${fixSingleQuote(zhCn.contents[m][3])}'`
              : null,
          isEuropeanUnion: zhCn.contents[m][13] === '1' ? 'true' : 'false',
          countryISO:
            zhCn.contents[m][4].length > 0
              ? `'${fixSingleQuote(zhCn.contents[m][4].toLowerCase())}'`
              : null,
          countryName:
            zhCn.contents[m][5].length > 0
              ? `'${fixSingleQuote(zhCn.contents[m][5])}'`
              : null,
          subdivision1ISO:
            zhCn.contents[m][6].length > 0
              ? `'${fixSingleQuote(zhCn.contents[m][6].toLowerCase())}'`
              : null,
          timeZone:
            zhCn.contents[m][12].length > 0
              ? `'${fixSingleQuote(zhCn.contents[m][12])}'`
              : null,
          subdivision1Name:
            zhCn.contents[m][7].length > 0
              ? `'${fixSingleQuote(zhCn.contents[m][7])}'`
              : null,
          cityName:
            zhCn.contents[m][10].length > 0
              ? `'${fixSingleQuote(zhCn.contents[m][10])}'`
              : null,
        },
      };

      var q0 = '',
        q1 = '',
        q2 = '',
        q3 = '',
        q4 = '',
        geonameID = Number(de.contents[m][0]);

      // Continents.
      q0 =
        `INSERT INTO continents (iso, name_de, name_en, name_es, name_fr, name_ja, name_pt_br, name_ru, name_zh_cn) ` +
        `SELECT ${data.en.continentISO}, ${data.de.continentName}, ${data.en.continentName}, ${data.es.continentName}, ` +
        `${data.fr.continentName}, ${data.ja.continentName}, ${data.ptBr.continentName}, ${data.ru.continentName}, ` +
        `${data.zhCn.continentName} ` +
        `WHERE NOT EXISTS (SELECT iso, name_de, name_en, name_es, name_fr, name_ja, name_pt_br, name_ru, name_zh_cn ` +
        `FROM continents WHERE iso = ${data.en.continentISO}); `;

      // console.log('Q0:', q0);
      await query(q0);

      if (
        data.en.subdivision1ISO &&
        data.en.countryISO &&
        data.en.countryISO !== ''
      ) {
        // Countries.
        q1 =
          `INSERT INTO countries (continent_iso, iso, is_in_european_union, name_de, name_en, name_es, name_fr, name_ja, ` +
          `name_pt_br, name_ru, name_zh_cn ) ` +
          `SELECT ${data.en.continentISO}, ${data.en.countryISO}, ${data.en.isEuropeanUnion}, ${data.de.countryName}, ` +
          `${data.en.countryName}, ${data.es.countryName}, ${data.fr.countryName}, ${data.ja.countryName}, ` +
          `${data.ptBr.countryName}, ${data.ru.countryName}, ${data.zhCn.countryName} ` +
          `WHERE NOT EXISTS (SELECT continent_iso, iso, is_in_european_union, name_de, name_en, name_es, name_fr, ` +
          `name_ja, name_pt_br, name_ru, name_zh_cn ` +
          `FROM countries WHERE iso = ${data.en.countryISO}); `;

        // console.log('Q1:', q1);
        await query(q1);

        // Subdivision 1 (states).
        q2 =
          `INSERT INTO subdivision1 (country_iso, iso, time_zone, name_de, name_en, name_es, name_fr, name_ja, ` +
          `name_pt_br, name_ru, name_zh_cn ) ` +
          `SELECT ${data.en.countryISO}, ${data.en.subdivision1ISO}, ${data.en.timeZone}, ${data.de.subdivision1Name}, ` +
          `${data.en.subdivision1Name}, ${data.es.subdivision1Name}, ${data.fr.subdivision1Name}, ` +
          `${data.ja.subdivision1Name}, ${data.ptBr.subdivision1Name}, ${data.ru.subdivision1Name}, ` +
          `${data.zhCn.subdivision1Name} ` +
          `WHERE NOT EXISTS (SELECT country_iso, iso, time_zone, name_de, name_en, name_es, name_fr, name_ja, ` +
          `name_pt_br, name_ru, name_zh_cn ` +
          `FROM subdivision1 WHERE iso = ${data.en.subdivision1ISO} AND country_iso = ${data.en.countryISO}); `;

        // console.log('Q2:', q2);
        await query(q2);

        // Subdivision 2 (cities).
        q3 =
          `INSERT INTO subdivision2 (subdivision1_iso, name_de, name_en, name_es, name_fr, name_ja, name_pt_br, name_ru, ` +
          `name_zh_cn ) ` +
          `SELECT ${data.en.subdivision1ISO}, ${data.de.cityName}, ${data.en.cityName}, ${data.es.cityName}, ` +
          `${data.fr.cityName}, ${data.ja.cityName}, ${data.ptBr.cityName}, ${data.ru.cityName}, ${data.zhCn.cityName} ` +
          `WHERE NOT EXISTS (SELECT subdivision1_iso, name_de, name_en, name_es, name_fr, name_ja, name_pt_br, name_ru, ` +
          `name_zh_cn ` +
          `FROM subdivision2 WHERE subdivision1_iso = ${data.en.subdivision1ISO} AND name_en = ${data.en.cityName}); `;

        // console.log('Q3:', q3);
        await query(q3);

        // Ip geonames.
        q4 =
          `INSERT INTO ip_geonames (id, country_iso, subdivision1_iso, subdivision2_en_name) ` +
          `VALUES (${geonameID}, ${data.en.countryISO},${data.en.subdivision1ISO}, ${data.en.cityName}); `;

        // console.log('Q4:', q4);
        await query(q4);
      }
    }
    // }catch(e){
    // 	throw new Error('while processing locales.');
    // }
  };

  /*
   * Get ip address type.
   * @param {string} ip - IP address.
   * @returns {boolean} Returns IP v4/v6 address.
   */
  const ipAddressType = (ip: string) => {
    let ipType: string = '';
    const isIPV4: RegExp = new RegExp(
      '^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(\\.|$)){4}$',
    );

    if (isIPV4.test(ip)) {
      ipType = 'ipv4';
    }

    const isIPV6: RegExp = new RegExp(
      '^((?=.*::)(?!.*::.+::)(::)?([\\dA-F]{1,4}:(:|\\b)|){5}|' +
        '([\\dA-F]{1,4}:){6})((([\\dA-F]{1,4}((?!\\3)::|:\\b|$))|(?' +
        '!\\2\\3)){2}|(((2[0-4]|1\\d|[1-9])?\\d|25[0-5])\\.?\\b){4})$',
    );

    if (isIPV6.test(ip)) {
      ipType = 'ipv6';
    }
    return ipType;
  };

  /*
   * Convert standard IP address to decimal format.
   * @param {string} ip - IP address.
   * @return {int} Returns decimal representation.
   */
  const addressToDecimal = (ip: string) => {
    const ipElts = ip.split(/\./);
    var dec =
      ((parseInt(ipElts[0], 10) << 24) >>> 0) +
      ((parseInt(ipElts[1], 10) << 16) >>> 0) +
      ((parseInt(ipElts[2], 10) << 8) >>> 0) +
      (parseInt(ipElts[3], 10) >>> 0);
    return dec;
  };

  /*
   * Convert decimal IP address to standard format.
   * @param {string} n - IP Address in decimal representation.
   * @return {string} Returns standar IP address.
   */
  const decimalToAddress = (n: number) => {
    return (
      '' +
      ((n >>> 24) & 0xff) +
      '.' +
      ((n >>> 16) & 0xff) +
      '.' +
      ((n >>> 8) & 0xff) +
      '.' +
      (n & 0xff)
    );
  };

  /*
   * Get ip address range info.
   * @param {string} ip - IP address.
   * @return {string} Returns standar IP address.
   */
  const getAddressRangeInfo = (ip: string) => {
    const i = ip.split('/'),
      address: string = i[0],
      prefix: number = Number(i[1]);
    return getAddressMaskRange(addressToDecimal(address), prefix);
  };

  /*
   * Creates a bitmask with maskSize leftmost bits set to one.
   * @param {int} prefixSize Number of bits to be set.
   * @return {int} Returns the bitmask.
   */
  const getPrefixMask = (prefixSize: number) => {
    var prefixMask = 0;
    for (var i = 0; i < prefixSize; i += 1) {
      prefixMask += (1 << (32 - (i + 1))) >>> 0;
    }
    return prefixMask;
  };

  /*
   * Creates a bitmask with maskSize rightmost bits set to one
   * @param {int} maskSize Number of bits to be set
   * @return {int} Returns the bitmask
   */
  const getMask = (maskSize: number) => {
    var mask = 0;
    for (var i = 0; i < maskSize; i += 1) {
      mask += (1 << i) >>> 0;
    }
    return mask;
  };

  /*
   * Creates a bitmask with maskSize leftmost bits set to one
   * @param {int} ipNum - prefixSize Number of bits to be set
   * @return {int} Returns the bitmask
   */
  const addressToString = (ipNum: number) => {
    var res: string = '',
      d: number = ipNum % 256;
    for (var i = 3; i > 0; i -= 1) {
      ipNum = Math.floor(ipNum / 256);
      res = (ipNum % 256) + '.' + d;
    }
    return res;
  };

  /**
   * Calculates details of a CIDR subnet
   * @param {int} ipNum Decimal IP address
   * @param {int} prefixSize Subnet mask size in bits
   * @return {object} Returns an object with the following fields:
   */
  const getAddressMaskRange = (ipNum: number, prefixSize: number) => {
    const prefixMask = getPrefixMask(prefixSize);
    const lowMask = getMask(32 - prefixSize);
    const ipLow = (ipNum & prefixMask) >>> 0;
    const ipHigh = (((ipNum & prefixMask) >>> 0) + lowMask) >>> 0;

    return {
      ipLow: ipLow,
      ipLowStr: addressToString(ipLow),

      ipHigh: ipHigh,
      ipHighStr: addressToString(ipHigh),

      prefixMask: prefixMask,
      prefixMaskStr: addressToString(prefixMask),
      prefixSize: prefixSize,

      invertedMask: lowMask,
      invertedMaskStr: addressToString(lowMask),
      invertedSize: 32 - prefixSize,
    };
  };

  /*
   * Read blocks contents.
   * @returns {Array} Returns array of blocks contents.
   */
  const processIpBlocks = async () => {
    // try {
    // Cut csv file into part(s).
    var totalPartFiles = [];
    for (let l = 0; l < blockElts.length; l += 1) {
      // Set current ip.
      const ip = blockElts[l];

      // Set ip blocks filepath.
      const blockFile = `GeoLite2-City-Blocks-${ip}.csv`;

      // Set ip blocks parts directory.
      const blockPartDir = ip.toLowerCase() + '-parts';

      // Cut ip blocks csv file.
      const res = await cutCSVFile(
        path.join(__dirname, '/../../../private/geolite2/blocks/' + blockFile),
        blockPartDir,
        5000,
      );

      // Return number of part file.
      if (res > 0) {
        totalPartFiles.push(res);
      }
    }

    // Convert part csv file to array.
    for (let p = 0; p < totalPartFiles.length; p += 1) {
      for (let l = 0; l < blockElts.length; l += 1) {
        // Set current ip.
        const ipType = blockElts[l];

        // Set ip blocks parts directory.
        const blockPartDir = ipType.toLowerCase() + '-parts';

        // Get current ip blocks part files.
        const partFiles = await readDir(
          path.join(
            __dirname,
            '/../../../private/geolite2/blocks/' + blockPartDir,
          ),
        );

        for (var f = 0; f < partFiles.length; f += 1) {
          // Set current ip block part file path.
          const currentPartFile =
            '/../../../private/geolite2/blocks/' +
            blockPartDir +
            '/' +
            partFiles[f];

          const contents = await readFile(
            path.join(__dirname, currentPartFile),
            'utf8',
          );

          // Set ip block contents.
          var blockData = csv2Array(contents);

          // Remove header data.
          if (f === 0) {
            blockData = blockData.splice(1, blockData.length);
          }

          // Parse ip block data.
          var data: any = {};

          const referenceFileLength: number = blockData.length;

          for (var m = 1; m < referenceFileLength - 1; m += 1) {
            // Extract desired data.
            const network = blockData[m][0].length > 0 ? blockData[m][0] : '';

            const networkData: any = getAddressRangeInfo(network);

            data = {
              ipType: ipType.toLowerCase(),

              ipLow: networkData.ipLow,
              ipLowStr: networkData.ipLowStr,

              ipHigh: networkData.ipHigh,
              ipHighStr: networkData.ipHighStr,

              prefixMask: networkData.prefixMask,
              prefixMaskStr: networkData.prefixMaskStr,
              prefixSize: networkData.prefixSize,

              invertedMask: networkData.invertedMask,
              invertedMaskStr: networkData.invertedMaskStr,
              invertedSize: networkData.invertedSize,
              network: network,
              geoname: {
                id: blockData[m][1].length > 0 ? Number(blockData[m][1]) : null,
                country: {
                  registeredId:
                    blockData[m][2].length > 0 ? Number(blockData[m][2]) : null,
                  representedId:
                    blockData[m][3].length > 0 ? Number(blockData[m][3]) : null,
                },
              },
              is: {
                anonymousProxy: blockData[m][4] === 0 ? false : true,
                satelliteProvider: blockData[m][5] === 0 ? false : true,
              },
              postalCode: blockData[m][6].length > 0 ? blockData[m][6] : '',
              coordinate: {
                latitude:
                  blockData[m][7].length > 0 ? Number(blockData[m][7]) : null,
                longitude:
                  blockData[m][8].length > 0 ? Number(blockData[m][8]) : null,
              },
              accuracyRadius:
                blockData[m][9].length > 0 ? Number(blockData[m][9]) : null,
            };

            var q0: string = '',
              q1: string = '';

            // Insert desired data.
            q0 =
              `INSERT INTO ip_addresses (ip_type, ip_low, ip_low_str, ip_high, ip_high_str, prefix_mask, prefix_mask_str, prefix_size, inverted_mask, inverted_mask_str, inverted_size, geoname_id) ` +
              `VALUES ('${data.ipType}', '${data.ipLow}', '${data.ipLowStr}', '${data.ipHigh}', '${data.ipHighStr}', '${data.prefixMask}', '${data.prefixMaskStr}', '${data.prefixSize}', '${data.invertedMask}', '${data.invertedMaskStr}', '${data.invertedSize}', ${data.geoname.id}); `;

            q1 =
              `INSERT INTO ip_locations (geoname_id, registered_country_geoname_id, represented_country_geoname_id, is_anonymous_proxy, is_satellite_provider, postal_code, latitude, longitude, accuracy_radius) ` +
              `VALUES (${data.geoname.id}, ${data.geoname.country.registeredId}, ${data.geoname.country.representedId}, ${data.is.anonymousProxy}, ${data.is.satelliteProvider}, '${data.postalCode}', ${data.coordinate.latitude}, ${data.coordinate.longitude}, ${data.accuracyRadius}); `;

            await query(q0);
            await query(q1);
          }
        }
      }
    }
    return 'Complete';
    // }catch(e){
    // 	throw new Error('while processing ip blocks.');
    // }
  };

  /*
   * Get ip geo info
   */
  const getIpGeoInfo = async (ip: string) => {
    try {
      let data = {};

      const decimalIp = addressToDecimal(ip);
      const [res] = await query(
        `SELECT * FROM ip_geonames ` +
          `WHERE id = (SELECT geoname_id FROM ip_addresses ` +
          `WHERE ip_low < ${decimalIp} AND ip_high > ${decimalIp} ` +
          `ORDER BY prefix_size DESC) LIMIT 1`,
      );
      return res && res.length
        ? {
            country:
              typeof res.country_iso !== 'undefined' ? res.country_iso : '',
            state:
              typeof res.subdivision1_iso !== 'undefined'
                ? res.subdivision1_iso
                : '',
            city:
              typeof res.subdivision2_en_name !== 'undefined'
                ? res.subdivision2_en_name
                : '',
          }
        : {
            country: '',
            state: '',
            city: '',
          };
    } catch (e) {
      throw new Error('while getting ip geo info.');
    }
  };

  /*
   * Get geoip service health.
   */
  const getGeoipHealth = getHealth;

  return Object.freeze({
    processLocales,
    ipAddressType,
    addressToDecimal,
    decimalToAddress,
    getAddressRangeInfo,
    getPrefixMask,
    getMask,
    addressToString,
    getAddressMaskRange,
    processIpBlocks,
    getIpGeoInfo,
    getGeoipHealth,
  });
};

export default geoipModel;
