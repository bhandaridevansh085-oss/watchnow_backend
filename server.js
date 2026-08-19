const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const favoriteRoutes = require("./routes/favoriteRoutes");

dotenv.config();

const app = express();


// MongoDB

connectDB();


// Middleware

app.use(cors());

app.use(express.json());


// Routes

app.use(
  "/api/auth",
  authRoutes
);

app.use(
  "/api/favorites",
  favoriteRoutes
);


// Test route

app.get("/", (req, res) => {

  res.json({
    message: "WatchNow Backend Running 🚀"
  });

});


// Server

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {

  console.log(
    `Server running on port ${PORT}`
  );

});