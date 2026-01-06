const express = require("express");
const { register, login, getToken, upload,updateProfileImage,updateProfileInfo ,getAllUser,deleteUser} = require("../Controllers/authController");
const { protect, forgotPassword,otpVerif,resetPassword} = require("../middleware/authMiddleware");
console.log({ register, login, getToken });
const router = express.Router();

//  Route d'enregistrement avec upload de l'image
router.post("/register", upload.single("image"), register);

//  Route de connexion
router.post("/login", login);

//  Route protégée pour valider un token
router.get("/validate", protect, getToken);

router.put("/updateProfileImage/:id",upload.single("image"), updateProfileImage);

router.put("/updateProfileInfo/:id", updateProfileInfo);
router.post("/forgotPassword", forgotPassword);
router.post("/otpVerif/", otpVerif);
router.put("/resetPassword/", resetPassword);
router.get("/getAllUser/", getAllUser);
router.delete("/deleteUser/:id", deleteUser );

module.exports = router;
