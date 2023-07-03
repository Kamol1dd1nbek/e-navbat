const clientRoute = require("./client.routes");
const adminRoute = require("./admin.routes");
const serviceRoute = require("./service.routes");

const { Router } = require("express");
const router = Router();

router.use(clientRoute);
router.use(adminRoute);
router.use(serviceRoute);

module.exports = router;