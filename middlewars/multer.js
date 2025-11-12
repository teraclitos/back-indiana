const multer = require('multer')

const fileFilter = (req, file, cb) => {
  const allowed = /image\/(jpeg|jpg|png|webp)/
  allowed.test(file.mimetype) ? cb(null, true) : cb(new Error('Incorrect format of the image'))
}

const limits = { files: 30, fileSize: 10 * 1024 * 1024 } // 10MB c/u

const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter,
  limits
})

const uploadOneImage = upload.single('image')
const uploadExtraPhotos = upload.array('extraPhotos')
const uploadCarPhotos = upload.fields([
  { name: 'fotoPrincipal', maxCount: 1 },
  { name: 'fotoHover', maxCount: 1 },
  { name: 'fotosExtra' } // múltiples
])

const errFormatImages = 'Incorrect format of the image'
const handleMulterErrors = (err, req, res, next) => {
  if (err instanceof multer.MulterError || err.message === errFormatImages) {
    return res.status(400).json({ error: true, msg: err.message })
  }
  if (err) return res.status(500).json({ error: true, msg: err.message })
  next()
}

module.exports = { uploadOneImage, uploadExtraPhotos, uploadCarPhotos, handleMulterErrors }
