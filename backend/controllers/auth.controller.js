const bcrypt = require("bcrypt"); // POUR HASHER LE MOT DE PASSE
const jwt = require("jsonwebtoken"); // POUR CRÉER LES TOKENS
const User = require("../models/User");

// FONCTION D'INSCRIPTION
exports.signup = async (req, res) => {
  try {
    // HASH DU MOT DE PASSE
    const hash = await bcrypt.hash(
      req.body.password,
      parseInt(process.env.BCRYPT_SALT_ROUNDS)
    );

    // CRÉATION DU NOUVEL UTILISATEUR
    const user = new User({
      email: req.body.email,
      password: hash,
    });

    // SAUVEGARDE DANS LA BASE DE DONNÉES
    await user.save();

    res.status(201).json({ message: "Utilisateur créé !" });
  } catch (error) {
    res.status(400).json({ error });
  }
};

// FONCTION DE CONNEXION
exports.login = async (req, res) => {
  try {
    // RECHERCHE DE L'UTILISATEUR DANS LA BASE
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.status(401).json({ message: "Email/mot de passe incorrect" });
    }

    // VÉRIFICATION DU MOT DE PASSE
    const valid = await bcrypt.compare(req.body.password, user.password);

    if (!valid) {
      return res.status(401).json({ message: "Email/mot de passe incorrect" });
    }

    // CRÉATION DU TOKEN JWT
    res.status(200).json({
      userId: user._id,
      token: jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
        expiresIn: "4h",
      }),
    });
  } catch (error) {
    res.status(500).json({ error });
  }
};
