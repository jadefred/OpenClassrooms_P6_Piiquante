const passwordSchema = require("../models/password");

module.exports = (req, res, next) => {
  if (passwordSchema.validate(req.body.password)) {
    next();
  } else {
    res.status(405).json({
      error: "Le mots de passe n'est pas assez fort " + passwordSchema.validate(req.body.password, { list: true }),
    });
  }
};
