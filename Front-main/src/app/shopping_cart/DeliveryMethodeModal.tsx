import React, { useState } from "react";
import { ShoppingBag, Truck, MapPin, X } from "lucide-react";
import { jwtDecode, JwtPayload } from "jwt-decode";
import { useCart } from "../context/CartContext";
interface DecodedToken extends JwtPayload {
  _id: string
}


interface DeliveryMethodModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectDelivery: (method: string, Adress?: string) => void;
  onContinue: () => void;
  products: { id: string; name: string; price: number; quantity: number; description?: string; category?: string }[]; // Prop pour les produits
}

const DeliveryMethodModal: React.FC<DeliveryMethodModalProps> = ({
  isOpen,
  onClose,
  onSelectDelivery,
  onContinue,
  products, // Utilisation des produits du panier
}) => {
  const [selectedMethod, setSelectedMethod] = useState<string | undefined>();
  const [storeLocation, setStoreLocation] = useState("");
   const { items, removeFromCart, updateQuantity, totalItems, totalPrice, clearCart } = useCart()
  const [showConfirmation, setShowConfirmation] = useState(false);

  if (!isOpen) return null;

  const handleMethodSelect = (method: string) => {
    setSelectedMethod(method);
  };

  const handleContinue = async () => {
    if (!selectedMethod) return;
    if (selectedMethod === "pickup" && !storeLocation) return;

    // Si le client choisit "retrait en magasin", afficher la fenêtre de confirmation
    if (selectedMethod === "pickup") {
      setShowConfirmation(true);
    } else {
      // Sinon, passer à la livraison à domicile
      onSelectDelivery(selectedMethod);
      onContinue();
    }
  };

  const handleSubmitPickupOrder = async () => {
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
      produits: products.map((product) => ({
        ProductId: product.id,
        Nom: product.name,
        description: product.description || "Aucune description",
        category: product.category || "Divers",
        prix: product.price,
        quantite: product.quantity,
      })),
      modeLivraison: "magasin",
      nomMagasin: storeLocation,
      payment: {
        type: "espece", // Par défaut, ou tu peux gérer le type de paiement sélectionné
      },
    };

    try {
      const res = await fetch("http://localhost/api/order/addOrder", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (res.ok) {
       
        setShowConfirmation(false);
       
        onClose();
        clearCart()
      } else {
        alert(result.message || "Erreur lors de la commande");
      }
    } catch (error) {
      console.error("Erreur :", error);
      alert("Erreur inattendue");
    }
  };

  const storeLocations = [
    "Tunis - 42 Avenue de la Liberté",
    "Gabes - 52 Avenue Habib Bourguiba",
    "Ariana - 2 Av. Hedi Nouira",
    "Nabeul - 5 Route de Korba KM 2 Menzel Temime",
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div
        className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-md relative animate-slideUp"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        <h2 className="text-2xl font-bold text-gray-900 mb-6">Mode de Livraison</h2>

        <div className="space-y-6">
          <div className="flex flex-col space-y-4">
            <div
              className={`border rounded-lg p-4 cursor-pointer hover:bg-gray-50 transition-colors ${selectedMethod === "pickup" ? "border-blue-500 bg-blue-50" : ""}`}
              onClick={() => handleMethodSelect("pickup")}
            >
              <label className="flex items-center cursor-pointer">
                <div className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 p-3 rounded-full mr-4">
                  <ShoppingBag className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Retrait en Magasin</h3>
                  <p className="text-sm text-gray-500">Récupérez votre commande dans l&apos;un de nos magasins</p>
                </div>
                <input
                  type="radio"
                  name="deliveryMethod"
                  value="pickup"
                  checked={selectedMethod === "pickup"}
                  onChange={() => handleMethodSelect("pickup")}
                  className="ml-auto"
                />
              </label>
            </div>

            <div
              className={`border rounded-lg p-4 cursor-pointer hover:bg-gray-50 transition-colors ${selectedMethod === "delivery" ? "border-blue-500 bg-blue-50" : ""}`}
              onClick={() => handleMethodSelect("delivery")}
            >
              <label className="flex items-center cursor-pointer">
                <div className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 p-3 rounded-full mr-4">
                  <Truck className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Livraison à Domicile</h3>
                  <p className="text-sm text-gray-500">Recevez votre commande directement chez vous</p>
                </div>
                <input
                  type="radio"
                  name="deliveryMethod"
                  value="delivery"
                  checked={selectedMethod === "delivery"}
                  onChange={() => handleMethodSelect("delivery")}
                  className="ml-auto"
                />
              </label>
            </div>
          </div>

          {selectedMethod === "pickup" && (
            <div className="mt-4 animate-fadeIn">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Choisissez un magasin
              </label>
              <div className="space-y-2">
                {storeLocations.map((location, index) => (
                  <div
                    key={index}
                    className={`border rounded-lg p-3 cursor-pointer flex items-center ${storeLocation === location ? "border-blue-500 bg-blue-50" : ""}`}
                    onClick={() => setStoreLocation(location)}
                  >
                    <MapPin className="h-5 w-5 text-gray-500 mr-2" />
                    <span>{location}</span>
                    <input
                      type="radio"
                      name="storeLocation"
                      checked={storeLocation === location}
                      onChange={() => setStoreLocation(location)}
                      className="ml-auto"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex space-x-4">
            <button
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Retour
            </button>
            <button
              onClick={handleContinue}
              disabled={!selectedMethod || (selectedMethod === "pickup" && !storeLocation)}
              className={`flex-1 py-2 px-4 rounded-lg text-white font-medium ${(!selectedMethod || (selectedMethod === "pickup" && !storeLocation)) ? "bg-gray-300 cursor-not-allowed" : "bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:shadow-xl transition-shadow"}`}
            >
              Continuer
            </button>
          </div>
        </div>
      </div>

      {/* Fenêtre de confirmation */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-lg text-center space-y-4">
            <h2 className="text-xl font-semibold text-gray-900">
              Confirmation de commande
            </h2>
            <p className="text-gray-600">
              Votre commande sera préparée. Nous vous contacterons pour confirmation.
            </p>
            <div className="flex justify-center space-x-4 mt-6">
              <button
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100"
                onClick={() => setShowConfirmation(false)}
              >
                Annuler
              </button>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                onClick={handleSubmitPickupOrder}
              >
                Confirmer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeliveryMethodModal;
