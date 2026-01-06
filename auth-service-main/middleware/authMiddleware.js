const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const ApiError = require("../utils/apiError");
const User = require("../Models/user");
const {OTP} =require ("../utils/OTP")
const sendEmail = require('../utils/Email');
const bcrypt = require("bcryptjs")
require("dotenv").config();

exports.protect = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization) {
    token = req.headers.authorization;

    if (token.startsWith("Bearer ")) {
      token = token.split(" ")[1];
    }
  }

  console.log("Middleware - Extracted Token:", token);

  if (!token) {
    return res.status(401).json({
      status: "error",
      message: "Vous n'êtes pas connecté. Veuillez vous connecter pour accéder à cette ressource.",
    });
  }

  try {
    console.log("🔑 JWT Secret Key:", process.env.JWT_SECRET_KEY);
    console.log("🔹 Token à vérifier:", token);
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const currentUser = await User.findById(decoded._id);

    if (!currentUser) {
      return res.status(401).json({ status: "error", message: "L'utilisateur appartenant à ce token n'existe plus." });
    }

    if (currentUser.passwordChangedAt) {
      const passChangedTimestamp = parseInt(currentUser.passwordChangedAt.getTime() / 1000, 10);
      if (passChangedTimestamp > decoded.iat) {
        return res.status(401).json({ status: "error", message: "L'utilisateur a récemment modifié son mot de passe. Veuillez vous reconnecter." });
      }
    }

    req.user = { _id: currentUser._id, role: currentUser.role, email: currentUser.Email };
    res.set('X-Auth-User', currentUser._id.toString());
    res.set('X-Auth-Role', currentUser.role);

    next();
  } catch (error) {
    return res.status(401).json({ status: "error", message: "Token invalide ou expiré. Veuillez vous reconnecter." });
  }
});

  exports.authorization = asyncHandler(async (req, res, next) => {
    if (req.user.role !== 'admin') {
        return next(new ApiError(403, 'You are not authorized'));
    }
    next();
});

