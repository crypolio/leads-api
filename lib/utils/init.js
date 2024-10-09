'use strict';

// Internal libraries dependencies.
import utils from './../utils';
import config from './../config';

const init = async () => {
  // try {

  utils.credit();
  utils.startServerMsg(config);

  const dbConnection = utils.pg;

  // Verify if we have a connection.
  if (dbConnection) {
    const migrations = [
      '../../private/db_schema.sql',
      '../../private/assets/fiat.sql',
      '../../private/assets/equity/amex.sql',
      '../../private/assets/equity/nasdaq.sql',
      '../../private/assets/equity/nyse.sql',
      '../../private/assets/crypto.sql',
    ];

    let count = 0;

    for (let m = 0; m < migrations.length; m += 1) {
      const tmpSQLScript = migrations[m];
      console.log(` Running migration stage ${m + 1} `);
      await dbConnection.query(
        utils.fs
          .readFileSync(utils.path.join(__dirname, tmpSQLScript))
          .toString(),
      );
      count += 1;
    }

    if (count === migrations.length) {
      await dbConnection.close();
    }
  }
  process.exit();
  // } catch (e) {
  // 	throw new Error('while migrating markets db.');
  // }
};

init();
