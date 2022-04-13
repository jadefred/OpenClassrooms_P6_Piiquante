const bcrypt = require("bcrypt");
const saltRounds = 10;
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const secretCode = process.env.JWT_SECRET_STRING;

const User = require("../models/user");

exports.signup = async (req, res) => {
  try {
    const bcryptPwd = await bcrypt.hash(req.body.password, saltRounds);
    const user = new User({
      email: req.body.email,
      password: bcryptPwd,
    });

    await user.save();
    res.status(201).json({ message: "Utilisateur créé !" });
  } catch (error) {
    res.status(500).json({ error });
  }
};

exports.login = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(401).json({ error: "Utilisateur non trouvé !" });
    }

    const match = await bcrypt.compare(req.body.password, user.password);
    if (!match) {
      return res.status(401).json({ error: "Mot de passe incorrect !" });
    }
    res.status(200).json({
      userId: user._id,
      token: jwt.sign({ userId: user._id }, secretCode, {
        expiresIn: "24h",
      }),
    });
  } catch (error) {
    res.status(500).json(error);
  }
};
