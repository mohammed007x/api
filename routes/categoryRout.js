// modules
const express = require("express");
const Router = express.Router();
const { uploadSingleImage } = require("../middlewares/uploadImageMiddlewar");
const {
  createCategoryValidation,
  UpdateCategoryValidation,
  DeleteCategoryValidation,
} = require("../validations/categoryValidation");
const {
  getCategories,
  updateCategory,
  createCategory,
  deleteCategory,
} = require("../controllers/categoryController.js");
const { protect } = require("../middlewares/protectMiddlewar");

// Routes

Router.get("/get", getCategories);

Router.put(
  "/update/id/:id",
  uploadSingleImage("image"),
  UpdateCategoryValidation,
  updateCategory
);

Router.post(
  "/create",
  protect(),
  uploadSingleImage("image"),
  createCategoryValidation,
  createCategory
);

Router.delete("/delete/id/:id", DeleteCategoryValidation, deleteCategory);

// exporting
module.exports = Router;
