const { check, param } = require("express-validator");
const validatorErrorMiddleware = require("../middlewares/validatorMiddleware.js");
const {
  createEmptyErrorMessage,
  createNotValidErrorMessage,
} = require("../utils/ErrorMessage.js");

// id , category , subcategory , name , images , price , discount_price , summary

exports.createProductValidation = [
  check("category")
    .notEmpty()
    .withMessage(createEmptyErrorMessage("category"))
    .isNumeric()
    .withMessage(createNotValidErrorMessage("category")),
  check("subcategory")
    .optional()
    .notEmpty()
    .withMessage(createEmptyErrorMessage("subcategory"))
    .isNumeric()
    .withMessage(createNotValidErrorMessage("subcategory")),
  check("name").notEmpty().withMessage(createEmptyErrorMessage("name")),
  check("price").notEmpty().withMessage(createEmptyErrorMessage("price")),
  check("discount_price")
    .optional()
    .notEmpty()
    .withMessage(createEmptyErrorMessage("discount_price")),
  check("summary").notEmpty().withMessage(createEmptyErrorMessage("summary")),
  validatorErrorMiddleware,
];

exports.updateProductValidation = [
  param("id")
    .notEmpty()
    .withMessage(createEmptyErrorMessage("id"))
    .isNumeric()
    .withMessage(createNotValidErrorMessage("id")),
  check("category")
    .optional()
    .notEmpty()
    .withMessage(createEmptyErrorMessage("category"))
    .isNumeric()
    .withMessage(createNotValidErrorMessage("category")),
  check("subcategory")
    .optional()
    .optional()
    .notEmpty()
    .withMessage(createEmptyErrorMessage("subcategory"))
    .isNumeric()
    .withMessage(createNotValidErrorMessage("subcategory")),
  check("name")
    .optional()
    .notEmpty()
    .withMessage(createEmptyErrorMessage("name"))
    .optional(),
  check("price")
    .optional()
    .notEmpty()
    .withMessage(createEmptyErrorMessage("price"))
    .optional(),
  check("discount_price")
    .optional()
    .notEmpty()
    .withMessage(createEmptyErrorMessage("discount_price")),
  check("summary")
    .optional()
    .notEmpty()
    .withMessage(createEmptyErrorMessage("summary")),
  validatorErrorMiddleware,
];

exports.deleteProductValidation = [
  param("id")
    .notEmpty()
    .withMessage(createEmptyErrorMessage("id"))
    .isNumeric()
    .withMessage(createNotValidErrorMessage("id")),
  validatorErrorMiddleware,
];

exports.deleteProductImageValidation = [
  check("image")
    .notEmpty()
    .withMessage(createEmptyErrorMessage("image"))
    .isNumeric()
    .withMessage(createNotValidErrorMessage("image")),
];
