const axios = require("axios");

exports.getAllSalons = async (req, res) => {
  try {
    const suburb = req.query.suburb || "Melbourne CBD";
    const minRating = parseFloat(req.query.rating) || 0;
    const price = req.query.price || "";

    const response = await axios.get("https://api.yelp.com/v3/businesses/search", {
      headers: {
        Authorization: `Bearer ${process.env.YELP_API_KEY}`
      },
      params: {
        term: "hair salon",
        location: `${suburb}, Melbourne, VIC, Australia`,
        limit: 20
      }
    });

    let salons = response.data.businesses.map((business) => ({
      name: business.name,
      suburb: suburb,
      address: business.location.display_address.join(", "),
      ratings: business.rating,
      reviewCount: business.review_count || 0,
      price: business.price || "N/A",
      photos: [business.image_url],
      url: business.url
    }));

    // Rating filter
    salons = salons.filter((salon) => salon.ratings >= minRating);

    // Price filter
    if (price !== "") {
      salons = salons.filter((salon) => salon.price === price);
    }

    res.json(salons);

  } catch (error) {
    console.log(error.response?.data || error.message);
    res.status(500).json({ message: "Unable to fetch filtered salons" });
  }
};

// Keep these if your routes are using them
exports.getFeaturedSalons = async (req, res) => {
  try {
    const suburb = req.query.suburb || "Melbourne CBD";

    const response = await axios.get("https://api.yelp.com/v3/businesses/search", {
      headers: {
        Authorization: `Bearer ${process.env.YELP_API_KEY}`
      },
      params: {
        term: "hair salon",
        location: `${suburb}, Melbourne, VIC, Australia`,
        limit: 5,
        sort_by: "rating"
      }
    });

    const salons = response.data.businesses.map((business) => ({
      name: business.name,
      suburb: suburb,
      address: business.location.display_address.join(", "),
      ratings: business.rating,
      price: business.price || "N/A",
      photos: [business.image_url],
      url: business.url
    }));

    res.json(salons);

  } catch (error) {
    res.status(500).json({ message: "Unable to fetch featured salons" });
  }
};

exports.getNearbySalons = async (req, res) => {
  try {
    res.json([]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};