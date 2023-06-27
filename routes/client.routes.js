const { addClient } = require("../controllers/client.controller");

const { Router } = require("express");
const router = Router();

router.post("/client/add", addClient);

module.exports = router;