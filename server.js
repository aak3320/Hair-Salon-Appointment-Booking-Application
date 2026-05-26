var express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

var PORT = process.env.PORT || 3000;
var app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.log("MongoDB connection error:", err.message));

// Appointment Routes
const appointmentRoutes = require("./routes/appointmentRoutes");
app.use("/appointments", appointmentRoutes);

// Auth Routes
const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);

// Salon Routes
const salonRoutes = require("./routes/salonroutes");
app.use("/salons", salonRoutes);
app.use("/api/salons", salonRoutes);

app.get("/", (req, res) => {
  res.send("Hair Salon Booking App is running!");
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});