const {
  create,
  get,
  update,
  deleteOne,
  getOne,
} = require("../utils/ApiFeacher");
const asyncHandler = require("express-async-handler");

// get all reviews
exports.getReviews = asyncHandler(async (req, res, next) => {
  const data = await get(req, "review");
  res.status(200).json(data);
});

// create review
exports.createReview = asyncHandler(async (req, res, next) => {
  await create(req, "review", { ...req.body, user_id: req.user.id });
  res.status(200).json({
    mesaage: "created",
  });
});

// update review
exports.updateReview = asyncHandler(async (req, res, next) => {
  await update(req, "review", req.body);
  res.status(200).json({
    mesaage: "updated",
  });
});

// delete review
exports.deleteReview = asyncHandler(async (req, res, next) => {
  await deleteOne(req, "review");
  res.status(200).json({
    message: "deleted",
  });
});
