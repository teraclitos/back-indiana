const fs = require('fs-extra')
const { newArrayPhotosCloudinaryFunction } = require('../middlewars/cloudinary')
const deleteFiles = (files) => {
  for (const file of files) {
    fs.unlink(file.path)
  }
}
const filesToCloudinaryOrder = async (files) => {
  const newArrayPhotosCloudinary = await newArrayPhotosCloudinaryFunction(files)

  return newArrayPhotosCloudinary.sort((a, b) => a.order - b.order)
}

const checkOrderOfPhotos = (isOrder) => {
  return isOrder.every((el, index) => el.order === index + 1)
}

module.exports = { deleteFiles, filesToCloudinaryOrder, checkOrderOfPhotos }
