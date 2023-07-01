
const express = require("express");
const { addAdmin, getAllAdmins, getadminById, updateAdmin, deleteAdmin } = require("../controllers/admin.controller");
const router = express.Router();

express.Router.prefix = function (path, subRouter) {
    const router = express.Router();
    this.use(path, router);
    subRouter(router);
    return router;
}

router.prefix("/admin", (adminRoute) => {
    adminRoute.get("/", getAllAdmins);
    adminRoute.get("/:id", getadminById);
    adminRoute.post("/add", addAdmin);
    adminRoute.put("/:id", updateAdmin);
    adminRoute.delete("/:id", deleteAdmin);
});

module.exports = router;