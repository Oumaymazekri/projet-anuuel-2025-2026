const mongoose = require("mongoose");


const user = mongoose.model("user", {
  Email: {
    type: String,
  },

  Password: {
    type: String,
  },
  Full_Name:{
    type: String,
  },
  Phone_Number:{
    type :String
  },
  Adress:{
    type :String
  },
  image:{
    default: "profileImage.jpg",
    type:String
  },
  
  passwordChangedAt: Date,
  OTP: String,
  OTPExpires: Date,


  role: {
    type: String,
    enum: ["admin", "client"],
    default: "client",
  },
});
module.exports = user;
