const PhotosModel = require("../models/photosSchema");
// const { validationResult } = require("express-validator");
const fs = require(`fs-extra`);
const cloudinary = require("../middlewars/cloudinary");

exports.createPhoto = async (req, res, next) => {
  const { artist_name, scientific_name, prices_sizes, description } = req.body;
  const files = req.files;
  const arrayOfPhotos = [];

  try {
    await files.forEach((file) => {
      cloudinary.v2.uploader
        .upload(file.path, {
          folder: `photo-bioteil`,
          transformation: {
            width: 700,
            height: 700,
            crop: "fill",
            fetch_format: "auto",
            quality: "auto",
            gravity: "auto",
          },
        })
        .then((result) => {
          let fileArrayLength =
            file.originalname.split(".")[0].split("-").length - 1;
          arrayOfPhotos.push({
            url: result.secure_url,
            original_name: file.originalname.split(".")[0],
            order: parseInt(
              file.originalname.split(".")[0].split("-")[fileArrayLength]
            ),
            public_id: result.public_id,
          });

          fs.unlink(file.path);
        })

        .then(() => {
          if (arrayOfPhotos.length === files.length) {
            arrayOfPhotos.sort((a, b) => a.order - b.order);
          }
        })
        .then(async () => {
          if (arrayOfPhotos.length === files.length) {
            const newPhoto = new PhotosModel({
              artist_name,
              scientific_name,
              prices_sizes,
              description,
              photos_URL: arrayOfPhotos,
            });
            await newPhoto.save();
            res.status(201).json({ msg: "Photo created correctly" });
          }
        });
    });
  } catch (error) {
    res.status(500).json({ msg: error });
  }
};
