const { check, param } = require("express-validator");
const validatorErrorMiddleware = require("../middlewares/validatorMiddleware.js");
const {
  createEmptyErrorMessage,
  createNotValidErrorMessage,
} = require("../utils/ErrorMessage.js");

// name , category

exports.createSybCategoryValidation = [
  check("name").notEmpty().withMessage(createEmptyErrorMessage("name")),
  check("category")
    .notEmpty()
    .withMessage(createEmptyErrorMessage("category"))
    .isNumeric()
    .withMessage(createNotValidErrorMessage("category")),
  validatorErrorMiddleware,
];

exports.updateSybCategoryValidation = [
  param("id")
    .notEmpty()
    .withMessage(createEmptyErrorMessage("id"))
    .isNumeric()
    .withMessage(createNotValidErrorMessage("id")),
  check("name")
    .optional()
    .notEmpty()
    .withMessage(createEmptyErrorMessage("name")),
  check("category")
    .optional()
    .notEmpty()
    .withMessage(createEmptyErrorMessage("category"))
    .isNumeric()
    .withMessage(createNotValidErrorMessage("category")),
  validatorErrorMiddleware,
];

exports.deleteSybCategoryValidation = [
  param("id")
    .notEmpty()
    .withMessage(createEmptyErrorMessage("id"))
    .isNumeric()
    .withMessage(createNotValidErrorMessage("id")),
  validatorErrorMiddleware,
];
