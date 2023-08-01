const mongoose = require('mongoose')

const PersonalSchema = new mongoose.Schema({
  profileName: {
    type: String,
    required: true,

    trim: true
  },

  profile_IMG: {
    type: Object,
    require: true
  },

  profileDescription: {
    type: String,
    require: true
  }
})

const PersonalModel = mongoose.model('personal', PersonalSchema)
module.exports = PersonalModel
