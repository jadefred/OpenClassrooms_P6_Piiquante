const Sauce = require("../models/sauce");
const User = require("../models/user");
const fs = require("fs");

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

  //check if req.file exist
  //if yes => delete old image in server by search sauce's id, save new req.body and image url to sauceObj
  //if no => get all req.body and save to sauceObj
  function checkFile() {
    if (req.file) {
      Sauce.findById({ _id: req.params.id }, (err, data) => {
        if (err) {
          res.status(500).json({ message: err });
        }
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

  //update DB
  Sauce.updateOne({ _id: req.params.id }, { ...sauceObj })
    .then(() => res.status(200).json("la sauce a été mise à jour"))
    .catch((err) => res.status(500).json({ message: err }));
};

exports.deleteSauce = (req, res, next) => {
  //find image url by sauce's id, then delete its photo in server
  Sauce.findById({ _id: req.params.id }, (err, data) => {
    if (err) {
      res.status(500).json({ message: err });
    }
    const lastPartUrl = data.imageUrl.split("/").pop();
    fs.unlink(`images/${lastPartUrl}`, (err) => {
      if (err) {
        console.log("failed to delete local image:" + err);
      } else {
        console.log("successfully deleted local image");
      }
    });
  });

  Sauce.deleteOne({ _id: req.params.id })
    .then(() => res.status(204).json({ message: "la sauce à été supprimé" }))
    .catch((err) => res.status(500).json({ message: err }));
};

exports.likeSauce = (req, res, next) => {
  const like = req.body.like;
  const userId = req.body.userId;
  const sauceId = req.params.id;

  Sauce.findById({ _id: sauceId }, (err, data) => {
    switch (like) {
      //if like is positive 1, add 1 like and push user's id to usersLiked array, then update DB
      case 1:
        Sauce.updateOne(
          { _id: sauceId },
          { $push: { usersLiked: userId }, likes: data.likes + 1 }
        )
          .then(() =>
            res.status(200).json({ message: "les likes sont été mis à jour" })
          )
          .catch((err) => {
            res.status(500).json({ message: err });
          });
        break;

      default:
        console.log("action undefined");
    }
  });
};
