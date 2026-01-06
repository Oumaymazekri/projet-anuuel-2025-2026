import React, { useState, useRef, useEffect } from "react"
import { Mail, X } from "lucide-react"
import { jwtDecode, type JwtPayload } from "jwt-decode"

interface DecodedToken extends JwtPayload {
  _id: string
}

interface DeliveryDetails {
  Adress: string
  city: string
  postalCode: string
  phoneNumber: string
}
interface CardDetails {
  cardNumber: string
  name: string
  expiry: string
  cvv: string
}

interface PaymentDetails {
  paymentMethod: string
  cardNumber?: string
  name?: string
  expiry?: string
  cvv?: string
}

interface CartItem {
  id: number | string
  name: string
  price: number
  quantity: number
  description?: string
  category?: string
}

interface CodeVerificationModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  email: string
  deliveryDetails: DeliveryDetails
  paymentMethod?: string; 
  deliveryMethod: "domicile" | "magasin"
  cartItems: CartItem[]
  cardDetails?: CardDetails
}

const CodeVerificationModal: React.FC<CodeVerificationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  email,
  deliveryDetails,
  paymentMethod, // Now directly receiving paymentMethod
  deliveryMethod,
  cartItems,
}) => {
  const [code, setCode] = useState<string[]>(Array(4).fill(""))
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isVerifying, setIsVerifying] = useState(false)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    if (isOpen && inputRefs.current[0]) {
      inputRefs.current[0]?.focus()
    }
  }, [isOpen])

  useEffect(() => {
    if (isOpen) {
      setCode(Array(4).fill(""))
      setErrorMessage(null)
    }
  }, [isOpen])

  if (!isOpen) return null

  const handleInputChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return

    const newCode = [...code]
    newCode[index] = value.slice(0, 1)
    setCode(newCode)

    if (value && index < 3 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      if (!code[index] && index > 0 && inputRefs.current[index - 1]) {
        inputRefs.current[index - 1]?.focus()
      }
    }
  }

  const handleVerifyCode = async () => {
    const enteredCode = code.join("")
    if (enteredCode.length !== 4) {
      setErrorMessage("Veuillez entrer le code complet à 4 chiffres")
      return
    }

    setIsVerifying(true)

    try {
      const verifyResponse = await fetch("http://localhost/api/order/verifyOtp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ Email: email, otp: enteredCode }),
      })

      const isVerified = await verifyResponse.json()

      if (isVerified) {
        await createOrder()
        onConfirm()
      } else {
        setErrorMessage("Code incorrect. Veuillez réessayer.")
        setCode(Array(4).fill(""))
        inputRefs.current[0]?.focus()
      }
    } catch (error) {
      console.error("Erreur lors de la vérification du code:", error)
      setErrorMessage("Une erreur est survenue. Veuillez réessayer.")
    } finally {
      setIsVerifying(false)
    }
  }

  const createOrder = async () => {
    try {
      const Email = localStorage.getItem("Email")
      const Full_Name = localStorage.getItem("Full_Name")
      const Phone_Number = localStorage.getItem("Phone_Number")
      const Adress = localStorage.getItem("Adress")
      const token = localStorage.getItem("accessToken")

      if (!token) throw new Error("Token d'authentification non trouvé")

      const decodedToken = jwtDecode<DecodedToken>(token)
      const userId = decodedToken._id
      if (!userId) throw new Error("_id non trouvé dans le token.")

      const payload = {
        user: [
          {
            UserId: userId,
            Email,
            Full_Name,
            Phone_Number,
            Adress,
          },
        ],
        produits: cartItems.map((item) => ({
          ProductId: String(item.id),
          Nom: item.name,
          description: item.description || "Aucune description",
          category: item.category || "Divers",
          prix: item.price,
          quantite: item.quantity,
        })),
        modeLivraison: deliveryMethod === "magasin" ? "magasin" : "domicile",
        nomMagasin: deliveryMethod === "magasin" ? "Magasin Central" : undefined,
        adresseLivraison:
          deliveryMethod === "domicile"
            ? {
                adresse: deliveryDetails.Adress,
                ville: deliveryDetails.city,
                codePostale: deliveryDetails.postalCode,
                telephone: deliveryDetails.phoneNumber,
                email,
              }
            : undefined,
              payment: {
                type: paymentMethod === "card" ? "carte" : "espece",
              },
        prixTotal: cartItems.reduce((total, item) => total + item.price * item.quantity, 0),
      }
      console.log("*********** PAYLOAD ***********")
      console.log(JSON.stringify(payload, null, 2))

      const res = await fetch("http://localhost/api/order/addOrder", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.message || "Erreur lors de la commande.")
      }

      const result = await res.json()
      console.log("Commande créée avec succès:", result)
      return result
    } catch (error) {
      console.error("Erreur lors de la création de la commande:", error)
      throw error
    }
  }

  const handleResendCode = async () => {
    try {
      const response = await fetch("http://localhost/api/order/sendOtp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ Email: email }),
      })

      const data = await response.json()

      if (data.success) {
        setErrorMessage("Un nouveau code a été envoyé à votre adresse email.")
      } else {
        setErrorMessage("Erreur lors de l'envoi du code. Veuillez réessayer.")
      }
    } catch (error) {
      console.error("Erreur lors du renvoi du code:", error)
      setErrorMessage("Une erreur est survenue. Veuillez réessayer.")
    }
  }

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
          <div className="bg-blue-100 p-4 rounded-full mb-4">
            <Mail className="h-10 w-10 text-blue-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 text-center">Vérification du Code</h2>
          <p className="text-gray-600 text-center mt-2">
            Nous avons envoyé un code à 4 chiffres à {email}
          </p>
        </div>

        {errorMessage && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
            {errorMessage}
          </div>
        )}

        <div className="flex justify-center space-x-3 mb-6">
          {[0, 1, 2, 3].map((index) => (
           <input
           key={index}
           ref={(el: HTMLInputElement | null) => { inputRefs.current[index] = el }}  // Correction de la fonction ref
           type="text"
           value={code[index]}
           onChange={(e) => handleInputChange(index, e.target.value)}
           onKeyDown={(e) => handleKeyDown(index, e)}
           maxLength={1}
           className="w-14 h-14 text-2xl text-center border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
         />
         
          ))}
        </div>

        <button
          onClick={handleVerifyCode}
          disabled={code.join("").length !== 4 || isVerifying}
          className={`w-full py-3 px-4 rounded-lg text-white font-medium mb-4 ${
            code.join("").length !== 4 || isVerifying
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:shadow-xl transition-shadow"
          }`}
        >
          {isVerifying ? "Vérification..." : "Vérifier le Code"}
        </button>

        <p className="text-sm text-gray-500 text-center">
          Vous n&apos;avez pas reçu de code ?{" "}
          <button className="text-blue-600 hover:text-blue-800" onClick={handleResendCode}>
            Renvoyer
          </button>
        </p>
      </div>
    </div>
  )
}

export default CodeVerificationModal
