
const express = require("express");
const { addService, getAllServices, getServiceById, updateService, deleteService } = require("../controllers/service.controller");
const router = express.Router();

express.Router.prefix = function (path, subRouter) {
    const router = express.Router();
    this.use(path, router);
    subRouter(router);
    return router;
}

router.prefix("/service", (serviceRoute) => {
    serviceRoute.get("/", getAllServices);
    serviceRoute.get("/:id", getServiceById);
    serviceRoute.post("/add", addService);
    serviceRoute.put("/:id", updateService);
    serviceRoute.delete("/:id", deleteService);
});

module.exports = router;