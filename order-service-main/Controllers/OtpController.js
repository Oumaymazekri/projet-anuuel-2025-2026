const { OTP } = require('../utils/OTP');
const sendEmail = require('../utils/Email');

// mémoire temporaire (à remplacer par une BDD ou Redis en prod)
const otpStore = {}; // { email: otp }

exports.sendOtp = async (req, res) => {
  try {
    const { Email } = req.body;
    const generatedOtp = OTP();

    // stocker l'OTP temporairement
    otpStore[Email] = generatedOtp;

    // construire le message
    const message = `
     <!DOCTYPE html>
    <html lang="fr">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Votre Code de Vérification</title>
      <style>
        /* Base styles */
        body {
          font-family: 'Helvetica Neue', Arial, sans-serif;
          line-height: 1.5;
          color: #374151;
          background-color: #f3f4f6;
          margin: 0;
          padding: 0;
        }
        
        /* Container */
        .container {
          max-width: 600px;
          margin: 0 auto;
          background-color: #ffffff;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
        }
        
        /* Header */
        .header {
          background-color: #3B82F6;
          padding: 24px;
          text-align: center;
        }
        
        .logo {
          margin-bottom: 12px;
        }
        
        .header-title {
          color: #ffffff;
          font-size: 24px;
          margin: 0;
          font-weight: 600;
        }
        
        /* Content */
        .content {
          padding: 32px 24px;
          background-color: #ffffff;
        }
        
        .greeting {
          font-size: 18px;
          font-weight: 600;
          margin-top: 0;
          margin-bottom: 16px;
        }
        
        .message {
          font-size: 16px;
          margin-bottom: 24px;
        }
        
        /* OTP Box */
        .otp-container {
          background-color: #f9fafb;
          border: 1px solid #e5e7eb;
          border-radius: 6px;
          padding: 24px;
          text-align: center;
          margin-bottom: 24px;
        }
        
        .otp-label {
          font-size: 14px;
          color: #6b7280;
          margin-bottom: 8px;
        }
        
        .otp-code {
          font-size: 36px;
          font-weight: 700;
          letter-spacing: 4px;
          color: #1e40af;
          margin: 0;
        }
        
        /* Instructions */
        .instructions {
          font-size: 14px;
          color: #6b7280;
          margin-bottom: 24px;
        }
        
        /* Footer */
        .footer {
          background-color: #f9fafb;
          padding: 16px 24px;
          text-align: center;
          border-top: 1px solid #e5e7eb;
        }
        
        .footer-text {
          font-size: 12px;
          color: #6b7280;
          margin: 0;
        }
        
        /* Responsive */
        @media screen and (max-width: 600px) {
          .container {
            width: 100%;
            border-radius: 0;
          }
          
          .header, .content {
            padding: 16px;
          }
          
          .otp-container {
            padding: 16px;
          }
          
          .otp-code {
            font-size: 32px;
          }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">
            <!-- Logo placeholder - replace with actual company logo -->
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2">
              <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
              <line x1="9" y1="3" x2="9" y2="21" />
            </svg>
          </div>
          <h1 class="header-title">Vérification de votre compte</h1>
        </div>
        
        <div class="content">
          <p class="greeting">Bonjour,</p>
          <p class="message">Nous avons besoin de vérifier votre adresse e-mail. Veuillez utiliser le code de vérification ci-dessous pour compléter le processus.</p>
          
          <div class="otp-container">
            <div class="otp-label">Votre code de vérification</div>
            <div class="otp-code">${generatedOtp}</div>
          </div>
          
          <p class="instructions">Ce code expirera dans 10 minutes. Si vous n'avez pas demandé ce code, vous pouvez ignorer cet e-mail en toute sécurité.</p>
          
          <p class="message">Cordialement,<br>L'équipe de support</p>
        </div>
        
        <div class="footer">
          <p class="footer-text">Cet e-mail a été envoyé automatiquement, merci de ne pas y répondre.</p>
          <p class="footer-text">© 2025 Votre Entreprise. Tous droits réservés.</p>
        </div>
      </div>
    </body>
    </html>
  
    `;

    await sendEmail({
      Email,
      subject: 'Votre Code OTP',
      message
    });

    res.status(200).json({ success: true, message: "OTP envoyé à " + Email });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Erreur d'envoi OTP" });
  }
};

exports.verifyOtp = (req, res) => {
    console.log("Requête reçue pour /verifyOtp :", req.body);
    const { Email, otp } = req.body;
  
    if (!Email || !otp) {
      return res.status(200).json(false);
    }
  
    const storedOtp = otpStore[Email];
  
    if (storedOtp && storedOtp === otp) {
      delete otpStore[Email]; // Supprimer l'OTP une fois utilisé
      return res.status(200).json(true);
    }
  
    return res.status(200).json(false);
  };
  
  
