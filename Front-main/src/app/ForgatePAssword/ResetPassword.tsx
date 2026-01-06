"use client"

import type React from "react"

import { useState } from "react"
import { LucideX } from "lucide-react"
import { jwtDecode, type JwtPayload } from "jwt-decode"

interface DecodedToken extends JwtPayload {
  _id: string
}

interface ResetPasswordModalProps {
  isOpen: boolean
  onClose: () => void
  userId: string
  onSuccess: () => void
  email: string; 
}

export default function ResetPasswordModal({ isOpen, onClose, email, onSuccess }: ResetPasswordModalProps) {
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError("")

    // Validate passwords
    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas.")
      return
    }

    if (password.length < 8) {
      setError("Le mot de passe doit contenir au moins 8 caractères.")
      return
    }

    setLoading(true)

    try {
    
      const response = await fetch("http://localhost/api/auth/resetPassword", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          Email: email,
          Password: password,
        }),
      })

      const data = await response.json()
      console.log(data)

      if (!response.ok) {
        throw new Error(data.message || "Échec de la réinitialisation du mot de passe.")
      }

      // Call onSuccess to show success modal
      onSuccess()
    } catch (error: any) {
      setError(error.message || "Une erreur s'est produite. Veuillez réessayer.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700">
          <LucideX size={20} />
        </button>
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Réinitialiser le mot de passe</h2>
        <p className="text-gray-600 text-center mb-6">Créez un nouveau mot de passe pour votre compte</p>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-600 font-medium mb-2">
              Nouveau mot de passe
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500 focus:outline-none"
              placeholder="Entrez votre nouveau mot de passe"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="confirmPassword" className="block text-gray-600 font-medium mb-2">
              Confirmer le mot de passe
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500 focus:outline-none"
              placeholder="Confirmez votre nouveau mot de passe"
              required
            />
          </div>

          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-2 text-white font-medium rounded-md bg-gradient-to-r from-pink-500 to-blue-500 hover:from-blue-500 hover:to-pink-500 disabled:opacity-70"
          >
            {loading ? "Réinitialisation..." : "Réinitialiser le mot de passe"}
          </button>
        </form>
      </div>
    </div>
  )
}
