const clientRoute = require("./client.routes");
const adminRoute = require("./admin.routes");
const serviceRoute = require("./service.routes");
const queueRoute = require("./queue.routes");
const otpRoute = require("./otp.routes");

const { Router } = require("express");
const router = Router();

router.use(clientRoute);
router.use(adminRoute);
router.use(serviceRoute);
router.use(queueRoute);
router.use(otpRoute);

module.exports = router;