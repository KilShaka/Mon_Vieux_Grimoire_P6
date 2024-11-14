const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

// REGLES APPLIQUEES AU MDP :
// - Au moins 8 caractères
// - Au moins une majuscule
// - Au moins une minuscule
// - Au moins un chiffre
// - Au moins un caractère spécial (. compris)
const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.])[A-Za-z\d@$!%*?&.]{8,}$/;

const validateLoginFormat = (req, res, next) => {
  const { email, password } = req.body;

  // ON VALIDE L'EMAIL
  if (!email || !emailRegex.test(email)) {
    return res.status(400).json({
      error:
        "Format d'email invalide. Veuillez utiliser une adresse email valide.",
    });
  }

  // ON VALIDE LE MDP
  if (!password || !passwordRegex.test(password)) {
    return res.status(400).json({
      error:
        "Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial.",
    });
  }

  next();
};

module.exports = validateLoginFormat;
