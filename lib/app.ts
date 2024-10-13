// @ts-nocheck
const startServer = ({
  config,
  utils,
  constants,
  middlewares,
  enabledServices
}) => {
  const app = new utils.Koa();
  const router = new utils.Router();

  const isDevelopment = config.app.env.includes("development");

  // Define CORS options
  const corsOptions = {
    origin: (ctx: Koa.Context) => {
      const origin = ctx.request.header.origin;
      if (constants.WHITELISTED_DOMAINS.includes(origin as string)) {
        return origin;
      }
      return constants.REDIRECT_URL;
    },
    credentials: true
  };

  // // Middleware setup
  // if (isDevelopment) {
  // 	app.use(utils.morgan("dev"));
  // }

  app.use(utils.helmet());

  app.use(utils.cors(corsOptions));

  app.use(utils.bodyParser({ jsonLimit: "1mb", formLimit: "1mb" }));

  // Root route
  router.get("/", async ctx => {
    const userAgent = ctx.headers["user-agent"];
    if (!userAgent || isDevelopment) {
      ctx.body = "LeadEasyGen API";
    } else {
      ctx.redirect(constants.REDIRECT_URL);
    }
  });

  // Set REST api endpoint(s).
  if (enabledServices && enabledServices.length) {
    enabledServices.forEach((serviceRouter: any) => {
      app.use(serviceRouter.routes()).use(serviceRouter.allowedMethods());
    });
  }

  app.use(router.routes()).use(router.allowedMethods());

  // Error handling
  app.use(middlewares.notFound);

  if (isDevelopment) {
    app.use(middlewares.developmentErrorHandler);
  } else {
    app.use(middlewares.productionErrorHandler);
  }

  utils.credit();
  utils.startServerMsg(config);

  app.listen(config.app.port);

  return app.callback();
};

export default startServer;
