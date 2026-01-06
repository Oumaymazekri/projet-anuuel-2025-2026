"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/app/lib/authContext";
import { useRouter } from "next/navigation"
import {
  FaUser,
  FaEdit,
  FaBox,
  FaHeart,
  FaCreditCard,
  FaBell,
  FaSignOutAlt,
} from "react-icons/fa";
import Image from "next/image";

interface User {
  name: string;
  email: string;
  avatar: string;
}

interface ProfileSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const ProfileSidebar: React.FC<ProfileSidebarProps> = ({
  activeTab,
  setActiveTab,
}) => {
  const { logout } = useAuth();
  const router = useRouter()
  const [user, setUser] = useState<User>({
    name: "",
    email: "",
    avatar: "/default-avatar.png",
  });

  useEffect(() => {
    const fullName = localStorage.getItem("Full_Name");
    const email = localStorage.getItem("Email");
    const image = localStorage.getItem("image");

    if (fullName && email) {
      setUser({
        name: fullName,
        email: email,
        avatar: image || "/default-avatar.png",
      });
    }
  }, []);
     
    const handleLogout = () => {
        // Use the logout function from context
        logout();
        router.push("/");
    };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="lg:col-span-1"
    >
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex flex-col items-center">
          <div className="relative">
            <Image
              src={`http://localhost/images/users/${user.avatar}`}
              alt={user.name}
              width={128}
              height={128}
              className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
              unoptimized
            />
            <button className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full shadow-lg hover:bg-blue-700 transition-colors">
              <FaEdit className="w-4 h-4" />
            </button>
          </div>
          <h2 className="mt-4 text-xl font-bold text-gray-900">{user.name}</h2>
          <p className="text-gray-500">{user.email}</p>
        </div>

        <nav className="mt-8 space-y-2">
          {[
            { id: "profile", icon: FaUser, label: "Profile" },
            { id: "orders", icon: FaBox, label: "Orders" },
            { id: "wishlist", icon: FaHeart, label: "Wishlist" },
            
            { id: "notifications", icon: FaBell, label: "Notifications" },
          ].map(({ id, icon: Icon, label }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`w-full flex items-center px-4 py-2 rounded-lg transition-colors ${
                activeTab === id
                  ? "bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <Icon className="w-5 h-5 mr-3" />
              {label}
            </button>
          ))}
        </nav>

        <div className="mt-8 pt-8 border-t border-gray-200">
          <button className="w-full flex items-center px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" onClick={handleLogout}>
            <FaSignOutAlt className="w-5 h-5 mr-3" />
            Sign Out
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProfileSidebar;
