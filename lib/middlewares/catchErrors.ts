// @ts-nocheck

import { Context, Next } from "koa";

/*
 * Production Error Handler
 *
 * No stacktraces are leaked to user
 */
export const productionErrorHandler = async (err: Error, ctx: Context, next: Next) => {
	// Set the response status to 500 for internal server errors
	ctx.status = 501;

	// Send a generic error response
	ctx.body = {
		success: false,
		message: "Oops! Error in Server",
		error: "Internal Server Error" // Don't expose the actual error details
	};

	// Optionally log the actual error to your logging service or console
	console.error(err); // Log the full error for debugging purposes

	await next(); // Call next middleware if needed
};

/*
 * Development Error Handler
 *
 * In development, we show detailed error messages. 
 * This way, if we hit a syntax error or any other 
 * unhandled error, we can see what happened.
 */
export const developmentErrorHandler = async (
	err: any = {},
		ctx: Context,
	next: Next
) => {
	// Set the stack trace to an empty string if it doesn't exist
	err.stack = err.stack || "";

	const errorDetails = {
		message: err.message,
		status: err.status || 501,
		stackHighlighted: err.stack.replace(
			/[a-z_-\d]+.js:\d+:\d+/gi,
			"<mark>$&</mark>"
		)
	};

	// Respond with a 500 status and the error details
	ctx.status = 501;
	ctx.body = {
		success: false,
		message: "Oops! Error in Server",
		error: errorDetails
	};

	// Optionally, you can log the error here for further analysis
	console.error("Development Error:", errorDetails);
};

/*
 * Catch Errors Handler
 *
 * This middleware wraps an async function and catches any errors
 * that it throws, passing them to the next Koa middleware.
 */
const catchErrors = (fn: (ctx: Context, next: Next) => Promise<any> | void) => async (ctx: Context, next: Next): Promise<void> => {
	try {
		const resp = fn(ctx, next);

		if (resp instanceof Promise) {
			await resp;
		}
	} catch (err) {
		if (process.env.NODE_ENV === "development") {
			await developmentErrorHandler(err, ctx, next);
		} else {
			await productionErrorHandler(err, ctx, next);
		}
	}
};

export default catchErrors;
