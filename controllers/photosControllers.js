const PhotosModel = require('../models/photosSchema')
const { cloudinary } = require('../middlewars/cloudinary')
const { deleteFiles, filesToCloudinaryOrder, checkOrderOfPhotos } = require('../services/functionsPhotos')
// const { validationResult } = require("express-validator");

exports.createPhoto = async (req, res) => {
  const { artistName, scientificName, pricesSizes, description } = req.body
  const files = req.files
  const orderPhotos = await filesToCloudinaryOrder(files)
  const checkOrder = checkOrderOfPhotos(orderPhotos)

  if (!checkOrder) {
    deleteFiles(files)
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
      photos_URL: orderPhotos
    })
    await newPhoto.save()
    res.status(201).json({ error: null, msg: 'Photo created correctly' })
  } catch (error) {
    res.status(500).json({ error: true, msg: error.message })
  } finally {
    deleteFiles(files)
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
    res.status(200).json({ error: null, getOnePhoto })
  } catch (error) {
    res.status(500).json({ error: true, msg: error.message })
  }
}
exports.updatePhoto = async (req, res) => {
  const { artistName, scientificName, pricesSizes, description } = req.body
  const files = req.files
  const orderPhotos = await filesToCloudinaryOrder(files)
  const checkOrder = checkOrderOfPhotos(orderPhotos)
  if (!checkOrder) {
    deleteFiles(files)
    return res
      .status(400)
      .json({ error: true, msg: 'The order of the photos is incorrect' })
  }
  try {
    const photosMongoToUpdate = await PhotosModel.findById({
      _id: req.params.id
    })
    if (!photosMongoToUpdate) {
      return res.status(404).json({ error: true, msg: 'photos not found' })
    }
    const deletePhotosPublicIdCloudinaryPromises = photosMongoToUpdate.photos_URL.map(photo => cloudinary.v2.uploader.destroy(photo.public_id))
    await PhotosModel.findByIdAndUpdate({ _id: req.params.id },
      {
        artistName,
        scientificName,
        pricesSizes,
        description,
        photos_URL: orderPhotos

      },
      { new: true })

    await Promise.all(deletePhotosPublicIdCloudinaryPromises)
    res.status(200).json({ error: null, msg: 'photos updated' })
  } catch (error) {
    res.status(500).json({ error: true, msg: error.message })
  } finally {
    deleteFiles(files)
  }
}
exports.deleteOnePhoto = async (req, res) => {
  try {
    const photosMongoDeleted = await PhotosModel.findByIdAndDelete({
      _id: req.params.id
    })
    if (!photosMongoDeleted) {
      return res.status(404).json({ error: true, msg: 'photos not found' })
    }
    const deletePhotosPublicIdCloudinaryPromises = photosMongoDeleted.photos_URL.map(photo => cloudinary.v2.uploader.destroy(photo.public_id))
    await Promise.all(deletePhotosPublicIdCloudinaryPromises)

    res.status(200).json({ error: null, msg: 'photos deleted' })
  } catch (error) {
    res.status(500).json({ msg: error.message })
  }
}
