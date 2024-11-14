const Book = require("../models/Book");
const fs = require("fs"); // PERMET DE GÉRER LES FICHIERS (POUR LES IMAGES)

// RÉCUPÉRER TOUS LES LIVRES DE LA BASE DE DONNÉES
exports.getAllBooks = async (req, res) => {
  try {
    const books = await Book.find();
    res.status(200).json(books);
  } catch (error) {
    res.status(400).json({ error });
  }
};

// RÉCUPÉRER UN SEUL LIVRE PAR SON ID
exports.getOneBook = async (req, res) => {
  try {
    const book = await Book.findOne({ _id: req.params.id });
    if (!book) {
      return res.status(404).json({ message: "Livre non trouvé" });
    }
    res.status(200).json(book);
  } catch (error) {
    res.status(400).json({ error });
  }
};

// RÉCUPÉRER LES 3 LIVRES LES MIEUX NOTÉS
exports.getBestRatedBooks = async (req, res) => {
  try {
    // TROUVE TOUS LES LIVRES, TRIE PAR NOTE ET GARDE LES 3 PREMIERS
    const books = await Book.find().sort({ averageRating: -1 }).limit(3);
    res.status(200).json(books);
  } catch (error) {
    res.status(400).json({ error });
  }
};

// CRÉER UN NOUVEAU LIVRE
exports.createBook = async (req, res) => {
  try {
    // CONVERTIT LES DONNÉES DU LIVRE DE STRING (envoyé par le front via le formdata) EN OBJET
    const bookData = JSON.parse(req.body.book);

    // CRÉE UN NOUVEAU LIVRE
    const book = new Book({
      // On fait un spreadOperator sur l'objet bookData pour y ajouter les propriétés userId et imageUrl
      ...bookData,
      userId: req.auth.userId,
      // CRÉE L'URL DE L'IMAGE
      imageUrl: `${req.protocol}://${req.get("host")}/images/${
        req.file.filename
      }`,
    });

    await book.save();
    res.status(201).json({ message: "Livre enregistré !" });
  } catch (error) {
    res.status(400).json({ error });
  }
};

// MODIFIER UN LIVRE EXISTANT
exports.modifyBook = async (req, res) => {
  try {
    if (req.file) {
      // ON RECUPERE L'URL DE L'IMAGE POUR LA SUPPRIMER DU DOSSIER IMAGES
      const oldBook = await Book.findById(req.params.id).select("imageUrl");
      if (oldBook) {
        const oldFilename = oldBook.imageUrl.split("/images/")[1];
        try {
          fs.unlinkSync(`images/${oldFilename}`);
        } catch (err) {
          console.error(`Erreur suppression image ${oldFilename}:`, err);
        }
      }
    }

    // Prépare les données de mise à jour
    const bookData = req.file
      ? {
          ...JSON.parse(req.body.book),
          imageUrl: `${req.protocol}://${req.get("host")}/images/${
            req.file.filename
          }`,
        }
      : { ...req.body };

    // Mise à jour avec vérification du propriétaire
    const updatedBook = await Book.findOneAndUpdate(
      { _id: req.params.id, userId: req.auth.userId },
      bookData,
      { new: true }
    );

    if (!updatedBook) {
      return res
        .status(403)
        .json({ message: "Non autorisé ou livre non trouvé" });
    }

    res.status(200).json(updatedBook);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// SUPPRIMER UN LIVRE
exports.deleteBook = async (req, res) => {
  try {
    const book = await Book.findOne({ _id: req.params.id });

    // VÉRIFIE SI L'UTILISATEUR EST LE PROPRIÉTAIRE
    if (book.userId !== req.auth.userId) {
      return res.status(403).json({ message: "Non autorisé" });
    }

    // SUPPRIME L'IMAGE DU LIVRE
    // On extrait d'abord le nom du livre de l'URL
    const filename = book.imageUrl.split("/images/")[1];
    //Unlink supprime le fichier du dossier images
    fs.unlink(`images/${filename}`, async () => {
      // PUIS SUPPRIME LE LIVRE DE LA BASE DE DONNEES
      await Book.deleteOne({ _id: req.params.id });
      res.status(200).json({ message: "Livre supprimé !" });
    });
  } catch (error) {
    res.status(400).json({ error });
  }
};

// NOTER UN LIVRE
exports.rateBook = async (req, res) => {
  try {
    const book = await Book.findOne({ _id: req.params.id });

    // VÉRIFIE SI L'UTILISATEUR N'A PAS DÉJÀ NOTÉ LE LIVRE
    if (book.ratings.find((rating) => rating.userId === req.auth.userId)) {
      return res.status(400).json({ message: "Livre déjà noté" });
    }

    // AJOUTE LA NOUVELLE NOTE
    book.ratings.push({
      userId: req.auth.userId,
      grade: req.body.rating,
    });

    // RECALCULE LA MOYENNE DES NOTES
    book.getAverageRating();

    await book.save();
    res.status(200).json(book);
  } catch (error) {
    res.status(400).json({ error });
  }
};
