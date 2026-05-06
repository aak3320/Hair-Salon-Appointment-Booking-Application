const mongoose = require("mongoose");

const salonSchema = new mongoose.Schema({
  name: String,
  suburb: String,
  address: String,
  services: [String],
  prices: [Number],
  photos: [String],
  ratings: Number,
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }
});

module.exports = mongoose.model("Salon", salonSchema);