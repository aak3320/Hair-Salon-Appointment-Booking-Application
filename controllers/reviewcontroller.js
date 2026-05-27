const Review = require("../models/Review");
const Appointment = require("../models/Appointment");

exports.createReview = async (req, res) => {
  try {
    const {
      appointmentId,
      salonName,
      rating,
      comment
    } = req.body;

    const appointment = await Appointment.findById(appointmentId);

    if (!appointment) {
      return res.status(404).json({
        message: "Appointment not found"
      });
    }

    if (appointment.status !== "Completed") {
      return res.status(400).json({
        message: "Review allowed only after completed appointment"
      });
    }

    const review = new Review({
      user: req.user.id,
      appointment: appointmentId,
      salonName,
      rating,
      comment
    });

    await review.save();

    const reviews = await Review.find({ salonName });

    const averageRating =
      reviews.reduce((total, item) => total + item.rating, 0) / reviews.length;

    res.status(201).json({
      message: "Review added successfully",
      averageRating,
      review
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

exports.getReviewsBySalon = async (req, res) => {
  try {
    const salonName = req.query.salonName;

    const reviews = await Review.find({ salonName: salonName })
      .sort({ createdAt: -1 });

    res.json(reviews);

  } catch (error) {
    res.status(500).json({
      message: "Unable to fetch reviews",
      error: error.message
    });
  }
};