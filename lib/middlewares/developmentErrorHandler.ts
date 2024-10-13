// @ts-nocheck

import { Context, Next } from "koa";

/*
 * Development Error Handler
 *
 * In development, we show detailed error messages. This way, if we hit a syntax error or any other unhandled error, we can see what happened.
 */
const developmentErrorHandler = async (
  err: any = {},
  ctx: Context,
  next: Next
) => {
  // Set the stack trace to an empty string if it doesn't exist
  err.stack = err.stack || "";

  const errorDetails = {
    message: err.message,
    status: err.status || 500,
    stackHighlighted: err.stack.replace(
      /[a-z_-\d]+.js:\d+:\d+/gi,
      "<mark>$&</mark>"
    )
  };

  // Respond with a 500 status and the error details
  ctx.status = 500;
  ctx.body = {
    success: false,
    message: "Oops! Error in Server",
    error: errorDetails
  };

  // Optionally, you can log the error here for further analysis
  console.error("Development Error:", errorDetails);
};

export default developmentErrorHandler;
