const asyncHandler = require("express-async-handler");
const { create, get, update } = require("../utils/ApiFeacher");
const pool = require("../db.js");

// add product
exports.addToFavorites = asyncHandler(async (req, res, next) => {
  const user_id = req.user.id;
  const product_id = req.params.product;
  await create(req, "favorites", {
    user_id,
    product_id,
  });
  res.status(200).json({
    message: "product added to your favorites",
  });
});

// remove product
exports.removeFromFavorites = asyncHandler(async (req, res, next) => {
  await pool.query(`DELETE FROM favorites
  WHERE user_id = ${req.user.id}
    AND product_id = ${req.params.product};`);
  res.status(200).json({
    message: "product deleted from your favorites",
  });
});
