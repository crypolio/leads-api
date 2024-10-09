"use strict";

// Internal libraries dependencies.
import utils from "./index";

const middlewares: any = {};

/*
 * Autenticate protected route(s).
 * @param {object} ctx - HTTP object.
 * @param {object} next - Callback
 */
middlewares["authenticate"] = async (ctx: any, next: any) => {
  const header = ctx.headers.authorization;
  let token;

  if (header) {
    token = header.split(" ")[1];
  }

  if (token) {
    const isValid = utils.verifyJWT(token);
    if (!isValid) {
      ctx.body = {
        errors: {
          global: "Invalid token",
        },
      };
      ctx.status = 401;
    } else {
      const data = utils.decodeJWT(token);
      ctx.request.userId = data.payload.userId;
      await next();
    }
  } else {
    ctx.body = {
      errors: {
        global: "No token",
      },
    };
    ctx.status = 401;
  }
};

export default middlewares;
