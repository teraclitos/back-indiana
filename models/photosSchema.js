const mongoose = require(`mongoose`);
const mongoosePagination = require("mongoose-paginate-v2");

const PhotosSchema = new mongoose.Schema({
  artist_name: { type: String, trim: true, requiere: true },
  scientific_name: { type: String, trim: true, requiere: true },
  prices_sizes: { type: Array, requiere: true },
  photos_URL: { type: Array, require: true },
  description: { type: String, trim: true, requiere: true },
  // highlight: { type: String, default: `NO` },
  date: { type: Date, default: Date.now() },
});

PhotosSchema.plugin(mongoosePagination);
const PhotosModel = mongoose.model("photos", PhotosSchema);
module.exports = PhotosModel;
