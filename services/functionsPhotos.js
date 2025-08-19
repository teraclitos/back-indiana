const fs = require('fs-extra')
const deleteFiles = (files) => {
  for (const file of files) {
    fs.unlink(file.path)
  }
}


module.exports = { deleteFiles}
