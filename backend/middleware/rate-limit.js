const rateLimit = require("express-rate-limit");

exports.globalLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

exports.authLimit = rateLimit({
  windowMs: 60 * 1000,
  max: 15,
  message: "Trop de tentatives de connexion, réessayez dans une minute",
});
