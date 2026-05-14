var express = require("express");
const mongoose = require('mongoose');
require('dotenv').config();
var PORT = process.env.PORT || 3000;

var app = express();

// Middleware to parse JSON bodies (for POST requests)
app.use(express.json());

// Serve static files from the "public" folder
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));

app.use(express.json());

// Database Connection 
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch((err) => console.log('MongoDB connection error:', err));

// Routes
const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
  res.send('Hair Salon Booking App is running!');
});

const salonRoutes = require('./routes/salonroutes');
app.use("/api/salons", salonRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});