// modules
const Router = require("express").Router();
const {
  addToFavorites,
  removeFromFavorites,
} = require("../controllers/favoritesController.js");
const { protect } = require("../middlewares/protectMiddlewar.js");

// Routes

Router.post("/add/product/:product", protect(), addToFavorites);

Router.delete("/delete/product/:product", protect(), removeFromFavorites);

// exporting
module.exports = Router;
