const express = require("express");
const router = express.Router();
const authCtrl = require("../controllers/auth.controller");

// ROUTE POUR L'INSCRIPTION
router.post("/signup", authCtrl.signup);

// ROUTE POUR LA CONNEXION
router.post("/login", authCtrl.login);

module.exports = router;
