const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    // RÉCUPÉRATION DU TOKEN DANS LE HEADER
    const token = req.headers.authorization.split(" ")[1];

    // DÉCODAGE DU TOKEN
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    // EXTRACTION DE L'ID UTILISATEUR DU TOKEN
    const userId = decodedToken.userId;

    // AJOUT DE L'AUTH À LA REQUÊTE
    req.auth = {
      userId: userId,
    };

    next();
  } catch (error) {
    res.status(401).json({ error: "Requête non authentifiée !" });
  }
};
