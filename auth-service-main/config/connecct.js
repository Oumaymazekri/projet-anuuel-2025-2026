const mongoose = require('mongoose');

mongoose
 .connect("mongodb://root:rootpassword@auth-db:27017/T&O?authSource=admin")

// .connect("mongodb://127.0.0.1:27017/T&O")
.then(() => {
  console.log("Connected to MongoDB successfully!");
})
.catch((err) => {
  console.error("MongoDB connection error:", err);
});
