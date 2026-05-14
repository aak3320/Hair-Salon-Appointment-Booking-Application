const mongoose = require("mongoose");

const salonSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },

  suburb: {
    type: String
  },

  address: {
    type: String
  },

  services: {
    type: [String],
    default: []
  },

  prices: {
    type: [Number],
    default: []
  },

  photos: {
    type: [String],
    default: []
  },

  ratings: {
    type: Number,
    default: 0
  },

  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  location: {
    type: {
      type: String,
      enum: ["Point"],
      default: "Point"
    },
    coordinates: {
      type: [Number],
      default: [0, 0]
    }
  }
});

salonSchema.index({ location: "2dsphere" });

module.exports = mongoose.model("Salon", salonSchema);