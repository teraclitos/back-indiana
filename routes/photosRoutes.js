const router = require('express').Router()
const tokenValidation = require('../middlewars/auth')
const { validateEmptyFields } = require('../validations/validationPhotos')
const { createPhoto, getAllPhotos, getOnePhoto, deleteOnePhoto, updatePhoto } = require('../controllers/photosControllers')
const { uploadFile } = require('../middlewars/multer')
router.post(
  '/create',
  tokenValidation(process.env.SUPER_USER),
  uploadFile().uploadArrayOfImages,
  validateEmptyFields(),
  createPhoto)
router.get(
  '/getallphotos',
  getAllPhotos)
router.get(
  '/getonephoto/:id',
  getOnePhoto)
router.put(
  '/updatephoto/:id',
  tokenValidation(process.env.SUPER_USER),
  uploadFile().uploadArrayOfImages,
  validateEmptyFields(),
  updatePhoto)
router.delete(
  '/deleteonephoto/:id',
  tokenValidation(process.env.SUPER_USER),
  deleteOnePhoto)
module.exports = router
