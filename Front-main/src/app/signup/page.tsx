"use client"
import type React from "react"
import { useState, useRef } from "react"
import Link from "next/link"
import { Upload, User, Mail, Lock, Phone, MapPin } from "lucide-react"
import Image from "next/image";

const Signup = () => {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    Full_Name: "",
    Email: "",
    Password: "",
    ConfirmPassword: "",
    Phone_Number: "",
    Adress: "",
    image: null as File | null,
  })

  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [isUploading, setIsUploading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target
    setFormData({ ...formData, [id]: value })
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = () => {
      setImagePreview(reader.result as string)
    }
    reader.readAsDataURL(file)

    setFormData((prev) => ({ ...prev, image: file }))
    setIsUploading(true)
    setTimeout(() => setIsUploading(false), 1500)
  }

  const handleImageClick = () => {
    fileInputRef.current?.click()
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    if (formData.Password !== formData.ConfirmPassword) {
      setError("Passwords do not match.")
      return
    }

    const form = new FormData()
    form.append("Full_Name", formData.Full_Name)
    form.append("Email", formData.Email)
    form.append("Password", formData.Password)
    form.append("Phone_Number", formData.Phone_Number)
    form.append("Adress", formData.Adress)
    if (formData.image) {
      form.append("image", formData.image)
    }

    try {
      const response = await fetch("http://localhost/api/auth/register", {
        method: "POST",
        body: form,
      })

      if (!response.ok) {
        const errorData = await response.json()
        setError(errorData.message || "An error occurred during registration.")
      } else {
        setSuccess("Registration successful!")
        setFormData({
          Full_Name: "",
          Email: "",
          Password: "",
          ConfirmPassword: "",
          Phone_Number: "",
          Adress: "",
          image: null,
        })
        setImagePreview(null)
      }
    } catch (error) {
      setError("Failed to connect to the server. Please try again.")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-200 to-blue-200 p-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Create Your Account</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Image Upload */}
          <div className="flex flex-col items-center mb-6">
            <div
              onClick={handleImageClick}
              className="relative w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center cursor-pointer overflow-hidden border-2 border-dashed border-gray-300 hover:border-pink-400 transition-colors"
            >
              {imagePreview ? (
                <Image
                  src={imagePreview}
                  alt="Profile preview"
                  className="w-full h-full object-cover"
                  unoptimized
                />
              ) : (
                <Upload className="text-gray-400" size={24} />
              )}
              {isUploading && (
                <div className="absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
            </div>
            <input type="file" ref={fileInputRef} onChange={handleImageChange} accept="image/*" className="hidden" />
            <p className="text-sm text-gray-500 mt-2">Upload profile picture</p>
          </div>

          {/* Full Name */}
          <div className="relative">
            <label htmlFor="Full_Name" className="block text-gray-600 font-medium mb-2">
              Full Name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                id="Full_Name"
                value={formData.Full_Name}
                onChange={handleChange}
                className="w-full pl-10 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500 focus:outline-none"
                placeholder="Enter your full name"
                required
              />
            </div>
          </div>

          {/* Email */}
          <div className="relative">
            <label htmlFor="Email" className="block text-gray-600 font-medium mb-2">
              Email Adress
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="email"
                id="Email"
                value={formData.Email}
                onChange={handleChange}
                className="w-full pl-10 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="Enter your email"
                required
              />
            </div>
          </div>

          {/* Phone */}
          <div className="relative">
            <label htmlFor="Phone_Number" className="block text-gray-600 font-medium mb-2">
              Phone Number
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Phone className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="tel"
                id="Phone_Number"
                value={formData.Phone_Number}
                onChange={handleChange}
                className="w-full pl-10 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500 focus:outline-none"
                placeholder="Enter your phone number"
                required
              />
            </div>
          </div>

          {/* Adress */}
          <div className="relative">
            <label htmlFor="Adress" className="block text-gray-600 font-medium mb-2">
              Adress
            </label>
            <div className="relative">
              <div className="absolute top-3 left-3 pointer-events-none">
                <MapPin className="h-5 w-5 text-gray-400" />
              </div>
              <textarea
                id="Adress"
                value={formData.Adress}
                onChange={handleChange}
                className="w-full pl-10 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="Enter your Adress"
                rows={2}
                required
              />
            </div>
          </div>

          {/* Password */}
          <div className="relative">
            <label htmlFor="Password" className="block text-gray-600 font-medium mb-2">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="password"
                id="Password"
                value={formData.Password}
                
                onChange={handleChange}
                className="w-full pl-10 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500 focus:outline-none"
                placeholder="Enter your password"
                required
              />
            </div>
          </div>

          {/* Confirm Password */}
          <div className="relative">
            <label htmlFor="ConfirmPassword" className="block text-gray-600 font-medium mb-2">
              Confirm Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="password"
                id="ConfirmPassword"
                value={formData.ConfirmPassword}
                onChange={handleChange}
                className="w-full pl-10 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500 focus:outline-none"
                placeholder="Confirm your password"
                required
              />
            </div>
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}
          {success && <p className="text-green-500 text-sm">{success}</p>}

          {/* Submit */}
          <button
            type="submit"
            className="w-full px-4 py-3 text-white font-medium rounded-md bg-gradient-to-r from-pink-500 to-blue-500 hover:from-blue-600 hover:to-pink-500 transition-all duration-300 transform hover:scale-[1.02]"
          >
            Create Account
          </button>
        </form>

        <p className="mt-6 text-center text-gray-600">
          Already have an account?{" "}
          <Link href="/login" className="text-pink-500 hover:underline font-medium">
            Login
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Signup
