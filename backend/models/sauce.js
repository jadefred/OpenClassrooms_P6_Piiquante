const mongoose = require("mongoose");

const User = require("./user");

const sauceSchema = mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  name: { type: String, require: true },
  manufacturer: { type: String, require: true },
  description: { type: String, require: true },
  mainPepper: { type: String, require: true },
  imageUrl: { type: String, require: true },
  heat: { type: Number, require: true },
  likes: { type: Number, default: 0 },
  dislikes: { type: Number, default: 0 },
  usersLiked: [
    { type: mongoose.Schema.Types.ObjectId, ref: "User", default: undefined },
  ],
  usersDisliked: [
    { type: mongoose.Schema.Types.ObjectId, ref: "User", default: undefined },
  ],
  //type & ref => try to get users schema from mongoDB, default => to avoid having empty [] when no value is assigned
});

module.exports = mongoose.model("Sauce", sauceSchema);
