var express = require("express");


var app = express();
var port = process.env.PORT || 3000;

require("dotenv").config();

app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("MongoDB connected successfully");
  })
  .catch((err) => console.log("MongoDB connection error:", err));

app.use("/salons", salonRoutes);


});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);

