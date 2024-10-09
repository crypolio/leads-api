CREATE TABLE task_statuses (
	id INTEGER PRIMARY KEY,
	slug TEXT UNIQUE
);

CREATE TABLE tasks (
	id TEXT PRIMARY KEY,
	www TEXT,
	status INTEGER DEFAULT 0 NOT NULL,
	date_created INTEGER
);

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

CREATE TABLE IF NOT EXISTS lead_emails (
	lead_id TEXT,
	task_id TEXT,
	email TEXT
);
