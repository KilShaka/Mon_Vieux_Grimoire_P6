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
    mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connexion à MongoDB réussie !");
  } catch (error) {
    console.log("Connexion à MongoDB échouée :", error);
    process.exit(1); // Si Echec de co = l'Appli s'arrête
  }
}

async function startServer() {
  try {
    // Connexion a la BDD
    await connectToMongoDB();

    // Routes (A FAIRE)
    // app.use('/api/auth', authRoutes); // Futures routes pour l'authentification
    // app.use('/api/books', bookRoutes); // Futures routes pour les livres

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
