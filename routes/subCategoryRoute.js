// modules
const express = require("express");
const Router = express.Router();

const {
  createSybCategoryValidation,
  updateSybCategoryValidation,
  deleteSybCategoryValidation,
} = require("../validations/subCategoriesValidation.js");
const {
  getSubCategories,
  createSubCategory,
  updateSubCategories,
  deleteSubCategory,
} = require("../controllers/subCategoryController.js");

// routes

Router.get("/get", getSubCategories);

Router.put("/update/id/:id", updateSybCategoryValidation, updateSubCategories);

Router.post("/create", createSybCategoryValidation, createSubCategory);

Router.delete("/delete/id/:id", deleteSybCategoryValidation, deleteSubCategory);

// exporting
module.exports = Router;
