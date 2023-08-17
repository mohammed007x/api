const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");
const { create, get, update } = require("../utils/ApiFeacher");
const {
  makeImagePath,
  saveImage,
  deleteImageBypath,
} = require("../uploadImageFunctions.js");

exports.signUp = asyncHandler(async (req, res, next) => {
  req.query.email = req.body.email;
  // create the user
  try {
    const password = req.body.password;
    const hashPassword = await bcrypt.hash(password, 12);
    const data = {
      email: req.body.email,
      fullName: req.body.fullName,
      password: hashPassword,
      type: "user",
    };
    await create(req, "users", data);
  } catch (e) {
    return res.status(400).json({ message: "email must be uniqe" });
  }
  const user = await get(req, "users");
  // generate token
  const token = jwt.sign(
    { userId: user.rows[0].id },
    process.env.JWT_SECRET_KEY
  );
  return res.status(200).json({
    user: user.rows,
    token,
  });
});

// sign in
exports.signIn = asyncHandler(async (req, res, next) => {
  req.query.email = req.body.email;
  const user = await get(req, "users");
  if (user.rows.length === 0) {
    return res.status(400).json({ message: "email or password not valid" });
  }
  const isValidPassword = await bcrypt.compare(
    req.body.password, // Fix the key here
    user.rows[0].password // Fix the key here
  );
  if (!isValidPassword) {
    return res.status(400).json({ message: "email or password not valid" });
  }
  // generate token
  const token = jwt.sign(
    { userId: user.rows[0].id },
    process.env.JWT_SECRET_KEY
  );
  return res.status(200).json({
    user: user.rows,
    token,
  });
});

// reset password
exports.resetPassword = asyncHandler(async (req, res, next) => {
  const user = req.user;
  const newPassword = req.body.newPassword;
  const isValidPassword = await bcrypt.compare(
    req.body.lastPassword, // Fix the key here
    user.password // Fix the key here
  );
  if (!isValidPassword) {
    return res.status(400).json({ message: "wrong last password" });
  }
  // hash the new password
  const hashPassword = await bcrypt.hash(newPassword, 12);

  req.params.id = user.id;
  await update(req, "users", { password: hashPassword });
  res.status(200).json({
    message: "reseted",
  });
});

// update user profile
exports.updateUserProfile = asyncHandler(async (req, res, next) => {
  makeImagePath(req, "users");
  const data = { ...req.body };

  delete data.email;
  delete data.password;
  delete data.type;

  if (req.body.image) {
    const user = await getOne(req, "users");
    if (user[0].image != null) {
      deleteImageBypath("users", user[0].image);
    }
  }
  req.params.id = req.user.id;
  await update(req, "users", data);
  saveImage(req, "users");
  res.status(290).json({
    message: "updated",
  });
});

// get user data by token
exports.getUserData = asyncHandler((req, res, next) => {
  res.status(200).json(req.user);
});

