const Appointment = require("../models/Appointment");

exports.createAppointment = async (req, res) => {
  try {
    const appointment = new Appointment({
      fullName: req.body.fullName,
      email: req.body.email,
      appointmentDate: req.body.appointmentDate,
      appointmentTime: req.body.appointmentTime,
      notes: req.body.notes
    });

    await appointment.save();

    res.status(201).json({
      message: "Appointment booked successfully",
      appointment: appointment
    });

  } catch (error) {
    res.status(500).json({
      message: "Booking failed",
      error: error.message
    });
  }
};