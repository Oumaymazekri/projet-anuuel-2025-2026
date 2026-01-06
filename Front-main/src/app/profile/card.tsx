"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, CreditCard } from "lucide-react"

export default function CardPayment() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [cardData, setCardData] = useState({
    name: "",
    number: "",
    month: "",
    year: "",
    cvc: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setCardData((prev) => ({ ...prev, [id]: value }))
  }

  const handleSelectChange = (field: string, value: string) => {
    setCardData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Store card data in sessionStorage (only for demo purposes)
    // In a real app, you would handle this more securely
    sessionStorage.setItem("cardData", JSON.stringify(cardData))

    // Navigate to validation page
    setTimeout(() => {
      setLoading(false)
      router.push("/payment/validate")
    }, 500)
  }

  return (
    <div className="container max-w-md mx-auto py-8">
      <button
        className="mb-4 flex items-center gap-1 px-3 py-2 text-gray-600 hover:text-gray-900 rounded-md hover:bg-gray-100"
        onClick={() => router.back()}
      >
        <ArrowLeft className="h-4 w-4" />
        Retour
      </button>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">Paiement par Carte</h2>
          <p className="text-gray-500 mt-1">Entrez les détails de votre carte bancaire</p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-4">
            <div className="space-y-2">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Nom du Titulaire
              </label>
              <input
                id="name"
                type="text"
                placeholder="Jean Dupont"
                required
                value={cardData.name}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="number" className="block text-sm font-medium text-gray-700">
                Numéro de Carte
              </label>
              <div className="relative">
                <input
                  id="number"
                  type="text"
                  placeholder="1234 5678 9012 3456"
                  required
                  maxLength={19}
                  pattern="[0-9\s]{13,19}"
                  value={cardData.number}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent pr-10"
                />
                <CreditCard className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2 col-span-1">
                <label htmlFor="month" className="block text-sm font-medium text-gray-700">
                  Mois
                </label>
                <select
                  id="month"
                  required
                  value={cardData.month}
                  onChange={(e) => handleSelectChange("month", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="" disabled>
                    MM
                  </option>
                  {Array.from({ length: 12 }, (_, i) => {
                    const month = i + 1
                    return (
                      <option key={month} value={month.toString().padStart(2, "0")}>
                        {month.toString().padStart(2, "0")}
                      </option>
                    )
                  })}
                </select>
              </div>

              <div className="space-y-2 col-span-1">
                <label htmlFor="year" className="block text-sm font-medium text-gray-700">
                  Année
                </label>
                <select
                  id="year"
                  required
                  value={cardData.year}
                  onChange={(e) => handleSelectChange("year", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="" disabled>
                    AA
                  </option>
                  {Array.from({ length: 10 }, (_, i) => {
                    const year = new Date().getFullYear() + i
                    return (
                      <option key={year} value={year.toString().slice(-2)}>
                        {year.toString().slice(-2)}
                      </option>
                    )
                  })}
                </select>
              </div>

              <div className="space-y-2 col-span-1">
                <label htmlFor="cvc" className="block text-sm font-medium text-gray-700">
                  CVC
                </label>
                <input
                  id="cvc"
                  type="text"
                  placeholder="123"
                  required
                  maxLength={4}
                  pattern="[0-9]{3,4}"
                  value={cardData.cvc}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          <div className="p-6 border-t">
            <button
              type="submit"
              className={`w-full py-2 px-4 rounded-md text-white font-medium ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:shadow-xl transition-shadow"
              }`}
              disabled={loading}
            >
              {loading ? "Traitement..." : "Continuer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
