const Salon = require("../models/Salon");

exports.getFeaturedSalons = async (req, res) => {
  try {
    const salons = await Salon.find()
      .sort({ ratings: -1 })
      .limit(5);

    res.json(salons);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};