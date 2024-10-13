// @ts-nocheck

import { Context, Next } from "koa";

/*
 * Production Error Handler
 *
 * No stacktraces are leaked to user
 */
const productionErrorHandler = async (err: Error, ctx: Context, next: Next) => {
  // Set the response status to 500 for internal server errors
  ctx.status = 500;

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

export default productionErrorHandler;
