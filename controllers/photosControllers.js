const PhotosModel = require('../models/photosSchema')
// const { validationResult } = require("express-validator");
const fs = require('fs-extra')
const cloudinary = require('../middlewars/cloudinary')

exports.createPhoto = async (req, res, next) => {
  const { artistName, scientificName, pricesSizes, description } = req.body
  const files = req.files
  const arrayFilesPromises = files.map((file) => {
    return cloudinary.v2.uploader
      .upload(file.path, {
        folder: 'photo-bioteil',
        transformation: {
          width: 700,
          height: 700,
          crop: 'fill',
          fetch_format: 'auto',
          quality: 'auto',
          gravity: 'auto'
        }
      })
      .then((result) => {
        const fileArrayLength =
            file.originalname.split('.')[0].split('-').length - 1
        return {
          url: result.secure_url,
          original_name: file.originalname.split('.')[0],
          order: parseInt(
            file.originalname.split('.')[0].split('-')[fileArrayLength]
          ),
          public_id: result.public_id
        }
      })
  })

  const arrayOfPhotos = await Promise.all(arrayFilesPromises)

  for (const file of files) {
    fs.unlink(file.path)
  }

  console.log(arrayOfPhotos)
  // try {

  //       .then(() => {
  //         if (arrayOfPhotos.length === files.length) {
  //           arrayOfPhotos.sort((a, b) => a.order - b.order)
  //         }
  //       })
  //       .then(async () => {
  //         if (
  //           arrayOfPhotos[0].order === 1 &&
  //           arrayOfPhotos[1].order === 2 &&
  //           arrayOfPhotos.length === files.length
  //         ) {
  //           const newPhoto = new PhotosModel({
  //             artistName,
  //             scientificName,
  //             pricesSizes,
  //             description,
  //             photos_URL: arrayOfPhotos
  //           })
  //           await newPhoto.save()
  //           res.status(201).json({ msg: 'Photo created correctly' })
  //         } else if (
  //           (arrayOfPhotos[0].order !== 1 || arrayOfPhotos[1].order !== 2) &&
  //           arrayOfPhotos.length === files.length
  //         ) {
  //           res
  //             .status(401)
  //             .json({ msg: 'The order of the photos is incorrect' })
  //         }
  //       })
  //   })
  // } catch (error) {
  //   res.status(500).json({ msg: error })
  // }
}
