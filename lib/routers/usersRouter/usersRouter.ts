"use strict";

const usersRouter = ({ router, middlewares, controller }: any) => {
  router.get("/healthcheck", controller.getUserHealth);

  router.post("/auth", controller.auth);
  router.post("/register", controller.register);
  router.post("/recover", controller.recover);
  router.get("/account", middlewares.authenticate, controller.account);
  router.post("/activate", controller.activate);
  router.get("/balance", middlewares.authenticate, controller.balance);

  router.put("/update", /* middlewares.authenticate, */ controller.update);
  router.get("/accessLogs", middlewares.authenticate, controller.accessLogs);
  router.get(
    "/accountLock",
    /* middlewares.authenticate, */ controller.accountLock,
  );
  router.get(
    "/resendLock",
    /* middlewares.authenticate, */ controller.resendLock,
  );
  router.get(
    "/activateLock",
    /* middlewares.authenticate, */ controller.activateLock,
  );
  router.post(
    "/deactivateLock",
    /* middlewares.authenticate, */ controller.deactivateLock,
  );
  router.get("/logout", /* middlewares.authenticate, */ controller.logout);

  // router.get("/list", 		/* middlewares.authenticate, */		controller.list)
  // router.get("/get", 		/* middlewares.authenticate, */		controller.get)
  // router.put("/updateAccount", 	/* middlewares.authenticate, */		controller.update)
  // router.delete("/deleteAeccount",	/* middlewares.authenticate, */		controller.update)

  return router;
};

export default usersRouter;
