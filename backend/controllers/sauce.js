const Sauce = require("../models/sauce");
const User = require("../models/user");
const fs = require("fs");
const path = require("path");

exports.getAllSauces = (req, res, next) => {
  Sauce.find()
    .then((sauces) => res.status(200).json(sauces))
    .catch((err) => res.status(500).json({ message: err }));
};

exports.createSauce = async (req, res, next) => {
  const sauceObj = JSON.parse(req.body.sauce);
  const imageUrl = `${req.protocol}://${req.get("host")}/${req.file.path}`;

  const newSauce = new Sauce({
    ...sauceObj,
    imageUrl: imageUrl,
    likes: 0,
    dislikes: 0,
  });

  await newSauce
    .save()
    .then(() => res.status(201).json("Sauce enregistrée !"))
    .catch((err) => res.status(500).json({ message: err }));
};

exports.getOneSauce = (req, res, next) => {
  Sauce.findById(req.params.id, (err, data) => {
    if (err) {
      res.status(500).json({ message: error });
    }
    res.status(200).json(data);
  });
};

exports.modifySauce = (req, res, next) => {
  let sauceObj = {};

  function checkFile() {
    if (req.file) {
      Sauce.findById({ _id: req.params.id }, (err, data) => {
        const lastPartUrl = data.imageUrl.split("/").pop();
        fs.unlink(`images/${lastPartUrl}`, (err) => {
          if (err) {
            console.log("failed to delete local image:" + err);
          } else {
            console.log("successfully deleted local image");
          }
        });
      });

      sauceObj = {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get("host")}/${req.file.path}`,
      };
    } else {
      sauceObj = { ...req.body };
    }
  }

  checkFile();

  Sauce.updateOne({ _id: req.params.id }, { ...sauceObj })
    .then(() => res.status(200).json("sauce mise à jour"))
    .catch((err) => res.status(500).json({ message: err }));
};

exports.deleteSauce = (req, res, next) => {};

exports.likeSauce = (req, res, next) => {};
