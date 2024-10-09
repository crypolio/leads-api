'use strict';

import pg from 'pg';

// Internal libraries dependencies.
import config from './../../config';

class PostgresUtil {
  constructor(uri = '') {
    // Set database connection.
    this.connection = new pg.Client(
      uri && uri.length ? uri : config.db.system.uri, {
        ssl: { rejectUnauthorized: false}
    });
    this.connection.connect();
  }

  /*
   * Execute SQL query on database.
   * @returns {string} Returns deatabase SQL query response.
   */
  async query(sql, args) {
    try {
      const data = await this.connection.query(sql, args);
      return data.rows;
    } catch (e) {
      console.error(e);
    }
  }

  /*
   * Execute SQL query on database.
   * @returns {string} Returns deatabase SQL query response.
   */
  async queryStream(sql, args, cb = () => null) {
    try {
      const stream = await this.connection.query(
        new QueryStream(sql, args),
        args,
      );
      // release the client when the stream is finished

      // stream.on('end', this.connection.end());
      // stream.pipe(JSONStream.stringify()).pipe(cb);

      stream.on('data', (chunk) => cb(chunk));

      stream.on('end', function () {
        console.log('END....');
        // res.send(Buffer.concat(chunks));
      });
    } catch (e) {
      console.error(e);
    }
  }

  /*
   * Close database connection.
   */
  async close() {
    return this.connection.end();
  }

  /*
   * Escape SQL query character(s).
   * @returns {string} Returns escaped SQL query.
   */
  // mysql_real_escape_string(str){
  real_escape_string(str) {
    return str.replace(/[\0\x08\x09\x1a\n\r"'\\\%]/g, (char) => {
      switch (char) {
        case '\0':
          return '\\0';
        case '\x08':
          return '\\b';
        case '\x09':
          return '\\t';
        case '\x1a':
          return '\\z';
        case '\n':
          return '\\n';
        case '\r':
          return '\\r';
        case '"':
        case "'":
        case '\\':
        case '%':
          return '\\' + char;
        // prepends a backslash to backslash, percent,
        // and double/single quotes
      }
    });
  }

  /*
   * Fix string with single quote.
   * @params {string} s - Single quoted tring.
   * @returns {string} - Returns parsed string for db insertion.
   */
  fixSingleQuote(s) {
    return s.indexOf("'") >= 0 ? s.replace(/'/g, "''") : s;
  }
}

export default PostgresUtil;
