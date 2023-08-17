const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const ApiError = require("../utils/ApiError.js");
const { get, getOne } = require("../utils/ApiFeacher.js");

exports.protect = (optional = false) =>
  asyncHandler(async (req, res, next) => {
    // 1) Check if token exist, if exist get
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }
    if (!token) {
      return optional
        ? next()
        : next(
            new ApiError(
              "You are not login, Please login to get access this route",
              401
            )
          );
    }

    // 2) Verify token (no change happens, expired token)
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    // 3) Check if user exists
    const user = await getOne(req, "users", decoded.userId);
    if (user === 0) {
      return optional
        ? next()
        : next(new ApiError("please inter a valid token", 401));
    }
    req.user = user[0];
    next();
  });
