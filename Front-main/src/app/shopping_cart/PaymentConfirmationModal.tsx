"use client"

import type React from "react"
import { CheckCircle, Truck, CreditCard, Phone, Mail, X } from "lucide-react"

interface PaymentConfirmationModalProps {
  isOpen: boolean
  onClose: () => void
  paymentMethod: string | undefined
  contactInfo?: {
    email?: string
    phone?: string
  }
}

const PaymentConfirmationModal: React.FC<PaymentConfirmationModalProps> = ({
  isOpen,
  onClose,
  paymentMethod,
  contactInfo = {},
}) => {
  if (!isOpen) return null

  const { email, phone } = contactInfo

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

        <div className="flex flex-col items-center mb-6">
          {paymentMethod === "card" ? (
            <div className="bg-green-100 p-4 rounded-full mb-4">
              <CheckCircle className="h-12 w-12 text-green-500" />
            </div>
          ) : (
            <div className="bg-blue-100 p-4 rounded-full mb-4">
              <Truck className="h-12 w-12 text-blue-500" />
            </div>
          )}

          <h2 className="text-2xl font-bold text-gray-900 text-center">
            {paymentMethod === "card" ? "Paiement validé" : "Commande enregistrée"}
          </h2>
        </div>

        <div className="space-y-4">
          {paymentMethod === "card" ? (
            <div className="bg-green-50 border border-green-100 rounded-lg p-4">
              <div className="flex items-start">
                <CreditCard className="h-5 w-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                <div>
                  <p className="text-green-800 font-medium">Paiement validé et votre commande enregistrée</p>
                  <p className="text-green-700 text-sm mt-1">
                    Votre commande a été traitée avec succès. Vous recevrez un email de confirmation avec les détails de
                    votre commande.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
              <div className="flex items-start">
                <Phone className="h-5 w-5 text-blue-500 mt-0.5 mr-3 flex-shrink-0" />
                <div>
                  <p className="text-blue-800 font-medium">On va vous contacter pour la confirmation</p>
                  <p className="text-blue-700 text-sm mt-1">
                    Notre équipe vous contactera prochainement pour confirmer votre commande et organiser la livraison.
                  </p>
                </div>
              </div>
            </div>
          )}

          {paymentMethod === "cash" && (
            <div className="mt-4 space-y-3">
              <div className="flex items-center">
                <Phone className="h-4 w-4 text-gray-500 mr-2" />
                <p className="text-sm text-gray-600">
                  {phone ? `Nous vous contacterons au ${phone}` : "Veuillez fournir un numéro de téléphone valide"}
                </p>
              </div>
              {email && (
                <div className="flex items-center">
                  <Mail className="h-4 w-4 text-gray-500 mr-2" />
                  <p className="text-sm text-gray-600">Un récapitulatif sera envoyé à {email}</p>
                </div>
              )}
            </div>
          )}

          <div className="mt-6">
            <p className="text-sm text-gray-600 mb-2">Numéro de commande: #{generateOrderNumber()}</p>
            <p className="text-sm text-gray-600">
              Date: {new Date().toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
            </p>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-gray-200">
          <button
            onClick={onClose}
            className="w-full py-2 px-4 rounded-lg text-white font-medium bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:shadow-xl transition-shadow"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  )
}

// Fonction pour générer un numéro de commande aléatoire
const generateOrderNumber = () => {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

export default PaymentConfirmationModal
