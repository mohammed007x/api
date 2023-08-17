const { check, param, body } = require("express-validator");
const validatorErrorMiddleware = require("../middlewares/validatorMiddleware.js");
const {
  createEmptyErrorMessage,
  createNotValidErrorMessage,
} = require("../utils/ErrorMessage.js");

// create review validtion
exports.createReviewValidation = [
  check("product_id")
    .notEmpty()
    .withMessage(createEmptyErrorMessage("product_id"))
    .isNumeric()
    .withMessage(createNotValidErrorMessage("product_id")),
  check("rating")
    .notEmpty()
    .withMessage(createEmptyErrorMessage("rating"))
    .isNumeric()
    .withMessage(createNotValidErrorMessage("rating")),
  check("comment").optional().notEmpty(createEmptyErrorMessage("comment")),
  validatorErrorMiddleware,
];

// update review validation
exports.updateReviewValidation = [
  param("id")
    .notEmpty()
    .withMessage(createEmptyErrorMessage("id"))
    .isNumeric()
    .withMessage(createNotValidErrorMessage("id")),
  check("product_id")
    .optional()
    .notEmpty()
    .withMessage(createEmptyErrorMessage("product_id"))
    .isNumeric()
    .withMessage(createNotValidErrorMessage("product_id")),
  check("rating")
    .optional()
    .notEmpty()
    .withMessage(createEmptyErrorMessage("rating"))
    .isNumeric()
    .withMessage(createNotValidErrorMessage("rating")),
  body("comment").optional().notEmpty().withMessage("Comment is required"),
  validatorErrorMiddleware,
];

// delete review
exports.deleteReviewValidation = [
  param("id")
    .notEmpty()
    .withMessage(createEmptyErrorMessage("id"))
    .isNumeric()
    .withMessage(createNotValidErrorMessage("id")),
  validatorErrorMiddleware,
];
