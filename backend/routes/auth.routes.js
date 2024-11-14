const express = require("express");
const router = express.Router();
const authCtrl = require("../controllers/auth.controller");
const validateLoginFormat = require("../middleware/login-validator");

// ROUTE POUR L'INSCRIPTION
router.post("/signup", validateLoginFormat, authCtrl.signup);

// ROUTE POUR LA CONNEXION
router.post("/login", validateLoginFormat, authCtrl.login);

module.exports = router;
