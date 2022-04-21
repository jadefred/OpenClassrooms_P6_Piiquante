const Sauce = require("../models/sauce");
const User = require("../models/user");

exports.getAllSauces = (req, res, next) => {
  Sauce.find()
    .then((sauces) => res.status(200).json(sauces))
    .catch((error) => res.status(500).json({ error }));
};

exports.createSauce = (req, res, next) => {
  const sauceObj = JSON.parse(req.body.sauce);
  const imageUrl = `${req.protocol}://${req.get("host")}/${req.file.path}`;

  const newSauce = new Sauce({
    ...sauceObj,
    imageUrl: imageUrl,
    likes: 0,
    dislikes: 0,
  });

  newSauce
    .save()
    .then(() => res.status(201).json("Sauce enregistrée !"))
    .catch((err) => res.status(500).json({ message: err }));
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
