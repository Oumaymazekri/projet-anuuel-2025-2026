"use client"

import { useState } from "react"
import { LucideX, LucideCheck } from 'lucide-react'

interface EmailModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit?: (email: string) => Promise<void>
  emailSent?: boolean
  onProceedToOtp?: () => void
  onEmailSubmit: (email: string) => void;
}

export default function EmailModal({
  isOpen,
  onClose,
  onProceedToOtp,
  onEmailSubmit, // ✅ Ajouté ici
}: EmailModalProps) {
  const [email, setEmail] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [emailSent, setEmailSent] = useState(false)

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const response = await fetch("http://localhost/api/auth/forgotPassword", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ Email: email }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Failed to send recovery email.")
      }

      setEmailSent(true)

      // ✅ Appelle la fonction pour transmettre l'email au parent
      onEmailSubmit(email)

      localStorage.setItem("recoveryEmail", email)
    } catch (err: any) {
      setError(err.message || "Failed to send recovery email.")
    } finally {
      setLoading(false)
    }
  }

  const handleProceedToOtp = () => {
    if (onProceedToOtp) {
      onProceedToOtp()
    } else {
      window.location.href = `/password/verify?email=${encodeURIComponent(email)}`
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700">
          <LucideX size={20} />
        </button>

        {!emailSent ? (
          <>
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Forgot Password</h2>
            <p className="text-gray-600 text-center mb-6">
              Enter your email address and we&apos;ll send you a verification code to reset your password.
            </p>

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="recoveryEmail" className="block text-gray-600 font-medium mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="recoveryEmail"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500 focus:outline-none"
                  placeholder="Enter your email"
                  required
                />
              </div>

              {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="w-full px-4 py-2 text-white font-medium rounded-md bg-gradient-to-r from-pink-500 to-blue-500 hover:from-blue-500 hover:to-pink-500 disabled:opacity-70"
              >
                {loading ? "Sending..." : "Send Verification Code"}
              </button>
            </form>
          </>
        ) : (
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <LucideCheck className="w-8 h-8 text-green-500" />
              </div>
            </div>

            <h2 className="text-2xl font-bold text-gray-800 mb-4">Email Sent!</h2>

            <p className="text-gray-600 mb-6">
              We&apos;ve sent a verification code to your email. Please check your inbox and enter the code on the next
              screen.
            </p>

            <button
              onClick={handleProceedToOtp}
              className="w-full px-4 py-2 text-white font-medium rounded-md bg-gradient-to-r from-pink-500 to-blue-500 hover:from-blue-500 hover:to-pink-500"
            >
              Enter Verification Code
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
