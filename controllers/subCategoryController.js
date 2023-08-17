const {
  create,
  get,
  update,
  deleteOne,
  getOne,
} = require("../utils/ApiFeacher");
const asyncHandler = require("express-async-handler");

// get sub category
exports.getSubCategories = asyncHandler(async (req, res, next) => {
  const data = await get(req, "subcategory");
  res.status(200).json(data);
});

// create sub category
exports.createSubCategory = asyncHandler(async (req, res, next) => {
  const category = await getOne(req, "category", req.body.category);
  if (category[0].ishaveSubCategories == true) {
    await create(req, "subcategory");
    return res.status(200).json({
      message: "created",
    });
  }
  return res.status(400).json({
    message: "this category dont have ability to add sub catrgory",
  });
});

// update sub categories
exports.updateSubCategories = asyncHandler(async (req, res, next) => {
  await update(req, "subcategory");
  res.status(200).json({
    message: "updated",
  });
});

// delete sub category
exports.deleteSubCategory = asyncHandler(async (req, res, next) => {
  await deleteOne(req, "subcategory");
  res.status(200).json({ message: "deleted" });
});
