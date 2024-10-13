const tasksRouter = ({ router, middlewares, controller }: any) => {
  router.get("/list", controller.list);
  router.post("/create", controller.create);
  router.get("/healthcheck", controller.getHealth);

  return router.routes();
};

export default tasksRouter;
