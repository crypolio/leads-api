// @ts-nocheck

import { Context, Next } from "koa";

/*
 * Not Found Error Handler
 *
 * If we hit a route that is not found, we mark it as 404 and pass it along to the next error handler to display.
 */
const notFound = async (ctx: Context, next: Next) => {
  // Set status to 404
  ctx.status = 404;
  ctx.body = {
    success: false,
    message: "API URL doesn't exist"
  };

  // Create a new error for logging
  const error = new Error(`🔍 - Not Found - ${ctx.originalUrl}`);

  // Pass the error to the next middleware
  await next(error);
};

export default notFound;
