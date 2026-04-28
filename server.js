var express = require("express");
const path = require('path');
const mongoose = require('mongoose');

var app = express();
var port = process.env.PORT || 3000;

require('dotenv').config();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// 静态文件
app.use(express.static(path.join(__dirname, 'public')));

// 数据库
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch((err) => console.log('MongoDB connection error:', err));

// 首页
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});