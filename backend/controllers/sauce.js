const Sauce = require("../models/sauce");
const fs = require("fs");

exports.getAllSauces = (req, res, next) => {
  Sauce.find()
    .then((sauces) => res.status(200).json(sauces))
    .catch((err) => res.status(500).json({ message: err }));
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
    .then(() => res.status(201).json({ message: "Sauce enregistrée !" }))
    .catch((err) => res.status(500).json({ error: err }));
};

exports.getOneSauce = async (req, res, next) => {
  try {
    const sauceObj = await Sauce.findById(req.params.id);

    //if user entered sauce id not exist (eg deleted) will get 404
    if (sauceObj === null) {
      res.status(404).json({ error: "Sauce non trouvée" });
    }

    res.status(200).json(sauceObj);
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

exports.modifySauce = async (req, res, next) => {
  let sauceObj = await Sauce.findById(req.params.id).catch((err) =>
    res.status(500).json({ error: err })
  );

  //if sauce id is invalid
  if (sauceObj === null) {
    res.status(404).json({ error: "Aucune sauce a été trouvée" });
  }

  //function to delete uploaded image by its file name
  function deleteImage(url) {
    fs.unlink(`images/${url}`, (err) => {
      if (err) {
        console.log("failed to delete local image:" + err);
      } else {
        console.log("successfully deleted local image");
      }
    });
  }

  //check if the modification has changed the sauce's image
  if (req.file) {
    //check if userId is matched with the sauce creator userId
    if (JSON.parse(req.body.sauce).userId != sauceObj.userId) {
      //if not, delete uploaded image and throw error
      deleteImage(req.file.filename);
      res.status(401).json({ error: "L'action non autorisée" });
    } else {
      //if yes, delete old image and update DB
      const lastPartUrl = sauceObj.imageUrl.split("/").pop();
      deleteImage(lastPartUrl);

      sauceObj = {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get("host")}/${req.file.path}`,
      };

      updateDB();
    }
  } else {
    if (sauceObj.userId != req.body.userId) {
      res.status(401).json({ error: "L'action non autorisée" });
    } else {
      sauceObj = { ...req.body };
      updateDB();
    }
  }

  function updateDB() {
    Sauce.updateOne({ _id: req.params.id }, { ...sauceObj })
      .then(() =>
        res.status(200).json({ message: "la sauce a été mise à jour" })
      )
      .catch((err) => res.status(500).json({ error: err }));
  }
};

exports.deleteSauce = async (req, res, next) => {
  //search sauce by id, make function of delete image and data in DB await before return the response
  const sauceObj = await Sauce.findById(req.params.id).catch((err) =>
    res.status(500).json({ error: err })
  );

  //if no sauce is found
  if (sauceObj === null) {
    res.status(404).json({ error: "Aucune sauce a été trouvée" });
  }

  const lastPartUrl = sauceObj.imageUrl.split("/").pop();

  await fs.unlink(`images/${lastPartUrl}`, (err) => {
    if (err) {
      console.log("failed to delete local image:" + err);
    } else {
      console.log("successfully deleted local image");
    }
  });

  await Sauce.deleteOne({ _id: req.params.id }).catch((err) =>
    res.status(500).json({ error: err })
  );

  return res.status(204).json({ message: "La sauce a été supprimée" });
};

exports.likeSauce = async (req, res, next) => {
  const like = req.body.like;
  const userId = req.body.userId;
  const sauceId = req.params.id;

  //get sauce info by its id
  const sauceObj = await Sauce.findById({ _id: sauceId }).catch((err) =>
    res.status(500).json({ error: err })
  );

  //check if the user was already reacted to the sauce
  const userLikedBefore = sauceObj.usersLiked.includes(userId);
  const userDislikedBefore = sauceObj.usersDisliked.includes(userId);

  //if user liked this sauce already
  if (userLikedBefore === true) {
    switch (like) {
      //user wanna like it again => reject
      case 1:
        res.status(409).json({ error: "Utilisateur l'a déjà likée" });
        break;

      //user unlike the sauce
      case 0:
        sauceObj.usersLiked = sauceObj.usersLiked.filter(
          (id) => id._id.toString() !== userId
        );
        sauceObj.likes = sauceObj.usersLiked.length;
        sauceObj
          .save()
          .then(() => res.status(200).json({ message: "Unliké" }))
          .catch((err) => res.status(500).json({ error: err }));
        break;

      //user change like to dislike
      case -1:
        sauceObj.usersLiked = sauceObj.usersLiked.filter(
          (id) => id._id.toString() !== userId
        );
        sauceObj.likes = sauceObj.usersLiked.length;
        sauceObj.usersDisliked.push(userId);
        sauceObj.dislikes = sauceObj.usersDisliked.length;
        sauceObj
          .save()
          .then(() =>
            res
              .status(200)
              .json({ message: "Utilisateur a changé son like à dislike" })
          )
          .catch((err) => res.status(500).json({ error: err }));
        break;

      default:
        res.status(406).json({ error: "l'action indéfiniee" });
    }
  }

  //if user disliked this sauce already
  if (userDislikedBefore === true) {
    switch (like) {
      //user change dislike to like
      case 1:
        sauceObj.usersDisliked = sauceObj.usersDisliked.filter(
          (id) => id._id.toString() !== userId
        );
        sauceObj.dislikes = sauceObj.usersDisliked.length;
        sauceObj.usersLiked.push(userId);
        sauceObj.likes = sauceObj.usersLiked.length;
        sauceObj
          .save()
          .then(() =>
            res
              .status(200)
              .json({ message: "Utilisateur a changé son dislike à like" })
          )
          .catch((err) => res.status(500).json({ error: err }));
        break;

      //user undislike the sauce
      case 0:
        sauceObj.usersDisliked = sauceObj.usersDisliked.filter(
          (id) => id._id.toString() !== userId
        );
        sauceObj.dislikes = sauceObj.usersDisliked.length;
        sauceObj
          .save()
          .then(() => res.status(200).json({ message: "Undisliké" }))
          .catch((err) => res.status(500).json({ error: err }));
        break;

      //user wanna dislike the sauce again => reject
      case -1:
        res.status(409).json({ error: "Utilisateur l'a déjà dislikée" });
        break;

      default:
        res.status(406).json({ error: "l'action indéfiniee" });
    }
  }

  //haven't give like or dislike before
  if (!userLikedBefore && !userDislikedBefore) {
    switch (like) {
      //like the sauce
      case 1:
        sauceObj.usersLiked.push(userId);
        sauceObj.likes = sauceObj.usersLiked.length;
        sauceObj
          .save()
          .then(() => res.status(200).json({ message: "Liké" }))
          .catch((err) => res.status(500).json({ error: err }));

        break;

      //dislike the sauce
      case -1:
        sauceObj.usersDisliked.push(userId);
        sauceObj.dislikes = sauceObj.usersDisliked.length;
        sauceObj
          .save()
          .then(() => res.status(200).json({ message: "Disliké" }))
          .catch((err) => res.status(500).json({ error: err }));

        break;

      default:
        res.status(406).json({ error: "l'action indéfiniee" });
    }
  }
};
