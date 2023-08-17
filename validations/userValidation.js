const { check, param } = require("express-validator");
const validatorErrorMiddleware = require("../middlewares/validatorMiddleware.js");
const {
  createEmptyErrorMessage,
  createNotValidErrorMessage,
} = require("../utils/ErrorMessage.js");

// users table => id , type , fullName ,email , password , adress , phoneNumber , image

exports.createUserValidator = [
  check("type")
    .optional()
    .notEmpty()
    .withMessage(createEmptyErrorMessage("type")),
  check("fullName").notEmpty().withMessage(createEmptyErrorMessage("fullName")),
  check("email")
    .notEmpty()
    .withMessage(createEmptyErrorMessage("email"))
    .isEmail()
    .withMessage(createNotValidErrorMessage("email")),
  check("password").notEmpty().withMessage(createEmptyErrorMessage("password")),
  validatorErrorMiddleware,
];

exports.updateUserValidation = [
  param("id")
    .notEmpty()
    .withMessage(createEmptyErrorMessage("id"))
    .isNumeric()
    .withMessage(createNotValidErrorMessage("id")),
  check("email")
    .optional()
    .isEmail()
    .withMessage(createNotValidErrorMessage("email")),
  validatorErrorMiddleware,
];

exports.deleteUserValidation = [
  param("id")
    .notEmpty()
    .withMessage(createEmptyErrorMessage("id"))
    .isNumeric()
    .withMessage(createNotValidErrorMessage("id")),
  validatorErrorMiddleware,
];

exports.SignUpValidation = [
  check("fullName").notEmpty().withMessage(createEmptyErrorMessage("fullName")),
  check("email")
    .notEmpty()
    .withMessage(createEmptyErrorMessage("email"))
    .isEmail()
    .withMessage(createNotValidErrorMessage("email")),
  check("password")
    .notEmpty()
    .withMessage(createEmptyErrorMessage("password"))
    .isLength({ min: 8 })
    .withMessage("short password"),
  validatorErrorMiddleware,
];

exports.SignInValidation = [
  check("email")
    .notEmpty()
    .withMessage(createEmptyErrorMessage("email"))
    .isEmail()
    .withMessage(createNotValidErrorMessage("email")),
  check("password")
    .notEmpty()
    .withMessage(createEmptyErrorMessage("password"))
    .isLength({ min: 8 })
    .withMessage("short password"),
  validatorErrorMiddleware,
];

exports.ResetPasswordValidation = [
  check("lastPassword")
    .notEmpty()
    .withMessage(createEmptyErrorMessage("lastPassword"))
    .isLength({ min: 8 })
    .withMessage("short lastPassword"),
  check("newPassword")
    .notEmpty()
    .withMessage(createEmptyErrorMessage("newPassword"))
    .isLength({ min: 8 })
    .withMessage("short newPassword"),
  validatorErrorMiddleware,
];
