const cloudinary = require('cloudinary')

const photoEdition = {
  folder: 'photo-bioteil',
  transformation: {
    // width: 700,
    // height: 700,
    crop: 'fill',
    fetch_format: 'auto',
    quality: 100,
    gravity: 'auto'
  }
}

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_KEY,
  api_secret: process.env.CLOUD_SECRET
})
const newArrayPhotosCloudinaryFunction = async (files) => {
  const arrayFilesPromises = files.map((file) => {
    return cloudinary.v2.uploader
      .upload(file.path, photoEdition)
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

const singleFilePromise = async (file) => {
  return cloudinary.v2.uploader
    .upload(file.path, photoEdition)
    .then((result) => {
      return {
        url: result.secure_url,
        public_id: result.public_id
      }
    })
}
const deleteFilesFromCloudinary = async (arrayOfFilesToBeDeletedPromises) => { arrayOfFilesToBeDeletedPromises.map(photo => cloudinary.v2.uploader.destroy(photo.public_id)); await Promise.all(arrayOfFilesToBeDeletedPromises) }
module.exports = { newArrayPhotosCloudinaryFunction, cloudinary, singleFilePromise, deleteFilesFromCloudinary }
