"use client"
import type React from "react"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import ProfileSidebar from "./ProfileSidebar"
import ProfileInformation from "./ProfileInformation"
import OrderHistory from "./orderHistory"
import WishlistSection from "./WishlistSection"


import NotificationSettings from "./NotificationSettings"

const ProfilePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState("profile")
  const [user, setUser] = useState({
    name: "",
    email: "",
    phone: "",
    Adress: "",
    avatar: "",
    id: "",
  })

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("accessToken")
      let userId = ""
      try {
        if (token) {
          const payload = JSON.parse(atob(token.split(".")[1]))
          userId = payload._id || ""
        }
      } catch (error) {
        console.error("Invalid token:", error)
      }

      setUser({
        name: localStorage.getItem("Full_Name") || "",
        email: localStorage.getItem("Email") || "",
        phone: localStorage.getItem("Phone_Number") || "",
        Adress: localStorage.getItem("Adress") || "",
        avatar: localStorage.getItem("image") || "",
        id: userId,
      })
    }
  }, [])

  const orders = [
    {
      id: "ORD-001",
      date: "2025-03-15",
      status: "Delivered",
      total: 249.99,
      items: [{ name: "Premium Wireless Headphones", quantity: 1, price: 249.99 }],
    },
    {
      id: "ORD-002",
      date: "2025-03-10",
      status: "Processing",
      total: 999.99,
      items: [{ name: "Ultra HD Smartphone", quantity: 1, price: 999.99 }],
    },
  ]

  const handleAddPaymentClick = () => {
    setActiveTab("SelectedPayment")
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <ProfileSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="lg:col-span-3">
            {activeTab === "profile" && <ProfileInformation user={user} />}
            {activeTab === "orders" && <OrderHistory  />}
            {activeTab === "wishlist" && <WishlistSection />}
            {activeTab === "notifications" && <NotificationSettings />}
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage
