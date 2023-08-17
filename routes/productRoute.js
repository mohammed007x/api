// modelues
const express = require("express");
const Router = express.Router();
const {
  createProductValidation,
  updateProductValidation,
  deleteProductValidation,
  deleteProductImageValidation,
} = require("../validations/productValidation.js");

const {
  createProduct,
  uploadProductImages,
  getProducts,
  deleteProduct,
  updateProduct,
  uploadProductCoverImages,
  deleteProductImage,
  AddProductImage,
  updateProductImage,
} = require("../controllers/productController");

const { uploadSingleImage } = require("../middlewares/uploadImageMiddlewar.js");

const { protect } = require("../middlewares/protectMiddlewar.js");

// Routes
Router.get("/get", protect(true), getProducts);

Router.post(
  "/create",
  uploadProductImages,
  createProductValidation,
  createProduct
);

Router.delete("/delete/id/:id", deleteProductValidation, deleteProduct);

Router.put(
  "/update/id/:id",
  uploadProductCoverImages,
  updateProductValidation,
  updateProduct
);

Router.delete(
  "/delete/image/id/:id",
  deleteProductImageValidation,
  deleteProductImage
);

Router.put("/add/image/id/:id", uploadSingleImage("image"), AddProductImage);

Router.put(
  "/update/image/id/:id",
  uploadSingleImage("image"),
  updateProductImage
);

// exporting
module.exports = Router;
