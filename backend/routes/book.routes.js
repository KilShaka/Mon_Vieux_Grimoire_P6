const express = require("express");
const router = express.Router();
const bookCtrl = require("../controllers/book.controller");
const auth = require("../middleware/auth");
const multer = require("../middleware/multer-config");

// ROUTES PUBLIQUES
router.get("/", bookCtrl.getAllBooks); // Obtenir tous les livres
router.get("/bestrating", bookCtrl.getBestRatedBooks); // Obtenir les 3 meilleurs livres
router.get("/:id", bookCtrl.getOneBook); // Obtenir un livre spécifique

// ROUTES QUI NECESSITENT UNE AUTHENTIFICATION
router.post("/", auth, multer, bookCtrl.createBook); // Créer un nouveau livre
router.put("/:id", auth, multer, bookCtrl.modifyBook); // Modifier un livre
router.delete("/:id", auth, bookCtrl.deleteBook); // Supprimer un livre
router.post("/:id/rating", auth, bookCtrl.rateBook); // Noter un livre

module.exports = router;
