const multer = require("multer");
const sharp = require("sharp");
const path = require("path");

// TYPES MIME ACCEPTÉS
const MIME_TYPES = {
  "image/jpg": "jpg",
  "image/jpeg": "jpg",
  "image/png": "png",
};

// ON CONFIGURE MULTER
const upload = multer({
  storage: multer.memoryStorage(), //Configuration du stockage temporaire pour Multer
  fileFilter: (req, file, callback) => {
    if (MIME_TYPES[file.mimetype]) {
      callback(null, true);
    } else {
      callback(new Error("Type de fichier non supporté !"), false);
    }
  },
}).single("image");

// Middleware d'optimisation des images
const optimizeImage = async (req, res, next) => {
  if (!req.file) return next();

  try {
    // ON CREE UN NOM DE FICHIER UNIQUE
    const name = req.file.originalname
      .split(".")[0] // Prend seulement le nom sans l'extension
      .split(" ")
      .join("_") // Remplace les espaces par des underscores
      .replace(/[^a-zA-Z0-9_]/g, ""); // Retire les caractères spéciaux
    const filename = `${name}_${Date.now()}.webp`;

    // CHEMIN DE DESTINATION
    const outputPath = path.join("images", filename);

    // OPTIMISATION DE L'IMAGE AVEC SHARP
    await sharp(req.file.buffer)
      .resize({
        width: 405, // Largeur maximale
        height: 570, // Hauteur maximale
        fit: "inside", // Conserve les proportions
        withoutEnlargement: true, // Ne pas agrandir si l'image est plus petite
      })
      .webp({ quality: 80 }) // Conversion WebP avec qualité à 80%
      .toFile(outputPath);

    // Ajout du chemin de l'image optimisée à la requête
    req.file.filename = filename;

    next();
  } catch (error) {
    console.error("Erreur lors de l'optimisation de l'image:", error);
    next(error);
  }
};

// EXPORT DU MIDDLEWARE COMBINÉ
module.exports = (req, res, next) => {
  upload(req, res, (err) => {
    if (err) {
      return next(err);
    }
    optimizeImage(req, res, next);
  });
};
