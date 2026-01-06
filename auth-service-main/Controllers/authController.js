const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const User = require("../Models/user");
const ApiError = require("../utils/apiError");
const bcrypt = require("bcryptjs")
const multer = require("multer");
const path = require("path");
const fs = require("fs");



// Configuration de Multer pour uploader les fichiers dans "uploads/"
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = "images/";
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath);
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Ex: 1654873928.jpg
  },
});

const upload = multer({ storage });

// Fonction d'enregistrement
exports.upload = upload; // pour l’utiliser dans app.js

exports.register = asyncHandler(async (req, res, next) => {
  try {
    const data = req.body;

    // Création de l'utilisateur sans mot de passe pour l'instant
    const newUser = new User(data);

    // Hachage du mot de passe
    const saltRounds = 10;
    const salt = bcrypt.genSaltSync(saltRounds);
    const cryptedPass = bcrypt.hashSync(data.Password, salt);
    newUser.Password = cryptedPass;

    // Si un fichier image est envoyé, l'ajouter
    if (req.file) {
      newUser.image = req.file.filename;
    }

    // Enregistrer dans la base
    await newUser.save();

    res.status(200).send(newUser);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Route pour la connexion
exports.login = asyncHandler(async (req, res, next) => {
  const data = req.body;
  const user = await User.findOne({ Email: data.Email });

  if (!user) {
    return next(new ApiError("Email ou mot de passe invalide !", 400));
  }

  const validPass = await bcrypt.compare(data.Password, user.Password);

  if (!validPass) {
    return next(new ApiError("Email ou mot de passe invalide !", 400));
  }

  const token = jwt.sign(
    { _id: user._id, role: user.role },
    process.env.JWT_SECRET_KEY,
    {
      expiresIn: process.env.JWT_EXPIRE_TIME,
    }
  );
  res.json({
    token,
    Email: user.Email,
    Full_Name: user.Full_Name,
    Phone_Number: user.Phone_Number,
    Adress: user.Adress,
    image: user.image,
    role:user.role
    
  });
  
});

exports.getToken = asyncHandler(async (req, res) => {
  // Set user info in response headers for Nginx
  res.set('X-Auth-User', req.user._id.toString());
  res.set('X-Auth-Role', req.user.role);
  
  res.status(200).json({
    status: 'success',
    message: 'Token valide',
    user: req.user
  });
});

exports.updateProfileImage = asyncHandler(async (req, res, next) => {
  const userId = req.params.id;

  if (!req.file) {
    console.log("req.file:", req.file);

    return next(new ApiError("Aucune image fournie", 400));
  }

  const user = await User.findById(userId);
  if (!user) {
    return next(new ApiError("Utilisateur introuvable", 404));
  }

  // Mise à jour de l'image
  user.image = req.file.filename;
  await user.save();

  res.status(200).json({
    message: "Image de profil mise à jour avec succès",
    image: user.image,
  });
});



exports.updateProfileInfo = asyncHandler(async (req, res, next) => {
  const userId = req.params.id;
  const data = req.body;

  const user = await User.findById(userId);
  if (!user) {
    return next(new ApiError("Utilisateur introuvable", 404));
  }

  // Mise à jour des champs
  if (data.Full_Name) user.Full_Name = data.Full_Name;
  if (data.Email) user.Email = data.Email;
  if (data.Phone_Number) user.Phone_Number = data.Phone_Number;
  if (data.Adress) user.Adress = data.Adress;

  await user.save();

  res.status(200).json({
    message: "Informations du profil mises à jour avec succès",
    user: {
      _id: user._id,
      Full_Name: user.Full_Name,
      Email: user.Email,
      Phone_Number: user.Phone_Number,
      Adress: user.Adress,
    },
  });
});


exports.getAllUser = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({
      message: "Erreur lors de la récupération des users",
      error: err.message
    });
  }
};

// Supprimer un utilisateur sans supprimer son image
exports.deleteUser = asyncHandler(async (req, res, next) => {
  const userId = req.params.id;

  const user = await User.findById(userId);
  if (!user) {
    return next(new ApiError("Utilisateur introuvable", 404));
  }

  await User.findByIdAndDelete(userId);

  res.status(200).json({
    message: "Utilisateur supprimé avec succès",
  });
});

