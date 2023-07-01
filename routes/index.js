const clientRoute = require("./client.routes");
const adminRoute = require("./admin.routes");

const { Router } = require("express");
const router = Router();

router.use(clientRoute);
router.use(adminRoute);

module.exports = router;