const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/ApiError.js");

// user , manager , admin

exports.allowedTo = (...roles) =>
  asyncHandler(async (req, res, next) => {
    if (!roles.includes(req.user.type)) {
      return next(
        new ApiError("You are not allowed to access this route", 403)
      );
    }
    next();
  });
