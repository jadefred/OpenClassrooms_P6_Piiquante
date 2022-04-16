const Sauce = require("../models/sauce");
const User = require("../models/user");

exports.getAllSauces = (req, res, next) => {
  Sauce.find()
    .then((things) => res.status(200).json(things))
    .catch((error) => res.status(500).json({ error }));
};

exports.createSauce = (req, res, next) => {};

exports.getOneSauce = (req, res, next) => {};

exports.modifySauce = (req, res, next) => {};

exports.deleteSauce = (req, res, next) => {};

exports.likeSauce = (req, res, next) => {};
