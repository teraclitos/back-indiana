const PhotosModel = require('../models/photosSchema')
const { deleteFilesFromCloudinary } = require('../middlewars/cloudinary')
const { deleteFiles, filesToCloudinaryOrder, checkOrderOfPhotos } = require('../services/functionsPhotos')
const { validationResult } = require('express-validator')

exports.createPhoto = async (req, res) => {
  const { artistName, scientificName, pricesSizes, description } = req.body
  const files = req.files
  if (files.length < 2) {
    deleteFiles(files)
    return res
      .status(400)
      .json({ error: true, msg: 'you must send at least 2 files' })
  }

  const errorFromExpressValidator = validationResult(req)
  if (!errorFromExpressValidator.isEmpty()) {
    deleteFiles(files)

    return res
      .status(400)
      .json({ error: true, msg: errorFromExpressValidator.array() })
  }
  const checkIfThePieceOfArtAlreadyExist = await PhotosModel.findOne({ artistName }, {}, { collation: { locale: 'en', strength: 1 } })

  if (checkIfThePieceOfArtAlreadyExist) {
    deleteFiles(files)
    return res
      .status(400)
      .json({ error: true, msg: 'this piece of art already exist' })
  }

  const orderPhotos = await filesToCloudinaryOrder(files)
  const checkOrder = checkOrderOfPhotos(orderPhotos)
  if (!checkOrder) {
    deleteFiles(files)
    await deleteFilesFromCloudinary(orderPhotos)
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
    await deleteFilesFromCloudinary(orderPhotos)
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
  if (files.length < 2) {
    deleteFiles(files)
    return res
      .status(400)
      .json({ error: true, msg: 'you must send at least 2 files' })
  }
  const errorFromExpressValidator = validationResult(req)
  if (!errorFromExpressValidator.isEmpty()) {
    deleteFiles(files)

    return res
      .status(400)
      .json({ error: true, msg: errorFromExpressValidator.array() })
  }

  const orderPhotos = await filesToCloudinaryOrder(files)
  const checkOrder = checkOrderOfPhotos(orderPhotos)
  if (!checkOrder) {
    await deleteFilesFromCloudinary(orderPhotos)
    deleteFiles(files)
    return res
      .status(400)
      .json({ error: true, msg: 'The order of the photos is incorrect' })
  }
  try {
    const oldPhotosMongoToUpdate = await PhotosModel.findById({
      _id: req.params.id
    })
    if (!oldPhotosMongoToUpdate) {
      return res.status(404).json({ error: true, msg: 'photos not found' })
    }
    const checkIfThePieceOfArtAlreadyExist = await PhotosModel.findOne({ artistName }, {}, { collation: { locale: 'en', strength: 1 } })
    if (artistName.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '') !== oldPhotosMongoToUpdate.artistName.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '') && checkIfThePieceOfArtAlreadyExist) {
      await deleteFilesFromCloudinary(orderPhotos)
      return res.status(400).json({ error: true, msg: 'this piece of art already exist' })
    }

    await PhotosModel.findByIdAndUpdate({ _id: req.params.id },
      {
        artistName,
        scientificName,
        pricesSizes,
        description,
        photos_URL: orderPhotos

      },
      { new: true })

    await deleteFilesFromCloudinary(oldPhotosMongoToUpdate.photos_URL)
    res.status(200).json({ error: null, msg: 'photos updated' })
  } catch (error) {
    await deleteFilesFromCloudinary(orderPhotos)
    res.status(500).json({ error: true, msg: error.message })
  } finally {
    deleteFiles(files)
  }
}
exports.deletePhoto = async (req, res) => {
  try {
    const photosMongoDeleted = await PhotosModel.findByIdAndDelete({
      _id: req.params.id
    })
    if (!photosMongoDeleted) {
      return res.status(404).json({ error: true, msg: 'photos not found' })
    }

    await deleteFilesFromCloudinary(photosMongoDeleted.photos_URL)

    res.status(200).json({ error: null, msg: 'photos deleted' })
  } catch (error) {
    res.status(500).json({ msg: error.message })
  }
}
