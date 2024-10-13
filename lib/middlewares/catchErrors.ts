// @ts-nocheck

import { Context, Next } from "koa";

/*
 * Catch Errors Handler
 *
 * This middleware wraps an async function and catches any errors
 * that it throws, passing them to the next Koa middleware.
 */
const catchErrors =
  (fn: (ctx: Context, next: Next) => Promise<any> | void) =>
  async (ctx: Context, next: Next): Promise<void> => {
    // try {
    const resp = fn(ctx, next);

    if (resp instanceof Promise) {
      await resp; // Await the promise to catch errors
    }
    // } catch (err) {
    // 	next(err); // Pass the error to the next middleware
    // }
  };

export default catchErrors;
