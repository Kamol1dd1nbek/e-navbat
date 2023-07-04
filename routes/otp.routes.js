const { Router } = require('express');
const express = require('express');
const { newOTP, verifyOTP } = require('../controllers/otp.controller');
const router = Router();

express.Router.prefix = function (path, subRouter) {
    const router = express.Router();
    this.use(path, router);
    subRouter(router);
    return router;
}

router.prefix("/otp", (otpRoute) => {
    otpRoute.post("/newotp", newOTP);
    otpRoute.post("/verifyotp", verifyOTP);
    // otpRoute.put("/:id", updateAdmin);
    // otpRoute.delete("/:id", deleteAdmin);
});

module.exports =  router;