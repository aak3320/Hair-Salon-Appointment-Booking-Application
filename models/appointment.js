const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema({
  fullName: String,
  email: String,
  appointmentDate: String,
  appointmentTime: String,
  notes: String,
  status: {
    type: String,
    default: "Pending"
  }
}, {
  timestamps: true
});

module.exports = mongoose.model("Appointment", appointmentSchema);