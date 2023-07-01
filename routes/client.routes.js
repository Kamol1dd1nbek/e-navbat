const { addClient, getAllClients, getClientById, updateClient, deleteClient } = require("../controllers/client.controller");

const express = require("express");
const router = express.Router();

express.Router.prefix = function (path, subRouter) {
    const router = express.Router();
    this.use(path, router);
    subRouter(router);
    return router;
}

router.prefix("/client", (clientRouter) => {
    clientRouter.get("/", getAllClients);
    clientRouter.get("/:id", getClientById);
    clientRouter.post("/add", addClient);
    clientRouter.put("/:id", updateClient);
    clientRouter.delete("/:id", deleteClient);
});

module.exports = router;