const mongoose = require("mongoose");

const personalSchema = new mongoose.Schema({
  profile_name: {
    type: String,
    required: true,

    trim: true,
  },
  web_logo: {
    type: String,
    require: true,
  },

  profile_img: {
    type: String,
    require: true,
  },

  profile_description: {
    type: String,
    require: true,
  },
});

const userModel = mongoose.model("personal", personalSchema);
module.exports = userModel;
