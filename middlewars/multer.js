const multer = require('multer')
const path = require('path')
const { v4: uuidv4 } = require('uuid')
let folder = ''

if (process.env.NODE_ENV === 'production') {
  folder = '../../../tmp'
} else {
  folder = '../tmp'
}

const uploadFile = () => {
  const storage = multer.diskStorage({

    destination: path.join(__dirname, folder),

    filename: (req, file, cb) => {
      cb(null, uuidv4() + path.extname(file.originalname))
    }
  })

  const fileFilter = (req, file, cb) => {
    const allowedExtensions = ['.jpeg', '.jpg', '.png']
    const extname = path.extname(file.originalname).toLowerCase()
    if (allowedExtensions.includes(extname)) {
      cb(null, true)
    } else {
      cb(new Error('Incorrect format of the image'))
    }
  }

  const limits = {
    files: 2
  }
  const uploadOneImage = multer({ storage, fileFilter }).single('image')
  const uploadArrayOfImages = multer({
    storage,
    fileFilter,
    limits
  }).array('images')
  return { uploadArrayOfImages, uploadOneImage }
}
const errFormatImages = 'Incorrect format of the image'
const handleMulterErrors = (err, req, res, next) => {
  if (err instanceof multer.MulterError || err.message === errFormatImages) {
    return res.status(400).json({ error: true, msg: err.message })
  } else if (err) {
    return res.status(500).json({ error: true, msg: err.message })
  }

  next()
}

module.exports = { uploadFile, handleMulterErrors }
