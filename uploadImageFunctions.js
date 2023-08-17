const sharp = require("sharp");
const { v4: uuidv4 } = require("uuid");
const fs = require("fs");
const path = require("path");
const asyncHandler = require("express-async-handler");
const uploadFunctions = require("./uploadImageFunctions.js");

exports.makeImagePath = (req, folder) => {
  if (req.file) {
    const filename = `${folder}-${uuidv4()}-${Date.now()}.jpeg`;
    req.body.image = filename;
  }
};

exports.saveImage = asyncHandler(async (req, filename) => {
  if (req.body.image) {
    await sharp(req.file.buffer)
      .resize(600, 600)
      .toFormat("jpeg")
      .jpeg({ quality: 95 })
      .toFile(`uploads/${filename}/${req.body.image}`);
  }
});

exports.deleteImageBypath = (fielNmae, imageName) => {
  const imagePath = path.join(__dirname, "uploads", fielNmae, imageName);

  fs.unlink(imagePath, (err) => {
    if (err) {
      console.error("Error deleting image:", err);
    } else {
      console.log("Image deleted successfully");
    }
  });
};

exports.deleteMultipleImagesByPath = (filename, images) => {
  images.map((img) => {
    uploadFunctions.deleteImageBypath(filename, img);
  });
};
