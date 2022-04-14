const mongoose = require("mongoose");

const sauceSchema = mongoose.Schema({
  name: { type: String, require: true },
  manufacturer: { type: String, require: true },
  description: { type: String, require: true },
  mainPepper: { type: String, require: true },
  imageUrl: { type: String, require: true },
  heat: { type: Number, require: true },
  likes: { type: Number, default: 0 },
  dislikes: { type: Number, default: 0 },
  usersLiked: [{ type: Schema.Types.ObjectId, ref: "users" }],
  usersDisliked: [{ type: Schema.Types.ObjectId, ref: "users" }],
});

module.exports = mongoose.model("Sauce", sauceSchema);
