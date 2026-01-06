"use client"
import { Minus, Plus, X } from "lucide-react"
import { useCart } from "../context/CartContext"
import { useRouter } from "next/navigation"
import Image from "next/image";
interface CartModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function CartModal({ isOpen, onClose }: CartModalProps) {
  const { items, removeFromCart, updateQuantity, totalItems, totalPrice } = useCart()
  const router = useRouter()

  const handleCheckout = () => {
    router.push("/shopping_cart")
    onClose()
  }

  const handleContinueShopping = () => {
    router.push("/shop")
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="absolute top-10 right-0 z-50 w-96 max-w-[calc(100vw-2rem)]">
      <div className="bg-white p-6 rounded-md shadow-lg relative max-h-[80vh] overflow-auto">
        {/* Titre du modal */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Votre Panier ({totalItems})</h2>

          {/* Bouton de fermeture */}
          <button className="text-gray-500 hover:text-gray-700" onClick={onClose} aria-label="Fermer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Vérification si le panier est vide */}
        {items.length === 0 ? (
          <div className="text-center text-gray-500 py-6">
            <div className="w-16 h-16 mx-auto mb-3 flex items-center justify-center bg-gray-100 rounded-full">
              <svg
                className="w-8 h-8 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
            </div>
            <p className="mb-3">Votre panier est vide.</p>
            <button
              onClick={handleContinueShopping}
              className="px-4 py-2 bg-gradient-to-r from-blue-500 to-pink-500 text-white rounded-md hover:from-pink-500 hover:to-blue-500 transition-all duration-300 text-sm"
            >
              Continuer mes achats
            </button>
          </div>
        ) : (
          <div>
            {/* Afficher les éléments du panier */}
            <div className="space-y-3 max-h-[40vh] overflow-auto mb-3">
              {items.map((item) => (
                <div key={item.id} className="flex items-center gap-3 border-b pb-3">
                  <div className="w-14 h-14 relative rounded overflow-hidden flex-shrink-0">
              <Image
                src={item.image || "/placeholder.svg"}
                alt={item.name}
                width={56} // Ajuste la largeur (correspond à w-14)
                height={56} // Ajuste la hauteur (correspond à h-14)
                className="object-cover w-full h-full"
                priority
                unoptimized
              />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-sm">{item.name}</p>
                    <p className="text-xs text-gray-500">{item.price.toFixed(2)} TND</p>
                    <div className="flex items-center mt-1">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-1 text-gray-600 hover:bg-gray-100 rounded"
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-2 text-xs">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-1 text-gray-600 hover:bg-gray-100 rounded"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <p className="font-semibold text-sm">{(item.price * item.quantity).toFixed(2)} TND</p>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-500 hover:text-red-700 text-xs mt-1"
                    >
                      Supprimer
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Sous-total et frais de livraison */}
            <div className="space-y-2 mb-3">
              <div className="flex justify-between text-xs">
                <span className="text-gray-600">Sous-total</span>
                <span>{totalPrice.toFixed(2)} TND</span>
              </div>
              <div className="flex justify-between text-xs border-b pb-2">
                <span className="text-gray-600">Frais de livraison</span>
                <span>{totalPrice > 35 ? "Gratuit" : "4.99 TND"}</span>
              </div>
            </div>

            {/* Total du panier */}
            <div className="flex justify-between font-semibold mb-4 text-sm">
              <span>Total:</span>
              <span className="bg-gradient-to-r from-blue-600 to-pink-600 bg-clip-text text-transparent">
                {(totalPrice > 35 ? totalPrice : totalPrice + 4.99).toFixed(2)} TND
              </span>
            </div>

            {/* Boutons d'action */}
            <div className="space-y-2">
              <button
                onClick={handleCheckout}
                className="w-full py-2 px-4 bg-gradient-to-r from-blue-500 to-pink-500 hover:from-pink-500 hover:to-blue-500 text-white font-medium rounded-md shadow-md transition-all duration-300 text-sm"
              >
                Acheter maintenant
              </button>
              <button
                onClick={handleContinueShopping}
                className="w-full py-2 px-4 border border-gray-300 rounded-md hover:bg-gray-100 transition-all duration-300 text-sm"
              >
                Continuer mes achats
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

