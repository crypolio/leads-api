'use strict';

const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const express = require('express');

const appRoutes = require('./routers');
const errorHandlers = require('./handlers/errorHandlers');

const app = express(); // create our Express app

const corsOptions = {
	origin: true,
	credentials: true,
};

// setting cors at one place for all the routes
// putting cors as first in order to avoid unneccessary requests from unallowed origins
app.use((req, res, next) => {
	if (req.url.includes('/v1')) {
		cors(corsOptions)(req, res, next);
	} else {
		cors()(req, res, next);
	}
});

// serves up static files from the public folder. Anything in public/ will just be served up as the file it is

// Takes the raw requests and turns them into usable properties on req.body

app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Authentication, public, download api routes.
// app.use('/v1', coreRoutes.authRouter);
// app.use('/public', coreRoutes.publicRouter);
// app.use('/download', coreRoutes.downloadRouter);

app.use(appRoutes); 		// Enterprise resource planning (ERP) routes.
// app.use(coreApiRoutes); 	// Core api routes

// If that above routes didnt work, we 404 them and forward to error handler
app.use(errorHandlers.notFound);

// Otherwise this was a really bad error we didn't expect! Shoot eh
if (app.get('env') === 'development') {
	/* Development Error Handler - Prints stack trace */
	app.use(errorHandlers.developmentErrors);
}

// production error handler
app.use(errorHandlers.productionErrors);

// done! we export it so we can start the site in start.js
module.exports = app;

