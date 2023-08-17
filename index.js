// modules
const express = require("express");
require("dotenv").config();
const app = express();
const path = require("path");
const port = process.env.PORT;
const bodyParser = require("body-parser");
const errorHandler = require("./middlewares/errorHandeler.js");
const mountRoutes = require("./routes/index.js");
const ApiError = require("./utils/ApiError");

// body parser
app.use(bodyParser.json());

// static config
app.use(express.static(path.join(__dirname, "uploads")));

// port listen
app.listen(port, () => {
  console.log(`the app is running on port ${port}`);
});

// routes
mountRoutes(app);

app.all("*", (req, res, next) => {
  next(new ApiError(`Page Not Found 404 :${req.originalUrl}`, 500));
});

app.use(errorHandler);
