var express = require("express")
const path = require('path');
const mongoose = require('mongoose');
var app = express();
var port = process.env.port || 3000;

require('dotenv').config();

// Middleware to parse JSON bodies (for POST requests)
app.use(express.json());

// Serve static files from the "public" folder
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: false }));

// Database connection
mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('MongoDB connected successfully');
  })
  .catch((err) => console.log('MongoDB connection error:', err));

// Routes
// Example route for the home page
app.get('/', (req, res) => {
  res.send('Hair Salon Booking App is running!');
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});