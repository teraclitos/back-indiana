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
    fileFilter: (req, file, cb) => {
      const filetypes = '/jpeg|png|jpg/'
      console.log(file)

      const mimetypes = filetypes.test(file.mimetype.toLowerCase())
      const extname = filetypes.test(
        path.extname(file.originalname).toLowerCase()
      )
      if (mimetypes && extname) {
        return cb(null, true)
      } else {
        return ('error: incorrect format of the image ')
      }
    },
    destination: path.join(__dirname, folder),
    filename: (req, file, cb) => {
      cb(null, uuidv4() + path.extname(file.originalname))
    }
  })
  const uploadOneImage = multer({ storage }).single('image')
  const uploadArrayOfImages = multer({ storage }).array('images')

  return { uploadArrayOfImages, uploadOneImage }
}

module.exports = { uploadFile }
