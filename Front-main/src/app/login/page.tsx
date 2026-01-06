"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/app/lib/authContext"

// Import modals
import EmailModal from "../ForgatePAssword/EmailModal"
import OtpModal from "../ForgatePAssword/OTPModel"
import ResetPasswordModal from "../ForgatePAssword/ResetPassword"
import SuccessModal from "../ForgatePAssword/SuccessModal"

const Login = () => {
  const [formData, setFormData] = useState({
    Email: "",
    Password: "",
  })

  // Password recovery state
  const [recoveryEmail, setRecoveryEmail] = useState("")
  const [userId, setUserId] = useState("")
  const [currentModal, setCurrentModal] = useState<"none" | "email" | "otp" | "reset" | "success">("none")

  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const router = useRouter()
  const { login } = useAuth()

  // Check URL parameters for direct modal access
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const showModal = urlParams.get("modal")
    const email = urlParams.get("email")

    if (showModal === "otp" && email) {
      setRecoveryEmail(email)
      setCurrentModal("otp")
    }

    // Check if we have a stored recovery email
    const storedEmail = localStorage.getItem("recoveryEmail")
    if (storedEmail && !recoveryEmail) {
      setRecoveryEmail(storedEmail)
    }
  }, [recoveryEmail])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setFormData({ ...formData, [id]: value })
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    try {
      const response = await fetch("http://localhost/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          Email: formData.Email,
          Password: formData.Password,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        setError(errorData.message || "Invalid email or password.")
      } else {
        const data = await response.json()

        if (data.token) {
          localStorage.setItem("accessToken", data.token)
          localStorage.setItem("Email", data.Email || "")
          localStorage.setItem("Full_Name", data.Full_Name || "")
          localStorage.setItem("Phone_Number", data.Phone_Number || "")
          localStorage.setItem("Adress", data.Adress || "")
          localStorage.setItem("image", data.image || "")

          login(data.token, data.Email, data.Full_Name, data.Phone_Number, data.Adress, data.image)
          setSuccess("Login successful!")
          setFormData({ Email: "", Password: "" })

          router.push("/shop")
        }
      }
    } catch (error) {
      setError("Failed to connect to the server. Please try again.")
    }
  }

  // Password recovery handlers
  const handleForgotPassword = () => {
    setCurrentModal("email")
  }

  const closeModal = () => {
    setCurrentModal("none")
    setError("")
  }

  const handleEmailSubmit = (email: string) => {
    setRecoveryEmail(email)
    localStorage.setItem("recoveryEmail", email)
    setCurrentModal("otp")
  }

  const handleOtpSuccess = (userId: string) => {
    setUserId(userId)
    setCurrentModal("reset")
  }

  const handleResetSuccess = () => {
    setCurrentModal("success")
    localStorage.removeItem("recoveryEmail")
    localStorage.removeItem("resetUserId")
  }

  

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-200 to-blue-200">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="Email" className="block text-gray-600 font-medium mb-2">
              Email Address
            </label>
            <input
              type="email"
              id="Email"
              value={formData.Email}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500 focus:outline-none"
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="Password" className="block text-gray-600 font-medium mb-2">
              Password
            </label>
            <input
              type="password"
              id="Password"
              value={formData.Password}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Enter your password"
              required
            />
          </div>

          <div className="flex justify-end mb-4">
            <button type="button" onClick={handleForgotPassword} className="text-sm text-pink-500 hover:underline">
              Forgot Password?
            </button>
          </div>

          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          {success && <p className="text-green-500 text-sm mb-4">{success}</p>}

          <button
            type="submit"
            className="w-full px-4 py-2 text-white font-medium rounded-md bg-gradient-to-r from-pink-500 to-blue-500 hover:from-blue-500 hover:to-pink-500"
          >
            Login
          </button>
        </form>

        <p className="mt-4 text-center text-gray-600">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-pink-500 hover:underline">
            Sign Up
          </Link>
        </p>
      </div>

      {/* Modals */}
      <EmailModal
        isOpen={currentModal === "email"}
        onClose={closeModal}
        onEmailSubmit={handleEmailSubmit}
      />

      <OtpModal
        isOpen={currentModal === "otp"}
        onClose={closeModal}
        email={recoveryEmail}
        onSuccess={handleOtpSuccess}
      />

      <ResetPasswordModal
        isOpen={currentModal === "reset"}
        onClose={closeModal}
        userId={userId}
        email={recoveryEmail}
        onSuccess={handleResetSuccess}
      />

      <SuccessModal isOpen={currentModal === "success"} onClose={closeModal} />
    </div>
  )
}

export default Login
