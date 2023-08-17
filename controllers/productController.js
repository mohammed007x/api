const sharp = require("sharp");
const { v4: uuidv4 } = require("uuid");
const {
  create,
  get,
  update,
  deleteOne,
  getOne,
} = require("../utils/ApiFeacher");
const asyncHandler = require("express-async-handler");
const { uploadMixOfImages } = require("../middlewares/uploadImageMiddlewar.js");
const {
  deleteImageBypath,
  deleteMultipleImagesByPath,
  makeImagePath,
  saveImage,
} = require("../uploadImageFunctions.js");

exports.uploadProductImages = uploadMixOfImages([
  {
    name: "cover_image",
    maxCount: 1,
  },
  {
    name: "images",
    maxCount: 5,
  },
]);

exports.uploadProductCoverImages = uploadMixOfImages([
  {
    name: "cover_image",
    maxCount: 1,
  },
]);

const makeProductCoverImagePath = asyncHandler((req) => {
  if (req.files.cover_image) {
    const imageCoverFileName = `product-${uuidv4()}-${Date.now()}-cover.jpeg`;
    req.body.cover_image = imageCoverFileName;
  }
});

const makeProductImagesPath = asyncHandler((req) => {
  if (req.files.images) {
    let imagesPaths = [];
    req.files.images.map((img, index) => {
      const imageName = `product-${uuidv4()}-${Date.now()}-${index + 1}.jpeg`;
      imagesPaths.push(imageName);
      req.body.images = imagesPaths.join(",");
    });
  }
});

const saveProductCoverImage = asyncHandler(async (req) => {
  if (req.body.cover_image) {
    await sharp(req.files.cover_image[0].buffer)
      .resize(2000, 1333)
      .toFormat("jpeg")
      .jpeg({ quality: 95 })
      .toFile(`uploads/products/${req.body.cover_image}`);
  }
});

const saveProductaImages = asyncHandler(async (req) => {
  if (req.body.images) {
    await Promise.all(
      req.files.images.map(async (img, index) => {
        await sharp(img.buffer)
          .resize(2000, 1333)
          .toFormat("jpeg")
          .jpeg({ quality: 95 })
          .toFile(`uploads/products/${req.body.images.split(",")[index]}`);
      })
    );
  }
});
exports.getProducts = asyncHandler(async (req, res, next) => {
  let userQuery = "";
  if (req.user) {
    userQuery = `SELECT
            p.*,
            c.name AS category_name,
            CASE
                WHEN f.user_id IS NOT NULL THEN true
                ELSE false
            END AS in_favorites,
            COALESCE(rating.avg_rating, 0) AS rating
          FROM product p
          INNER JOIN category c
              ON p.category = c.id
          LEFT JOIN favorites f
              ON p.id = f.product_id AND f.user_id = ${req.user.id}
          LEFT JOIN (
              SELECT product_id, COALESCE(AVG(rating), 0) AS avg_rating
              FROM review
              GROUP BY product_id
          ) rating
              ON p.id = rating.product_id`;
  } else {
    userQuery = `SELECT
            p.* ,
            c.name AS category_name,
            false AS in_favorites,
            COALESCE(rating.avg_rating, 0) AS rating
          FROM product p
          INNER JOIN category c
              ON p.category = c.id
          LEFT JOIN (
              SELECT product_id, COALESCE(AVG(rating), 0) AS avg_rating
              FROM review
              GROUP BY product_id
          ) rating
              ON p.id = rating.product_id`;
  }

  const data = await get(req, "product", userQuery);
  res.status(200).json(data);
});

// create product
exports.createProduct = asyncHandler(async (req, res, next) => {
  makeProductCoverImagePath(req);
  makeProductImagesPath(req);
  await create(req, "product");
  saveProductCoverImage(req);
  saveProductaImages(req);
  res.status(200).json({
    message: "created",
  });
});

// delete product
exports.deleteProduct = asyncHandler(async (req, res, next) => {
  const product = await getOne(req, "product");
  if (product[0].cover_image) {
    deleteImageBypath("products", product[0].cover_image);
  }
  if (product[0].images) {
    deleteMultipleImagesByPath("products", product[0].images.split(","));
  }
  await deleteOne(req, "product");
  res.status(200).json({
    message: "deleted",
  });
});

// update product
exports.updateProduct = asyncHandler(async (req, res) => {
  makeProductCoverImagePath(req);
  if (req.body.cover_image) {
    const product = await getOne(req, "product");
    if (product[0].cover_image != null) {
      deleteImageBypath("products", product[0].cover_image);
    }
  }
  await update(req, "product");
  saveProductCoverImage(req);
  res.status(200).json({ message: "updated" });
});

// delete spcifc image product
exports.deleteProductImage = asyncHandler(async (req, res, next) => {
  const imageIndex = parseInt(req.query.image) || 0; //0
  const product = await getOne(req, "product");
  const imageList = product[0].images.split(",");
  deleteImageBypath("products", imageList[imageIndex]);
  imageList.splice(imageIndex, 1);
  req.body.images = imageList.join(",");
  await update(req, "product");
  res.status(200).json({
    message: "deleted",
  });
});

// add image
exports.AddProductImage = asyncHandler(async (req, res, next) => {
  if (req.file) {
    makeImagePath(req, "products");
    const product = await getOne(req, "product");
    const imageList = product[0].images.split(",");
    imageList.push(req.body.image);
    const images = imageList.join(",");
    await update(req, "product", { images });
    saveImage(req, "products");
    return res.status(200).json({
      message: "updated",
    });
  }
  return res.status(200).json({
    message: "please inter an image",
  });
});

// update image
exports.updateProductImage = asyncHandler(async (req, res, next) => {
  if (req.file) {
    const imageIndex = parseInt(req.query.imageIndex) || 0;
    makeImagePath(req, "products");
    const product = await getOne(req, "product");
    const imageList = product[0].images.split(",");
    const oldImage = imageList[imageIndex];
    imageList[imageIndex] = req.body.image;
    const images = imageList.join(",");
    await update(req, "product", { images });
    deleteImageBypath("products", oldImage);
    saveImage(req, "products");
    return res.status(200).json({
      message: "updated",
    });
  }
  return res.status(200).json({
    message: "please inter an image",
  });
});
