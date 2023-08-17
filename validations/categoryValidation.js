const { check, param } = require("express-validator");
const validatorErrorMiddleware = require("../middlewares/validatorMiddleware.js");
const {
  createEmptyErrorMessage,
  createNotValidErrorMessage,
} = require("../utils/ErrorMessage.js");

// name , image , ishaveSubCategories

exports.createCategoryValidation = [
  check("name").notEmpty().withMessage(createEmptyErrorMessage("name")),
  check("ishaveSubCategories")
    .notEmpty()
    .withMessage(createEmptyErrorMessage("ishaveSubCategories"))
    .isBoolean()
    .withMessage(createNotValidErrorMessage("ishaveSubCategories")),
  validatorErrorMiddleware,
];

exports.UpdateCategoryValidation = [
  param("id")
    .notEmpty()
    .withMessage(createEmptyErrorMessage("id"))
    .isNumeric()
    .withMessage(createNotValidErrorMessage("id")),
  check("name")
    .optional()
    .notEmpty()
    .withMessage(createEmptyErrorMessage("name")),
  check("ishaveSubCategories")
    .optional()
    .notEmpty()
    .withMessage(createEmptyErrorMessage("ishaveSubCategories"))
    .isBoolean()
    .withMessage(createNotValidErrorMessage("ishaveSubCategories")),
  validatorErrorMiddleware,
];

exports.DeleteCategoryValidation = [
  param("id")
    .notEmpty()
    .withMessage(createEmptyErrorMessage("id"))
    .isNumeric()
    .withMessage(createNotValidErrorMessage("id")),
  validatorErrorMiddleware,
];
