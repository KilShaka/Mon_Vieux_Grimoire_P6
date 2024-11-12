const express = require("express");
const mongoose = require("mongoose");
const path = require("path"); // Module Node.js pour gérer les chemins de fichiers
require("dotenv").config();

// Création de l'APP Express
const app = express();

app.use(express.json());

// CORS (Cross Origin Resource Sharing)

// Nécessaire  FRONT et BACK sont sur des ports différents
app.use((req, res, next) => {
  // AUTORISER TOUTES LES ORIGINES
  res.setHeader("Access-Control-Allow-Origin", "*");
  //EN-TÊTES AUTORISEES
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );

  //METHODES HTTP AUTORISEES
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

// Configuration du dossier statique pour les images
app.use("/images", express.static(path.join(__dirname, "images")));
// Permet d'accéder aux images via : http://localhost:4000/images/nom-image.jpg

// CONNEXION A MONGODB

async function connectToMongoDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connexion à MongoDB réussie !");
  } catch (error) {
    console.log("Connexion à MongoDB échouée :", error);
    process.exit(1); // Arrête l'application si la connexion échoue
  }
}

async function startServer() {
  try {
    // Connexion a la BDD
    await connectToMongoDB();

    // ROUTES
    // Routes pour l'authentification
    const authRoutes = require("./routes/auth.routes");
    app.use("/api/auth", authRoutes);
    // Routes pour les livres
    const bookRoutes = require("./routes/book.routes");
    app.use("/api/books", bookRoutes);
    // Démarrage du serveur
    const port = process.env.PORT || 4000;
    app.listen(port, () => {
      console.log(`Serveur démarré sur le port ${port}`);
    });
  } catch (error) {
    console.error("Erreur lors du démarrage du serveur :", error);
    process.exit(1);
  }
}

startServer();