exports.forgotPassword = asyncHandler(async (req, res, next) => {
  // 1) Get user by email
  
  const user = await User.findOne({ Email: req.body.Email });
  console.log(user)
  if (!user) {
    return next(
      new ApiError(
        `Il n'y a aucun utilisateur avec cette adresse e-mail: ${req.body.Email}`,
        404
      )
    );
  }
  // 2) If user exists, Generate hash token and save it in db
  const otp = OTP();
  // Save hashed password reset token into db
  user.OTP = otp;
  // Add expiration time for password reset Token (5 min)
  user.OTPExpires = Date.now() + 5 * 60 * 1000;

  await user.save();

  // 3) Send the reset code via email
  const message = `<!DOCTYPE html>
              <html lang="fr">
              <head>
                  <meta charset="UTF-8">
                  <meta name="viewport" content="width=device-width, initial-scale=1.0">
                  <title>Réinitialisation de mot de passe</title>
                  <style>
                      body {
                          font-family: 'Helvetica Neue', Arial, sans-serif;
                          line-height: 1.6;
                          color: #333333;
                          margin: 0;
                          padding: 0;
                          background-color: #f7f7f7;
                      }
                      .email-container {
                          max-width: 600px;
                          margin: 0 auto;
                          background-color: #ffffff;
                          border-radius: 8px;
                          overflow: hidden;
                          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
                      }
                      .email-header {
                          background: linear-gradient(to right, #ff6b8b, #5e72e4);
                          padding: 30px;
                          text-align: center;
                      }
                      .email-header h1 {
                          color: white;
                          margin: 0;
                          font-size: 24px;
                          font-weight: 600;
                      }
                      .email-body {
                          padding: 30px;
                          background-color: #ffffff;
                      }
                      .greeting {
                          font-size: 20px;
                          font-weight: 600;
                          color: #333333;
                          margin-bottom: 20px;
                      }
                      .message {
                          font-size: 16px;
                          color: #555555;
                          margin-bottom: 25px;
                      }
                      .otp-container {
                          background-color: #f8f9fa;
                          border-radius: 8px;
                          padding: 20px;
                          text-align: center;
                          margin: 25px 0;
                          border: 1px solid #e9ecef;
                      }
                      .otp-code {
                          font-size: 32px;
                          font-weight: 700;
                          letter-spacing: 5px;
                          color: #5e72e4;
                          margin: 10px 0;
                      }
                      .expiry-notice {
                          font-size: 14px;
                          color: #dc3545;
                          margin-top: 10px;
                          font-weight: 500;
                      }
                      .email-footer {
                          padding: 20px 30px;
                          text-align: center;
                          background-color: #f8f9fa;
                          border-top: 1px solid #e9ecef;
                      }
                      .footer-text {
                          font-size: 14px;
                          color: #6c757d;
                      }
                      .company-name {
                          font-weight: 600;
                          color: #5e72e4;
                      }
                      @media only screen and (max-width: 600px) {
                          .email-container {
                              width: 100%;
                              border-radius: 0;
                          }
                          .email-header, .email-body, .email-footer {
                              padding: 20px;
                          }
                      }
                  </style>
              </head>
              <body>
                  <div class="email-container">
                      <div class="email-header">
                          <h1>Réinitialisation de Mot de Passe</h1>
                      </div>
                      <div class="email-body">
                          <div class="greeting">
                              Bonjour ${user.Email},
                          </div>
                          <div class="message">
                              Nous avons reçu une demande de réinitialisation du mot de passe de votre compte du tableau de bord d'administration. Veuillez utiliser le code ci-dessous pour réinitialiser votre mot de passe.
                          </div>
                          <div class="otp-container">
                              <div>Votre code de vérification :</div>
                              <div class="otp-code">${otp}</div>
                              <div class="expiry-notice">Ce code n'est valide que pendant 5 minutes.</div>
                          </div>
                          <div class="message">
                              Si vous n'avez pas demandé cette réinitialisation, veuillez ignorer cet e-mail ou contacter notre équipe de support si vous avez des préoccupations.
                          </div>
                          <div class="message">
                              Merci de nous aider à sécuriser votre compte.
                          </div>
                      </div>
                      <div class="email-footer">
                          <div class="footer-text">
                              © 2024 <span class="company-name">Votre Entreprise</span>. Tous droits réservés.
                          </div>
                      </div>
                  </div>
              </body>
              </html>`;
  try {
    await sendEmail({
      email: user.Email,
      subject: "Votre code de réinitialisation de mot de passe (valable 5 min)",
      message,
    });
    const Email = req.body.Email;
    res.status(200).json({
      data: Email,
      message:
        "Lien de réinitialisation du mot de passe envoyé à votre adresse e-mail",
    });
  } catch (err) {
    user.OTP = undefined;
    user.OTPExpires = undefined;

    await user.save();
    return next(
      new ApiError("Il y a une erreur lors de l'envoi de l'e-mail", 500)
    );
  }
});

// @desc    Reset password
// @route   POST /user/resetPassword/:token
// @access  Public

exports.otpVerif = asyncHandler(async (req, res, next) => {
  // 1) Get user based on reset token
  const user = await User.findOne({

    OTP: req.body.OTP,
    OTPExpires: { $gt: Date.now() },
  });
  
  if (!user) {
    return next(new ApiError("Le jeton n'est pas valide ou a expiré", 400));
  }

   console.log(user._id)
  res.status(200).json({ data: user._id });
});

// @desc    Reset password
// @route   POST /user/resetPassword/:token
// @access  Public
exports.resetPassword = asyncHandler(async (req, res, next) => {
  Email = req.body.Email;
  const user = await User.findOne({ Email });

  if (!user) {
    return next(new ApiError("Il n'y a aucun utilisateur avec cette adresse e-mail: "+Email, 400));
  }
  // 2) hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.Password, salt);

  user.Password = hashedPassword;
  user.passwordChangedAt = Date.now();
  user.OTP = undefined;
  user.OTPExpires = undefined;

  await user.save();

  // req.OTPiD = undefined;
  res
    .status(200)
    .json({ message: "Votre mot de passe a été réinitialisé avec succès" });
});