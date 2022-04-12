const bcrypt = require("bcrypt");
const saltRounds = 10;

const User = require("../models/user");

exports.signup = async (req, res, next) => {
  try {
    const bcryptPwd = await bcrypt.hash(req.body.password, saltRounds);
    const user = new User({
      email: req.body.email,
      password: bcryptPwd,
    });

    user
      .save()
      .then(() => res.status(201).json({ message: "Utilisateur créé !" }))
      .catch((error) => res.status(400).json({ message: error }));
  } catch (error) {
    res.status(500).json({ error });
  }
};
