import React, { useState } from "react";
import { X, CreditCard, Calendar, Lock } from 'lucide-react';
import { CartItem } from "../context/CartContext";
import CodeVerificationModal from "./CodeVerificaton";

interface PaymentDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  paymentMethod?: string;
  onConfirm: (info?: { email?: string; phone?: string }) => void;
  cartItems: CartItem[];
  deliveryDetails: {
    Adress: string;
    city: string;
    postalCode: string;
    phoneNumber: string;
    email: string;
  };
  totalPrice: number;
  deliveryMethod: "domicile" | "magasin"; // ✅ Ajouté ici
}


const PaymentDetailsModal: React.FC<PaymentDetailsModalProps> = ({
  isOpen,
  onClose,
  paymentMethod,
  onConfirm,
  cartItems,
  totalPrice,
  deliveryDetails,
  deliveryMethod
}) => {
  const [cardNumber, setCardNumber] = useState("");
  const [isVerificationModalOpen, setVerificationModalOpen] = useState(false);
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [name, setName] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState({
    Email: "",
    address: "",
    city: "",
    postalCode: "",
    phone: "",
  });

  if (!isOpen) return null;

  const formatCardNumber = (input: string) => {
    const numbers = input.replace(/\D/g, "");
    let formatted = "";
    
    for (let i = 0; i < numbers.length && i < 16; i += 4) {
      if (i > 0) formatted += " ";
      formatted += numbers.slice(i, Math.min(i + 4, numbers.length));
    }
    
    return formatted;
  };

  const formatExpiry = (input: string) => {
    const numbers = input.replace(/\D/g, "");
    
    if (numbers.length <= 2) {
      return numbers;
    }
    
    return `${numbers.slice(0, 2)}/${numbers.slice(2, 4)}`;
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value);
    setCardNumber(formatted);
    
    if (errors.cardNumber) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.cardNumber;
        return newErrors;
      });
    }
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatExpiry(e.target.value);
    setExpiry(formatted);
    
    if (errors.expiry) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.expiry;
        return newErrors;
      });
    }
  };

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 3);
    setCvv(value);
    
    if (errors.cvv) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.cvv;
        return newErrors;
      });
    }
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
    
    if (errors.name) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.name;
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    // Card number validation (16 digits without spaces)
    if (!cardNumber.trim()) {
      newErrors.cardNumber = "Le numéro de carte est requis";
    } else if (cardNumber.replace(/\s/g, "").length !== 16) {
      newErrors.cardNumber = "Le numéro de carte doit contenir 16 chiffres";
    }
    
    // Expiry validation (MM/YY format)
    if (!expiry.trim()) {
      newErrors.expiry = "La date d'expiration est requise";
    } else if (!/^\d{2}\/\d{2}$/.test(expiry)) {
      newErrors.expiry = "Format invalide (MM/YY)";
    } else {
      const [month, year] = expiry.split("/").map(Number);
      const currentYear = new Date().getFullYear() % 100;
      const currentMonth = new Date().getMonth() + 1;
      
      if (month < 1 || month > 12) {
        newErrors.expiry = "Mois invalide";
      } else if (
        year < currentYear || 
        (year === currentYear && month < currentMonth)
      ) {
        newErrors.expiry = "La carte a expiré";
      }
    }
    
    // CVV validation (3 digits)
    if (!cvv.trim()) {
      newErrors.cvv = "Le code de sécurité est requis";
    } else if (cvv.length !== 3) {
      newErrors.cvv = "Le code doit contenir 3 chiffres";
    }
    
    // Name validation
    if (!name.trim()) {
      newErrors.name = "Le nom du titulaire est requis";
    }
    // Email validation
    if (!formData.Email.trim()) {
      newErrors.Email = "L'adresse email est requise";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.Email)) {
      newErrors.Email = "Format d'email invalide";
    }

    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return; // Stop si le formulaire est invalide
    }
  
    setIsProcessing(true);
    
    try {
      const response = await fetch('http://localhost/api/order/sendOtp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          Email: formData.Email,
        }),
      });
  
      const data = await response.json();
  
      if (data.success) {
        // Ouvrir le modal de vérification
        setVerificationModalOpen(true);
      } else {
        alert('Erreur lors de l\'envoi de l\'OTP.');
      }
    } catch (error) {
      console.error('Erreur lors de l\'envoi de l\'OTP :', error);
      alert('Une erreur est survenue lors de l\'envoi de l\'OTP.');
    } finally {
      setIsProcessing(false);
    }
  };
  
  const handleVerificationSuccess = () => {
    // Fermer le modal de vérification
    setVerificationModalOpen(false);
    
    // Appeler onConfirm avec les informations nécessaires
    onConfirm({
      email: formData.Email,
      phone: formData.phone
    });
    
    // Fermer le modal de paiement
    onClose();
  };

  const handleCloseVerification = () => {
    setVerificationModalOpen(false);
  };

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 animate-fadeIn">
        <div 
          className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md relative animate-slideUp"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors"
            aria-label="Fermer"
            disabled={isProcessing}
          >
            <X className="h-5 w-5" />
          </button>

          <h2 className="text-2xl font-bold text-gray-900 mb-6">Détails de paiement</h2>

          <div className="space-y-6">
            <div className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 p-4 rounded-xl mb-6 text-white shadow-md">
              <div className="flex justify-between items-center mb-6">
                <CreditCard className="h-8 w-8" />
                <div className="text-xs uppercase tracking-wider">Carte bancaire</div>
              </div>
              <div className="h-8 mb-4 text-lg tracking-widest">
                {cardNumber || "•••• •••• •••• ••••"}
              </div>
              <div className="flex justify-between items-end">
                <div>
                  <div className="text-xs opacity-80 mb-1">Titulaire</div>
                  <div className="font-medium uppercase">{name || "VOTRE NOM"}</div>
                </div>
                <div>
                  <div className="text-xs opacity-80 mb-1">Expire</div>
                  <div>{expiry || "MM/YY"}</div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Numéro de carte</label>
                <div className="relative">
                  <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={handleCardNumberChange}
                    placeholder="1234 5678 9012 3456"
                    className={`w-full pl-10 pr-3 py-2 border ${errors.cardNumber ? 'border-red-500 bg-red-50' : 'border-gray-300'} rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-all`}
                    disabled={isProcessing}
                  />
                </div>
                {errors.cardNumber && <p className="text-red-500 text-xs mt-1">{errors.cardNumber}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Date d&apos;expiration</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                      type="text"
                      value={expiry}
                      onChange={handleExpiryChange}
                      placeholder="MM/YY"
                      className={`w-full pl-10 pr-3 py-2 border ${errors.expiry ? 'border-red-500 bg-red-50' : 'border-gray-300'} rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-all`}
                      disabled={isProcessing}
                    />
                  </div>
                  {errors.expiry && <p className="text-red-500 text-xs mt-1">{errors.expiry}</p>}
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">CVV</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                      type="text"
                      value={cvv}
                      onChange={handleCvvChange}
                      placeholder="123"
                      className={`w-full pl-10 pr-3 py-2 border ${errors.cvv ? 'border-red-500 bg-red-50' : 'border-gray-300'} rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-all`}
                      disabled={isProcessing}
                    />
                  </div>
                  {errors.cvv && <p className="text-red-500 text-xs mt-1">{errors.cvv}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Nom du titulaire</label>
                <input
                  type="text"
                  value={name}
                  onChange={handleNameChange}
                  placeholder="JOHN DOE"
                  className={`w-full px-3 py-2 border ${errors.name ? 'border-red-500 bg-red-50' : 'border-gray-300'} rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-all`}
                  disabled={isProcessing}
                />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Adresse Email</label>
                <input
                  type="email"
                  value={formData.Email}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, Email: e.target.value }))
                  }
                  placeholder="exemple@mail.com"
                  className={`w-full px-3 py-2 border ${errors.Email ? 'border-red-500 bg-red-50' : 'border-gray-300'} rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-all`}
                  disabled={isProcessing}
                />
                {errors.Email && <p className="text-red-500 text-xs mt-1">{errors.Email}</p>}
              </div>
            </div>

            <div className="pt-4 border-t border-gray-200">
              <p className="font-semibold text-gray-800 mb-2">Montant total: {totalPrice.toFixed(2)} TND</p>
            </div>

            <div className="flex space-x-4">
              <button
                onClick={onClose}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                disabled={isProcessing}
              >
                Annuler
              </button>
              <button
                onClick={handleSubmit}
                disabled={isProcessing}
                className="flex-1 py-2 px-4 rounded-lg text-white font-medium bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:shadow-lg transition-all transform hover:translate-y-[-2px] disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isProcessing ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Traitement en cours...
                  </div>
                ) : (
                  "Payer " + totalPrice.toFixed(2) + " TND"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Modal de vérification du code */}
      <CodeVerificationModal
        isOpen={isVerificationModalOpen}
        onClose={handleCloseVerification}
        onConfirm={handleVerificationSuccess}
        email={formData.Email}
        deliveryDetails={deliveryDetails}
        paymentMethod={paymentMethod} // Ajoutez cette ligne si nécessaire
        deliveryMethod={deliveryMethod}
        cartItems={cartItems}
/>

    </>
  );
};

export default PaymentDetailsModal;
