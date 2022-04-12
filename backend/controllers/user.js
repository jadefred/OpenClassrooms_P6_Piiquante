const bcrypt = require("bcrypt");
const saltRounds = 10;

const User = require("../models/user");

exports.signup = (req, res, next) => {
  bcrypt
    .hash(req.body.password, saltRounds)
    .then((hash) => {
      const user = new User({
        email: req.body.email,
        password: hash,
      });

      user
        .save()
        .then(() => res.status(201).json({ message: "Utilisateur créé !" }))
        .catch((error) => res.status(400).json({ message: error }));
    })
    .catch((error) => res.status(500).json({ error }));
};
