import React, { useEffect, useState } from "react"
import { jwtDecode, type JwtPayload } from "jwt-decode"

interface DecodedToken extends JwtPayload {
  _id: string
}

interface Produit {
  ProductId: string
  Nom: string
  description: string
  category: string
  prix: number
  quantite: number
}

interface Order {
  _id: string
  user: {
    UserId: string
    Email: string
    Full_Name: string
    Phone_Number: string
    Adress: string
  }[]
  produits: Produit[]
  prixTotal: number
  modeLivraison: string
  nomMagasin?: string
  adresseLivraison?: {
    adresse: string
    ville: string
    codePostale: string
    telephone: string
    email: string
  }
  payment: {
    type: string
  }
  DateCreation: string
  etatCommande: "en_attente" | "Accepté" | "Refusé" // 🆕 Ajout du champ état
}

const OrderHistory: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr)
    return isNaN(d.getTime()) ? dateStr : d.toLocaleString()
  }

const formatEtatCommande = (etat: string): { label: string; color: string } => {
  switch (etat) {
    case "en_attente":
      return { label: "🕒 En attente", color: "text-blue-600" };
    case "Accepté":
      return { label: "✅ Accepté", color: "text-green-600" };
    case "Refusé":
      return { label: "❌ Refusé", color: "text-red-600" };
    default:
      return { label: etat, color: "text-gray-500" };
  }
}

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("accessToken")
        if (!token) throw new Error("Token non trouvé")

        const decoded = jwtDecode<DecodedToken>(token)
        const userId = decoded._id
        if (!userId) throw new Error("ID utilisateur non trouvé dans le token")

        const response = await fetch(`http://localhost/api/order/getOrderWithDetails/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!response.ok) {
          const errData = await response.json()
          throw new Error(errData.message || "Erreur lors du chargement des commandes")
        }

        const data = await response.json()
        setOrders(data)
      } catch (err: any) {
        setError(err.message || "Une erreur est survenue")
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [])

  if (loading) return <div className="p-6 text-center text-gray-600">Chargement des commandes...</div>
  if (error) return <div className="p-6 text-center text-red-600">{error}</div>
  if (orders.length === 0) return <div className="p-6 text-center text-gray-600">Aucune commande trouvée.</div>

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h2 className="text-3xl font-bold text-center mb-10 text-blue-700">🧾 Historique de vos Commandes</h2>

      <div className="space-y-6">
        {orders.map((order) => (
          <div
            key={order._id}
            className="bg-white rounded-xl shadow-md border border-gray-200 p-6 hover:shadow-lg transition"
          >
            <div className="flex flex-col md:flex-row md:justify-between mb-4">
              <div>
                <p className="text-gray-500 text-sm">📅 {formatDate(order.DateCreation)}</p>
                <p className="text-gray-700 mt-1">
                  🚚 Livraison : <span className="font-medium">{order.modeLivraison}</span>
                </p>
                {order.modeLivraison === "magasin" && order.nomMagasin && (
                  <p className="text-gray-700">🏬 Magasin : <strong>{order.nomMagasin}</strong></p>
                )}
              </div>
              <div className="mt-4 md:mt-0 text-right">
                <p className="text-gray-700">💳 Paiement : <strong>{order.payment.type}</strong></p>
                <p className="text-gray-700 mt-1">💰 Total : <span className="text-xl font-bold text-green-600">{order.prixTotal} TND</span></p>
                <p className="text-sm mt-2">
                    📦 État : {(() => {
                      const etat = formatEtatCommande(order.etatCommande)
                      return <span className={`font-semibold ${etat.color}`}>{etat.label}</span>
                    })()}
                  </p>
              </div>
            </div>

            {order.adresseLivraison && (
              <div className="bg-gray-50 p-4 rounded-md mb-4">
                <h4 className="font-semibold text-gray-800 mb-2">📍 Adresse de livraison :</h4>
                <p>{order.adresseLivraison.adresse}, {order.adresseLivraison.ville}</p>
                <p>Code postal : {order.adresseLivraison.codePostale}</p>
                <p>Tél : {order.adresseLivraison.telephone}</p>
              </div>
            )}

            <div>
              <h3 className="font-semibold text-gray-800 mb-3">🛒 Produits commandés :</h3>
              <ul className="grid sm:grid-cols-2 gap-4">
                {order.produits.map((prod, idx) => (
                  <li
                    key={idx}
                    className="border border-gray-200 rounded-md p-3 bg-gray-50"
                  >
                    <p className="text-sm font-semibold">{prod.Nom} × {prod.quantite}</p>
                    <p className="text-xs text-gray-500">{prod.description}</p>
                    <p className="text-sm text-gray-700 mt-1">Prix unitaire : <strong>{prod.prix} TND</strong></p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default OrderHistory
