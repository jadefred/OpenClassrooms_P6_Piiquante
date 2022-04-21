const Sauce = require("../models/sauce");
const User = require("../models/user");

exports.getAllSauces = (req, res, next) => {
  Sauce.find()
    .then((sauces) => res.status(200).json(sauces))
    .catch((error) => res.status(500).json({ error }));
};

exports.createSauce = (req, res, next) => {
  //console.log(JSON.parse(req.body.sauce));
  console.log(req.body);
};

exports.getOneSauce = (req, res, next) => {
  Sauce.findById(req.params.id, (err, data) => {
    if (err) {
      res.status(500).json({ error });
    }
    res.status(200).json(data);
  });
};

exports.modifySauce = (req, res, next) => {};

exports.deleteSauce = (req, res, next) => {};

exports.likeSauce = (req, res, next) => {};
