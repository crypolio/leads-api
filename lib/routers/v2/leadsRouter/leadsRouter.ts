const leadsRouter = ({ router, middleware, controller }: any) => {
  router.get("/:id", controller.get);
  router.get("/healthcheck", controller.getHealth);

  return router.routes();
};

export default leadsRouter;

