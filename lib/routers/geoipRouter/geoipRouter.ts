"use strict";

const geoipRouter = ({ router, middlewares, controller }: any) => {
  // router.get("/", /* middlewares.authenticate, */ controller.getIp)
  router.get("/healthcheck", controller.getGeoipHealth);
  router.post("/", /* middlewares.authenticate, */ controller.getIp);

  return router;
};

export default geoipRouter;
