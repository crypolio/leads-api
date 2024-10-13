const leadsRouter = ({ router, middlewares, controller }: any) => {
  router.get("/:id", controller.get);
  router.get("/healthcheck", controller.getHealth);

  return router;
  // return router.routes();
};

export default leadsRouter;
