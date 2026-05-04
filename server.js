var express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const salonRoutes = require("./routes/salonRoutes");

var app = express();
var port = process.env.PORT || 3000;

require("dotenv").config();

app.use(express.json());
app.use(express.static(__dirname + "/public"));
app.use(express.urlencoded({ extended: false }));

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("MongoDB connected successfully");
  })
  .catch((err) => console.log("MongoDB connection error:", err));

app.use("/salons", salonRoutes);

app.get("/", (req, res) => {
  res.send("Hair Salon Booking App is running!");
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});5