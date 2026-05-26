const Appointment = require("../models/Appointment");
const sendBookingEmail = require("../utils/sendEmail");

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

    try {
      await sendBookingEmail(
        appointment.email,
        appointment.fullName,
        appointment.appointmentDate,
        appointment.appointmentTime
      );
    } catch (emailError) {
      console.log('Email failed but booking saved:', emailError.message);
    }

    res.status(201).json({
      message: "Appointment booked successfully. Confirmation email sent.",
      appointment: appointment
    });

  } catch (error) {
    res.status(500).json({
      message: "Booking failed",
      error: error.message
    });
  }
};

exports.cancelAppointment = async (req, res) => {
  try {
    const appointmentId = req.params.id;

    const appointment = await Appointment.findByIdAndUpdate(
      appointmentId,
      { status: "Cancelled" },
      { new: true }
    );

    if (!appointment) {
      return res.status(404).json({
        message: "Appointment not found"
      });
    }

    res.json({
      message: "Appointment cancelled successfully",
      appointment: appointment
    });

  } catch (error) {
    res.status(500).json({
      message: "Unable to cancel appointment",
      error: error.message
    });
  }
};