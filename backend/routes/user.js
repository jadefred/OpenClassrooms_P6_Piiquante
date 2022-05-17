const express = require("express");
const router = express.Router();

const userCtrl = require("../controllers/user");
//middleware to check strength of password 
const passwordValidator = require("../middleware/passwordValidator");

router.post("/signup",passwordValidator, userCtrl.signup);
router.post("/login", userCtrl.login);

module.exports = router;
