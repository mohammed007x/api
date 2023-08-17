const {
  create,
  get,
  update,
  deleteOne,
  getOne,
} = require("../utils/ApiFeacher");
const asyncHandler = require("express-async-handler");
const {
  makeImagePath,
  saveImage,
  deleteImageBypath,
} = require("../uploadImageFunctions.js");

// get Categories
exports.getCategories = asyncHandler(async (req, res) => {
  const data = await get(req, "category");
  res.status(200).json(data);
});

// create Category
exports.createCategory = asyncHandler(async (req, res, next) => {
  makeImagePath(req, "category");
  await create(req, "category");
  await saveImage(req, "category");
  return res.status(200).json({ message: "created" });
});

// update Category
exports.updateCategory = asyncHandler(async (req, res, next) => {
  makeImagePath(req, "category");
  if (req.body.image) {
    const category = await getOne(req, "category");
    if (category[0].image != null) {
      deleteImageBypath("category", category[0].image);
    }
  }
  await update(req, "category");
  saveImage(req, "category");
  res.status(200).json({
    message: "updated",
  });
});

// delete Category
exports.deleteCategory = asyncHandler(async (req, res, next) => {
  const category = await getOne(req, "category");
  if (category[0].image != null) {
    deleteImageBypath("category", category[0].image);
  }
  await deleteOne(req, "category");
  res.status(200).json({ message: "deleted" });
});
