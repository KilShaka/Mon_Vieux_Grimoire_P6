const multer = require("multer");

// TYPES MIME ACCEPTÉS
const MIME_TYPES = {
  "image/jpg": "jpg",
  "image/jpeg": "jpg",
  "image/png": "png",
};

// CONFIGURATION DU STOCKAGE
const storage = multer.diskStorage({
  // DESTINATION DES FICHIERS
  destination: (req, file, callback) => {
    callback(null, "images");
  },
  // NOM DU FICHIER
  filename: (req, file, callback) => {
    // REMPLACE LES ESPACES PAR DES UNDERSCORES
    const name = file.originalname.split(" ").join("_");
    // RÉCUPÈRE L'EXTENSION DU FICHIER
    const extension = MIME_TYPES[file.mimetype];
    // CRÉE LE NOM FINAL : nom_timestamp.extension
    callback(null, name + Date.now() + "." + extension);
  },
});

// EXPORT DU MIDDLEWARE CONFIGURÉ
module.exports = multer({
  storage: storage,
  // FILTRE LES FICHIERS POUR N'ACCEPTER QUE LES IMAGES
  fileFilter: (req, file, callback) => {
    if (MIME_TYPES[file.mimetype]) {
      callback(null, true);
    } else {
      callback(new Error("Type de fichier non supporté !"), false);
    }
  },
}).single("image");
