const {
  create,
  get,
  update,
  deleteOne,
  getOne,
} = require("../utils/ApiFeacher");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const {
  makeImagePath,
  saveImage,
  deleteImageBypath,
} = require("../uploadImageFunctions.js");

// check if we have image => get the file name => return

exports.getUsers = asyncHandler(async (req, res) => {
  const data = await get(req, "users");
  res.status(200).json(data);
});

exports.createUser = asyncHandler(async (req, res, next) => {
  makeImagePath(req, "users");
  const password = req.body.password;
  const hashPassword = await bcrypt.hash(password, 12);
  const data = { ...req.body, password: hashPassword };
  await create(req, "users", data);
  await saveImage(req, "users");
  return res.status(200).json({ message: "created" });
});

exports.updateUser = asyncHandler(async (req, res, next) => {
  makeImagePath(req, "users");
  let data = req.body;
  if (req.body.password) {
    const password = req.body.password;
    const hashPassword = await bcrypt.hash(password, 12);
    data = { ...req.body, password: hashPassword };
  }

  if (req.body.image) {
    const user = await getOne(req, "users");
    if (user[0].image != null) {
      deleteImageBypath("users", user[0].image);
    }
  }
  await update(req, "users", data);
  saveImage(req, "users");

  res.status(200).json({
    message: "updated",
  });
});

exports.deleteUser = asyncHandler(async (req, res, next) => {
  const user = await getOne(req, "users");
  if (user[0].image != null) {
    deleteImageBypath("users", user[0].image);
  }
  await deleteOne(req, "users");
  res.status(200).json({ message: "deleted" });
});
