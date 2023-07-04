
const express = require("express");
const { addQueue } = require("../controllers/queue.controller");
const router = express.Router();

express.Router.prefix = function (path, subRouter) {
    const router = express.Router();
    this.use(path, router);
    subRouter(router);
    return router;
}

router.prefix("/queue", (adminRoute) => {
    // adminRoute.get("/", getAllAdmins);
    // adminRoute.get("/:id", getadminById);
    adminRoute.post("/add", addQueue);
    // adminRoute.put("/:id", updateAdmin);
    // adminRoute.delete("/:id", deleteAdmin);
});

module.exports = router;