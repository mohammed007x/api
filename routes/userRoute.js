const express = require("express");
const Router = express.Router();
const { uploadSingleImage } = require("../middlewares/uploadImageMiddlewar");

const {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
} = require("../controllers/userController.js");

const {
  signUp,
  signIn,
  resetPassword,
  updateUserProfile,
  getUserData,
} = require("../controllers/AuthController.js");

const {
  createUserValidator,
  updateUserValidation,
  deleteUserValidation,
  SignUpValidation,
  SignInValidation,
  ResetPasswordValidation,
} = require("../validations/userValidation.js");

const { protect } = require("../middlewares/protectMiddlewar.js");

// routes
Router.get("/get", getUsers);

Router.post(
  "/create",
  uploadSingleImage("image"),
  createUserValidator,
  createUser
);

Router.put(
  "/update/id/:id",
  uploadSingleImage("image"),
  updateUserValidation,
  updateUser
);

Router.delete("/delete/id/:id", deleteUserValidation, deleteUser);

Router.post("/signUp", SignUpValidation, signUp);

Router.post("/signIn", SignInValidation, signIn);

Router.put("/restPassword", protect(), ResetPasswordValidation, resetPassword);

Router.put(
  "/updateProfile",
  uploadSingleImage("image"),
  protect(),
  updateUserProfile
);
Router.get("/get/profile", protect(), getUserData);

// exports
module.exports = Router;
