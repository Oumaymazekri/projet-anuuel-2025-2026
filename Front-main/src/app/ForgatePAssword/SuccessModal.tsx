"use client"

import { LucideCheck, LucideX } from "lucide-react"

interface SuccessModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function SuccessModal({ isOpen, onClose }: SuccessModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md text-center relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700">
          <LucideX size={20} />
        </button>
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <LucideCheck className="w-8 h-8 text-green-500" />
          </div>
        </div>

        <h2 className="text-2xl font-bold text-gray-800 mb-4">Password Reset Successful!</h2>

        <p className="text-gray-600 mb-8">
          Your password has been successfully reset. You can now log in with your new password.
        </p>

        <button
          onClick={onClose}
          className="w-full px-4 py-2 text-white font-medium rounded-md bg-gradient-to-r from-pink-500 to-blue-500 hover:from-blue-500 hover:to-pink-500"
        >
          Back to Login
        </button>
      </div>
    </div>
  )
}
