"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { LucideX } from "lucide-react"

interface OtpModalProps {
  isOpen: boolean
  onClose: () => void
  email: string
  onSuccess: (userId: string) => void
}

export default function OtpModal({ isOpen, onClose, email, onSuccess }: OtpModalProps) {
  const [otp, setOtp] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [timeLeft, setTimeLeft] = useState(300)
  const [timerActive, setTimerActive] = useState(true)

  useEffect(() => {
    if (!isOpen) return

    // Reset state when modal opens
    setOtp("")
    setError("")
    setTimeLeft(300)
    setTimerActive(true)
  }, [isOpen])

  useEffect(() => {
    let timer: NodeJS.Timeout

    if (isOpen && timeLeft > 0 && timerActive) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer)
            setTimerActive(false)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }

    return () => clearInterval(timer)
  }, [isOpen, timeLeft, timerActive])

  if (!isOpen) return null

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      // Get the email from localStorage if not provided
      const emailToUse = email || localStorage.getItem("recoveryEmail") || ""

      if (!emailToUse) {
        throw new Error("Email non trouvé. Veuillez recommencer le processus.")
      }

      const res = await fetch("http://localhost/api/auth/otpVerif", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          Email: emailToUse,
          OTP: otp,
        }),
      })

      const data = await res.json()

      if (!res.ok) throw new Error(data.message || "Code invalide ou expiré.")

      // Store userId in localStorage for the reset password step
      if (data.userId) {
        localStorage.setItem("resetUserId", data.userId)
      }

      // Call onSuccess to transition to reset password modal
      onSuccess(data.userId || data.data)
    } catch (err: any) {
      setError(err.message || "Erreur de vérification.")
    } finally {
      setLoading(false)
    }
  }

  const handleResendOTP = async () => {
    setLoading(true)
    try {
      // Get the email from localStorage if not provided
      const emailToUse = email || localStorage.getItem("recoveryEmail") || ""

      if (!emailToUse) {
        throw new Error("Email non trouvé. Veuillez recommencer le processus.")
      }

      const res = await fetch("http://localhost/api/auth/forgotPassword", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ Email: emailToUse }),
      })

      const data = await res.json()

      if (!res.ok) throw new Error(data.message || "Échec de la réexpédition.")

      setTimeLeft(300)
      setTimerActive(true)
      setError("")
    } catch (err: any) {
      setError(err.message || "Erreur lors de l'envoi.")
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
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Vérification du Code</h2>
        <p className="text-gray-600 text-center mb-6">
          Entrez le code envoyé à {email || localStorage.getItem("recoveryEmail")}
        </p>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="otp" className="block text-gray-600 font-medium mb-2">
              Code de vérification
            </label>
            <input
              type="text"
              id="otp"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500 focus:outline-none"
              placeholder="Code à 6 chiffres"
              maxLength={6}
              required
            />
          </div>

          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

          <div className="mb-4 text-center">
            <p className="text-sm text-gray-600">
              Temps restant : <span className="font-medium">{formatTime(timeLeft)}</span>
            </p>
          </div>

          <button
            type="submit"
            disabled={loading || timeLeft === 0}
            className="w-full px-4 py-2 text-white font-medium rounded-md bg-gradient-to-r from-pink-500 to-blue-500 hover:from-blue-500 hover:to-pink-500 disabled:opacity-70 mb-3"
          >
            {loading ? "Vérification..." : "Vérifier"}
          </button>

          {timeLeft === 0 && (
            <button
              type="button"
              onClick={handleResendOTP}
              disabled={loading}
              className="w-full px-4 py-2 text-pink-500 font-medium rounded-md border border-pink-500 hover:bg-pink-50"
            >
              Renvoyer le code
            </button>
          )}
        </form>
      </div>
    </div>
  )
}
