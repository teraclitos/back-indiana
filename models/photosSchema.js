const mongoose = require('mongoose')
const mongoosePagination = require('mongoose-paginate-v2')

const PhotosSchema = new mongoose.Schema({
  artistName: { type: String, trim: true, required: true },
  scientificName: { type: String, trim: true, required: true },
  items: [{
    price: { type: Number, required: true },
    size: {
      width: { type: Number, required: true },
      height: { type: Number, required: true }
    }

  }],
  photos_URL: [{
    url: { type: String, required: true },
    original_name: { type: String, trim: true, required: true },
    order: { type: Number, required: true },
    public_id: { type: String, trim: true, required: true }
  }],
  description: { type: String, trim: true, required: true },
  stock: { type: Number, required: true, default: Infinity }, // General stock property for the entire photo
  date: { type: Date, default: Date.now }
})

PhotosSchema.plugin(mongoosePagination)
const PhotosModel = mongoose.model('photos', PhotosSchema)
module.exports = PhotosModel
