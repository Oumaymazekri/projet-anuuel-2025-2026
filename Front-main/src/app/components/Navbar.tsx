"use client"
import { useState } from 'react';
import Link from "next/link";
import SearchBar from "./SearchBar";
import NavIcons from "./NavIcons";
import { Menu as MenuIcon, ShoppingBag } from "lucide-react";
import { useAuth } from "@/app/lib/authContext";
import { useRouter } from "next/navigation"

const Navbar = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const { isAuthenticated, logout } = useAuth();
    const router = useRouter()
    const toggleMenu = () => setMenuOpen(!menuOpen);

    const handleProfile = () => {
        setIsProfileOpen(!isProfileOpen);
    }
    
    const handleLogout = () => {
        // Use the logout function from context
        logout();
        router.push("/");
    };
    
    return (
        <div className="h-20 w-full relative bg-slate-800 shadow-md">

            {/* Mobile view */}
            <div className="h-full flex items-center justify-between md:hidden px-4">
                {/* Left content: Logo and Title */}
                <Link href="/" className="text-gray-200 hover:text-[#F35C7A] transition-colors">
                    <ShoppingBag className="w-6 h-6 text-[#F35C7A]" />
                    <span className="text-2xl tracking-wide text-white">T&O</span>
                </Link>

                {/* Right content: Menu icon for mobile */}
                <div className="flex items-center gap-4">
                    <button onClick={toggleMenu} className="p-1">
                        <MenuIcon className="w-6 h-6 text-gray-200 hover:text-white" />
                    </button>
                </div>
            </div>

            {/* Mobile menu dropdown */}
            {menuOpen && (
                <div className="absolute top-20 left-0 right-0 bg-white w-full flex flex-col items-center gap-4 py-4 shadow-lg z-50 md:hidden">
                    <Link href="/" className="hover:text-[#F35C7A] transition-colors">Homepage</Link>
                    <Link href="/shop" className="hover:text-[#F35C7A] transition-colors">Shop</Link>
                    <Link href="/about" className="hover:text-[#F35C7A] transition-colors">About</Link>
                    <Link href="/contact" className="hover:text-[#F35C7A] transition-colors">Contact</Link>
                </div>
            )}

            {/* Desktop view */}
            <div className="hidden md:flex items-center justify-between gap-8 h-full px-8 lg:px-16 xl:px-24">
                {/* Left content: Logo and Links */}
                <div className="flex items-center gap-6">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-3">
                        <ShoppingBag className="w-8 h-8 text-[#F35C7A]" />
                        <span className="text-2xl tracking-wide text-white">T&O</span>
                    </Link>

                    {/* Navigation Links */}
                    <div className="hidden xl:flex gap-6">
                        <Link href="/" className="text-gray-200 hover:text-[#F35C7A] transition-colors">Homepage</Link>
                        <Link href="/shop" className="text-gray-200 hover:text-[#F35C7A] transition-colors">Shop</Link>
                        <Link href="/about" className="text-gray-200 hover:text-[#F35C7A] transition-colors">About</Link>
                        <Link href="/contact" className="text-gray-200 hover:text-[#F35C7A] transition-colors">Contact</Link>
                    </div>
                </div>

                {/* Center content: SearchBar and NavIcons */}
                <div className="flex items-center justify-end gap-8 flex-1">
                    <SearchBar />
                    <NavIcons />
                </div>

                {/* Right content: Login/Signup or Profile Button */}
                <div className="flex gap-4">
                    {isAuthenticated ? (
                       <div className="relative">
                       <svg
                           className="w-6 h-6 cursor-pointer text-white hover:text-gray-200"
                           onClick={handleProfile}
                           fill="none"
                           stroke="currentColor"
                           viewBox="0 0 24 24"
                           xmlns="http://www.w3.org/2000/svg"
                       >
                           <path
                               strokeLinecap="round"
                               strokeLinejoin="round"
                               strokeWidth={2}
                               d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                           />
                       </svg>
                       {isProfileOpen && (
                           <div className="absolute top-10 right-0 p-4 rounded-md text-sm shadow-lg bg-white z-20 min-w-[120px]">
                               <Link href="/profile" className="block py-2 hover:text-gray-600">
                                   Profile
                               </Link>
                               <div 
                                   className="mt-2 cursor-pointer py-2 hover:text-gray-600"
                                   onClick={handleLogout}
                               >
                                   Logout
                               </div>
                           </div>
                       )}
                   </div>
                   
                    ) : (
                        <>  
                            <Link href="/login">
                                <button className="px-4 py-2 text-white font-medium rounded-md bg-gradient-to-r from-pink-500 to-blue-500 hover:from-blue-500 hover:to-pink-500 transition-all duration-300">
                                    Login
                                </button>
                            </Link>
                            <Link href="/signup">
                                <button className="px-4 py-2 text-white font-medium rounded-md bg-gradient-to-r from-pink-500 to-blue-500 hover:from-blue-500 hover:to-pink-500 transition-all duration-300">
                                    Sign Up
                                </button>
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Navbar;