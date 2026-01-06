// PaymentMethodModal.tsx
import React, { useState } from "react";
import {
  CreditCard,
  Banknote,
  X,
  Home,
  MapPin,
  Phone,
  Mail,
} from "lucide-react";
import PaymentDetailsModal from "./PaymentdetailsModal";
import PaymentConfirmationModal from "./PaymentConfirmationModal";
import { useCart } from "../context/CartContext";
import { jwtDecode, JwtPayload } from "jwt-decode";
interface DecodedToken extends JwtPayload {
  _id: string
}


interface PaymentMethodModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPayment: (method: string) => void;
  selectedMethod: string | undefined;
  onConfirm: () => void;
}

const PaymentMethodModal: React.FC<PaymentMethodModalProps> = ({
  isOpen,
  onClose,
  onSelectPayment,
  selectedMethod,
  onConfirm,
}) => {
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [contactInfo, setContactInfo] = useState<{ email?: string; phone?: string }>({});
  
  const [deliveryDetails, setDeliveryDetails] = useState({
    Adress: "",
    city: "",
    postalCode: "",
    phoneNumber: "",
    email: "",
  });
  const [deliveryMethod, setDeliveryMethod] = useState<"domicile" | "magasin">("domicile");

  const { items, totalPrice ,clearCart } = useCart();

  if (!isOpen) return null;

  const handleDeliveryInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDeliveryDetails((prev) => ({ ...prev, [name]: value }));
  };

  const isDeliveryInfoValid = () => {
    const { Adress, city, postalCode, phoneNumber, email } = deliveryDetails;
    return Adress && city && postalCode && phoneNumber && email;
  };

  const handleContinue = async () => {
    if (!selectedMethod) return;

    if (deliveryMethod === "domicile" && !isDeliveryInfoValid()) {
      alert("Veuillez remplir tous les champs de livraison.");
      return;
    }

    try {
      // Si la méthode de paiement est "card", on montre d'abord le modal des détails
      if (selectedMethod === "card") {
        setShowDetailsModal(true);
        return;
      }

      // Sinon, on procède directement à l'enregistrement de la commande
        const Email = localStorage.getItem("Email" );
        const Full_Name = localStorage.getItem("Full_Name");
        const Phone_Number = localStorage.getItem("Phone_Number" );
        const Adress = localStorage.getItem("Adress" )
        const token = localStorage.getItem("accessToken")
           console.log(Email+""+Full_Name+""+Phone_Number,Adress,token)
           if (!token) return
       
           let userId
           try {
             const decodedToken = jwtDecode<DecodedToken>(token)
             userId = decodedToken._id
             if (!userId) throw new Error("_id non trouvé dans le token.")
           } catch (error) {console.error("Erreur de décodage du token :", error)}

      const produits = items.map((item) => ({
        ProductId: String(item.id),
        Nom: item.name,
        description: item.description || "Aucune description",
        category: item.category || "Divers",
        prix: item.price,
        quantite: item.quantity,
      }));

      const payload = {
        user: [
          {
            UserId: userId,
            Email: Email,
            Full_Name: Full_Name,
            Phone_Number: Phone_Number,
            Adress :Adress
          },
        ],
        produits,
        modeLivraison: deliveryMethod,
        nomMagasin: deliveryMethod === "magasin" ? "Magasin Central" : undefined,
        adresseLivraison:
          deliveryMethod === "domicile"
            ? {
                adresse: deliveryDetails.Adress,
                ville: deliveryDetails.city,
                codePostale: deliveryDetails.postalCode,
                telephone: deliveryDetails.phoneNumber,
                email: deliveryDetails.email,
              }
            : undefined,
        payment: {
          type: selectedMethod === "card" ? "carte" : "espece",
        },
      };

      const res = await fetch("http://localhost/api/order/addOrder", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Erreur lors de la commande.");
      }

     
      setShowConfirmationModal(true);
     

    } catch (err: any) {
      console.error("Erreur lors de la commande :", err);
      alert("Erreur lors de la commande : " + err.message);
    }
  };

  const handleDetailsConfirm = (info?: { email?: string; phone?: string }) => {
    setShowDetailsModal(false);
    if (info) {
      setContactInfo(info);
    }
    setShowConfirmationModal(true); // Ouvre la modal de confirmation après les détails
  };

  const handleConfirmationClose = () => {
    setShowConfirmationModal(false);
    clearCart(); 
    onConfirm(); // Confirmer la commande après la modal
   
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center px-4 py-8 animate-fadeIn">
      <div
        className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 w-full max-w-xl relative overflow-y-auto max-h-[90vh] animate-slideUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Bouton de fermeture */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
          Informations de Livraison
        </h2>

        {/* Champs de livraison */}
        <div className="space-y-4">
          {/* Champs d'adresse, ville, code postal, téléphone et email */}
          <div>
            <label className="block text-gray-700">Adresse</label>
            <input
              type="text"
              name="Adress"
              value={deliveryDetails.Adress}
              onChange={handleDeliveryInputChange}
              className="w-full p-3 border rounded-md"
            />
          </div>
          <div className="flex space-x-4">
            <div className="flex-1">
              <label className="block text-gray-700">Ville</label>
              <input
                type="text"
                name="city"
                value={deliveryDetails.city}
                onChange={handleDeliveryInputChange}
                className="w-full p-3 border rounded-md"
              />
            </div>
            <div className="flex-1">
              <label className="block text-gray-700">Code Postal</label>
              <input
                type="text"
                name="postalCode"
                value={deliveryDetails.postalCode}
                onChange={handleDeliveryInputChange}
                className="w-full p-3 border rounded-md"
              />
            </div>
          </div>
          <div className="flex space-x-4">
            <div className="flex-1">
              <label className="block text-gray-700">Téléphone</label>
              <input
                type="tel"
                name="phoneNumber"
                value={deliveryDetails.phoneNumber}
                onChange={handleDeliveryInputChange}
                className="w-full p-3 border rounded-md"
              />
            </div>
            <div className="flex-1">
              <label className="block text-gray-700">Email</label>
              <input
                type="email"
                name="email"
                value={deliveryDetails.email}
                onChange={handleDeliveryInputChange}
                className="w-full p-3 border rounded-md"
              />
            </div>
          </div>
        </div>

        {/* Méthodes de paiement */}
        <h3 className="text-xl font-semibold text-gray-800 mt-8 mb-4 text-center">
          Méthode de Paiement
        </h3>

        <div className="space-y-4">
          {/* Option "Carte Bancaire" */}
          <div
            className={`border rounded-xl p-4 cursor-pointer hover:bg-gray-50 transition ${
              selectedMethod === "card" ? "border-pink-500 bg-pink-50" : ""
            }`}
            onClick={() => onSelectPayment("card")}
          >
            <label className="flex items-center gap-4 cursor-pointer">
              <div className="bg-pink-500 p-3 rounded-full">
                <CreditCard className="h-6 w-6 text-white" />
              </div>
              <div>
                <h4 className="font-medium text-gray-800">Carte Bancaire</h4>
                <p className="text-sm text-gray-500">Payez en ligne immédiatement</p>
              </div>
              <input
                type="radio"
                name="paymentMethod"
                value="card"
                checked={selectedMethod === "card"}
                onChange={() => onSelectPayment("card")}
                className="ml-auto"
              />
            </label>
          </div>

          {/* Option "Paiement à la Livraison" */}
          <div
            className={`border rounded-xl p-4 cursor-pointer hover:bg-gray-50 transition ${
              selectedMethod === "cash" ? "border-pink-500 bg-pink-50" : ""
            }`}
            onClick={() => onSelectPayment("cash")}
          >
            <label className="flex items-center gap-4 cursor-pointer">
              <div className="bg-pink-500 p-3 rounded-full">
                <Banknote className="h-6 w-6 text-white" />
              </div>
              <div>
                <h4 className="font-medium text-gray-800">Paiement à la Livraison</h4>
                <p className="text-sm text-gray-500">Payez en espèces à la réception</p>
              </div>
              <input
                type="radio"
                name="paymentMethod"
                value="cash"
                checked={selectedMethod === "cash"}
                onChange={() => onSelectPayment("cash")}
                className="ml-auto"
              />
            </label>
          </div>
        </div>

        <div className="flex justify-between mt-6 space-x-4">
          <button
            onClick={onClose}
            className="flex-1 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition"
          >
            Retour
          </button>
          <button
            onClick={handleContinue}
            disabled={!selectedMethod}
            className={`flex-1 py-2 rounded-lg text-white font-semibold transition ${
              selectedMethod
                ? "bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 hover:shadow-lg"
                : "bg-gray-300 cursor-not-allowed"
            }`}
          >
            Continuer
          </button>
        </div>
      </div>

      {showDetailsModal && selectedMethod === "card" && (
        <PaymentDetailsModal
          isOpen={showDetailsModal}
          onClose={() => setShowDetailsModal(false)}
          paymentMethod={selectedMethod}
          onConfirm={handleDetailsConfirm}
          cartItems={items}
          totalPrice={totalPrice}
          deliveryDetails={deliveryDetails}
          deliveryMethod={deliveryMethod}    
          
        />
      )}
      {showConfirmationModal &&  (
        <PaymentConfirmationModal
          isOpen={showConfirmationModal}
          onClose={handleConfirmationClose}
          paymentMethod={selectedMethod}
          contactInfo={contactInfo}
        />
      )}
    </div>
  );
};

export default PaymentMethodModal;
