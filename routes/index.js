const clientRoute = require("./client.routes");

const { Router } = require("express");
const router = Router();
router.use(clientRoute);
module.exports = router;