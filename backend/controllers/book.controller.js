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
    // CONVERTIT LES DONNÉES DU LIVRE DE STRING EN OBJET
    const bookData = JSON.parse(req.body.book);

    // CRÉE UN NOUVEAU LIVRE
    const book = new Book({
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
    const book = await Book.findOne({ _id: req.params.id });

    // VÉRIFIE SI LE LIVRE EXISTE
    if (!book) {
      return res.status(404).json({ message: "Livre non trouvé" });
    }

    // VÉRIFIE SI L'UTILISATEUR EST LE PROPRIÉTAIRE
    if (book.userId !== req.auth.userId) {
      return res.status(403).json({ message: "Non autorisé" });
    }

    // MET À JOUR LE LIVRE
    await Book.updateOne(
      { _id: req.params.id },
      { ...req.body, _id: req.params.id }
    );
    res.status(200).json({ message: "Livre modifié !" });
  } catch (error) {
    res.status(400).json({ error });
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
    const filename = book.imageUrl.split("/images/")[1];
    fs.unlink(`images/${filename}`, async () => {
      // PUIS SUPPRIME LE LIVRE DE LA BASE
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
