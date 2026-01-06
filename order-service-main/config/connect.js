const mongoose = require("mongoose");

// Utilise le nom du service de base de données dans le réseau Docker
mongoose
  .connect("mongodb://root:rootpassword@order-db:27017/T&O?authSource=admin")
  //  .connect("mongodb://127.0.0.1:27017/T&O")
  .then(() => {
    console.log("Connected to order-db");
  })
  .catch((err) => {
    console.log("Database connection error:", err);
  });

module.exports = mongoose;
