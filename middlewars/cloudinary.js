const cloudinary = require('cloudinary')

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_KEY,
  api_secret: process.env.CLOUD_SECRET
})
const newArrayPhotosCloudinaryFunction = async (files) => {
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

  return await Promise.all(arrayFilesPromises)
}

module.exports = { newArrayPhotosCloudinaryFunction }
