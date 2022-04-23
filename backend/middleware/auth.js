const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const secretCode = process.env.JWT_SECRET_STRING;

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, secretCode);
    const userId = decodedToken.userId;
    if (req.body.userId && req.body.userId !== userId) {
      throw "User ID non valable !";
    } else {
      next();
    }
  } catch (error) {
    res.status(401).json({ error: " Requête non authentifiée !" });
  }
};
