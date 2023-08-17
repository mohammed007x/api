// modules
const Router = require("express").Router();
const {
  createReviewValidation,
  updateReviewValidation,
  deleteReviewValidation,
} = require("../validations/reviewValidation.js");

const {
  getReviews,
  createReview,
  updateReview,
  deleteReview,
} = require("../controllers/reviewController.js");

const { protect } = require("../middlewares/protectMiddlewar.js");

// routes
Router.get("/get", getReviews);

Router.post("/create", protect(), createReviewValidation, createReview);

Router.put("/update/id/:id", protect(), updateReviewValidation, updateReview);

Router.delete(
  "/delete/id/:id",
  protect(),
  deleteReviewValidation,
  deleteReview
);

// exporting
module.exports = Router;
