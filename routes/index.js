// modules
const userRouter = require("./userRoute.js");
const CategoryRouter = require("./categoryRout.js");
const subCategoryRouter = require("./subCategoryRoute");
const productRouter = require("./productRoute.js");
const FavoritesRouter = require("./favoritesRoute");
const ReviewRouter = require("./reviewRoute.js");

// mount Routes
const mountRoutes = (app) => {
  app.use("/api/v1/user", userRouter);
  app.use("/api/v1/category", CategoryRouter);
  app.use("/api/v1/sub-category", subCategoryRouter);
  app.use("/api/v1/product", productRouter);
  app.use("/api/v1/favorites", FavoritesRouter);
  app.use("/api/v1/review", ReviewRouter);
};

// exports
module.exports = mountRoutes;

//  users table => id , type , fullName ,email , password , adress , phoneNumber , image
//  proparites tabel => id , product id , name , vlaue
//  favuirets table => id , user id , product id
//  reviews table => id , user id , product id , rating , comment , date
//  category tabel => id , name , image , ishaveSubCategories
//  sub categories table => id , name , category id
//  filtter sub category table => id ,sub category id , name , values
//  filtter category table => id ,sub category id , name , values
//  product table => id , category id ,subCategory Id, images , price , discountPrice , summary
//  order table => id , user id , product id , pricing , quantity
