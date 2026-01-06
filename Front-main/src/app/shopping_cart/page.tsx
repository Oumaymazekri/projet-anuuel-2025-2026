"use client"
import Link from "next/link"
import { useCart } from "../context/CartContext"
import { Minus, Plus, Trash2, ArrowLeft } from "lucide-react"
import { jwtDecode, type JwtPayload } from "jwt-decode"
import { useState } from "react"
import Toast from "../components/Toats"
import ConfirmationModal from "../components/confirmation"
import { useRouter } from "next/navigation"
import Image from "next/image"
import PaymentMethodModal from "./PaymentMethodModal"
import DeliveryMethodModal from "./DeliveryMethodeModal"

interface DecodedToken extends JwtPayload {
  _id: string
}

interface ShoppingCartProps {
  onBackToProducts?: () => void
}

export default function ShoppingCart() {
  const { items, removeFromCart, updateQuantity, totalItems, totalPrice, clearCart } = useCart()
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState("")
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false)
  const [isDeliveryModalOpen, setIsDeliveryModalOpen] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<string | undefined>()
  const router = useRouter()

  const showNotification = (message: string) => {
    setToastMessage(message)
    setShowToast(true)
  }

  const handleCheckoutClick = () => {
    if (items.length === 0) return

    const token = localStorage.getItem("accessToken")
    if (!token) {
      showNotification("Token non trouvé, veuillez vous connecter.")
      router.push("/login")
      return
    }

    // Ouvrir la modal de sélection de livraison
    setIsDeliveryModalOpen(true)
  }

  const handleSelectPayment = (method: string) => {
    setPaymentMethod(method)
  }

  const handlePaymentConfirm = () => {
    if (!paymentMethod) {
      showNotification("Veuillez sélectionner une méthode de paiement")
      return
    }
    setIsPaymentModalOpen(false)
    setShowConfirmation(true)
  }

  const handleDeliverySelect = (method: string) => {
    console.log("Méthode de livraison sélectionnée :", method)
    // Tu peux enregistrer la méthode si nécessaire
  }

  const handleDeliveryContinue = () => {
    setIsDeliveryModalOpen(false)
    setIsPaymentModalOpen(true)
  }



  if (items.length === 0) {
    return (
      <div className="bg-gray-50 py-8 px-4 rounded-lg shadow-md text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Votre panier est vide</h2>
        <p className="text-gray-600 mb-6">Ajoutez des produits à votre panier pour commencer vos achats.</p>
        <Link href="/shop">
          <button className="py-3 px-6 bg-gradient-to-r from-blue-500 to-pink-500 text-white font-medium rounded-lg">
            Continuer mes achats
          </button>
        </Link>
      </div>
    )
  }

  return (
    <>
      <div className="bg-gray-50 py-8 px-4 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Votre Panier ({totalItems})</h2>
          <Link href="/shop">
            <button className="flex items-center text-blue-600 hover:text-blue-800">
              <ArrowLeft className="w-4 h-4 mr-1" />
              Continuer mes achats
            </button>
          </Link>
        </div>

        <div className="grid gap-6 mb-6">
          {items.map((item) => (
            <div key={item.id} className="bg-white p-4 rounded-lg shadow-sm flex flex-col sm:flex-row gap-4">
              <div className="w-full sm:w-24 h-24 relative">
                <Image
                  src={item.image || "/placeholder.svg"}
                  alt={item.name}
                  className="object-cover rounded-md"
                  style={{ objectFit: "cover" }}
                  width={122}
                  height={122}
                  unoptimized
                />
              </div>
              <div className="flex-grow">
                <h3 className="font-medium text-gray-900">{item.name}</h3>
                <p className="text-gray-500 text-sm mb-2">Prix unitaire: {item.price.toFixed(2)} TND</p>
                <div className="flex justify-between items-center">
                  <div className="flex items-center border rounded-md">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="px-2 py-1 text-gray-600 hover:bg-gray-100 rounded-l-md"
                      disabled={item.quantity <= 1}
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="px-4 py-1">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="px-2 py-1 text-gray-600 hover:bg-gray-100 rounded-r-md"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-red-500 hover:text-red-700 flex items-center"
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Supprimer
                  </button>
                </div>
              </div>
              <div className="font-bold text-right text-lg">{(item.price * item.quantity).toFixed(2)} TND</div>
            </div>
          ))}
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex justify-between py-2">
            <span className="text-gray-600">Sous-total</span>
            <span className="font-medium">{totalPrice.toFixed(2)} TND</span>
          </div>
          <div className="flex justify-between py-2 border-b">
            <span className="text-gray-600">Frais de livraison</span>
            <span className="font-medium">{totalPrice > 35 ? "Gratuit" : "4.99 TND"}</span>
          </div>
          <div className="flex justify-between py-4">
            <span className="text-lg font-bold">Total</span>
            <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-pink-600 bg-clip-text text-transparent">
              {(totalPrice > 35 ? totalPrice : totalPrice + 4.99).toFixed(2)} TND
            </span>
          </div>
          <button
            onClick={handleCheckoutClick}
            className="w-full py-3 px-4 mt-4 bg-gradient-to-r from-blue-500 to-pink-500 hover:from-pink-500 hover:to-blue-500 text-white font-medium rounded-lg shadow-md transition-all duration-300"
          >
            Acheter maintenant
          </button>
        </div>
      </div>

      <Toast message={toastMessage} isVisible={showToast} onClose={() => setShowToast(false)} />

      <DeliveryMethodModal
        isOpen={isDeliveryModalOpen}
        onClose={() => setIsDeliveryModalOpen(false)}
        onSelectDelivery={handleDeliverySelect}
        onContinue={handleDeliveryContinue}
        products={items.map(item => ({
          ...item,
          id: String(item.id), // ✅ Forcer id à être une string
        }))}
      />


      <PaymentMethodModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        onSelectPayment={handleSelectPayment}
        selectedMethod={paymentMethod}
        onConfirm={handlePaymentConfirm}
      />

      
    </>
  )
}
