'use strict';

const sqlite3 = require('sqlite3').cached;

// Internal libraries dependencies.
const config = require('./../../config');

class SQLiteUtil {

	constructor(dbPath = '') {
		// Set database connection.
		// this.db = new sqlite3.Database(dbPath || config.db.system.uri);
		this.db = new sqlite3.Database(dbPath || './abed.db');
		this.initializeDatabase();
	}

	async initializeDatabase() {
		try {
			await this.createTables();
		} catch (err) {
			console.error('Error initializing database:', err.message);
			throw err;
		}
	}

	async createTables() {
		const createTaskStatuses = `
			CREATE TABLE IF NOT EXISTS task_statuses (
				id INTEGER PRIMARY KEY,
				slug TEXT UNIQUE
			);

			INSERT OR IGNORE INTO task_statuses (id, slug) VALUES 
			(0, 'pending'),
			(1, 'complete'),
			(2, 'processing'),
			(3, 'scraping'),
			(4, 'error');
		`;

		const createTasks = `
			CREATE TABLE IF NOT EXISTS tasks (
				id TEXT PRIMARY KEY,
				www TEXT,
				status INTEGER DEFAULT 0 NOT NULL,
				date_created INTEGER
			);
		`;

		const createLeads = `
			CREATE TABLE IF NOT EXISTS leads (
				id TEXT PRIMARY KEY,
				task_id TEXT,
				name TEXT,
				rating REAL,
				reviews INTEGER,
				category TEXT,
				address TEXT,
				phone TEXT,
				www TEXT
			);
		`;

		const createLeadEmails = `
			CREATE TABLE IF NOT EXISTS lead_emails (
				lead_id TEXT,
				task_id TEXT,
				email TEXT
			);
		`;

		await this.run(createTaskStatuses);
		await this.run(createTasks);

		await this.run(createLeads);
		await this.run(createLeadEmails);
	}

	async run(sql, args = []) {
		return new Promise((resolve, reject) => {
			this.db.run(sql, args, function(err) {
				if (err) {
					console.error(err);
					reject(err);
				} else {
					resolve(this);
				}
			});
		});
	}

	/*
	 * Execute SQL query on database.
	 * @returns {Promise<Array>} Returns database SQL query response.
	 */
	async query(sql, args = []) {
		return new Promise((resolve, reject) => {
			this.db.all(sql, args, (err, rows) => {
				if (err) {
					console.error(err);
					reject(err);
				} else {
					resolve(rows);
				}
			});
		});
	}

	/*
	 * Execute SQL query with stream on database.
	 * @returns {void} Calls callback for each row in the stream.
	 */
	queryStream(sql, args = [], cb = () => null) {
		const stmt = this.db.prepare(sql, args);

		stmt.each(args, (err, row) => {
			if (err) {
				console.error(err);
			} else {
				cb(row);
			}
		});

		stmt.finalize();
	}

	/*
	 * Close database connection.
	 */
	async close() {
		return new Promise((resolve, reject) => {
			this.db.close((err) => {
				if (err) {
					console.error(err);
					reject(err);
				} else {
					resolve();
				}
			});
		});
	}

	/*
	 * Escape SQL query character(s).
	 * @returns {string} Returns escaped SQL query.
	 */
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
			}
	});
}

/*
 * Fix string with single quote.
 * @params {string} s - Single quoted string.
 * @returns {string} - Returns parsed string for db insertion.
 */
fixSingleQuote(s) {
	return s.indexOf("'") >= 0 ? s.replace(/'/g, "''") : s;
}
}

module.exports = SQLiteUtil;
