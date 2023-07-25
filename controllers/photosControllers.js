const PhotosModel = require('../models/photosSchema')
// const { validationResult } = require("express-validator");
const fs = require('fs-extra')
const { newArrayPhotosCloudinaryFunction } = require('../middlewars/cloudinary')

exports.createPhoto = async (req, res) => {
  const { artistName, scientificName, pricesSizes, description } = req.body
  const files = req.files

  const deleteFiles = () => {
    for (const file of files) {
      fs.unlink(file.path)
    }
  }

  const newArrayPhotosCloudinary = await newArrayPhotosCloudinaryFunction(files)

  const newArrayPhotosCloudinarySort = newArrayPhotosCloudinary.sort((a, b) => a.order - b.order)

  const orderPhotos = newArrayPhotosCloudinarySort.every((el, index) => el.order === index + 1)

  if (!orderPhotos) {
    deleteFiles()
    return res
      .status(400)
      .json({ error: true, msg: 'The order of the photos is incorrect' })
  }

  try {
    const newPhoto = new PhotosModel({
      artistName,
      scientificName,
      pricesSizes,
      description,
      photos_URL: newArrayPhotosCloudinarySort
    })
    await newPhoto.save()
    res.status(201).json({ error: null, msg: 'Photo created correctly' })
  } catch (error) {
    res.status(500).json({ error: true, msg: error.message })
  } finally {
    deleteFiles()
  }
}
exports.getAllPhotos = async (req, res) => {
  const { page, limit } = req.query
  const parsedPage = parseInt(page) || 1
  const parsedLimit = parseInt(limit) || 8
  try {
    const allPhotos = await PhotosModel.paginate({}, { page: parsedPage, limit: parsedLimit })

    res.status(200).json({ error: null, allPhotos })
  } catch (error) {
    res.status(500).json({ error: true, msg: error.message })
  }
}
exports.getOnePhoto = async (req, res) => {
  try {
    const getOnePhoto = await PhotosModel.findOne({ _id: req.params.id.trim() })
    res.status(200).json(getOnePhoto)
  } catch (error) {
    res.status(500).json({ msg: error.message })
  }
}
