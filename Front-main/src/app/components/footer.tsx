"use client";

import React from "react";
import {
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaYoutube,
  FaLinkedin,
  FaHeadphones,
  FaMobile,
  FaCamera,
  FaBatteryFull,
  FaClock,
} from "react-icons/fa";

const Footer: React.FC = () => {
  return (
    <footer className="w-full">
      {/* Upper section with improved design */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-500">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {/* Categories Section */}
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center space-x-2">
                <span>Top Categories</span>
              </h3>
              <ul className="space-y-4">
                {[
                  { icon: <FaMobile className="w-5 h-5" />, text: "Phones" },
                  { icon: <FaHeadphones className="w-5 h-5" />, text: "Headphones" },
                  { icon: <FaCamera className="w-5 h-5" />, text: "Cameras" },
                  { icon: <FaBatteryFull className="w-5 h-5" />, text: "Chargers" },
                  { icon: <FaClock className="w-5 h-5" />, text: "Watches" },
                ].map((item, index) => (
                  <li key={index}>
                    <a
                      href={`#${item.text.toLowerCase()}`}
                      className="flex items-center space-x-3 text-white/90 hover:text-white transition-colors duration-200 group"
                    >
                      <span className="transform group-hover:scale-110 transition-transform duration-200">
                        {item.icon}
                      </span>
                      <span className="text-lg">{item.text}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Help Section */}
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-white mb-6">Help Center</h3>
              <ul className="space-y-4">
                {[
                  "Frequently Asked Questions",
                  "24/7 Customer Support",
                  "Warranty Information",
                  "Easy Returns & Exchange",
                ].map((item, index) => (
                  <li key={index}>
                    <a
                      href="#"
                      className="text-white/90 hover:text-white transition-colors duration-200 text-lg block transform hover:translate-x-2"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* About Section */}
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-white mb-6">About Us</h3>
              <div className="text-white/90 space-y-4">
                <p className="leading-relaxed">
                  Were dedicated to bringing you the latest and most innovative tech accessories.
                  Our commitment to quality and customer satisfaction drives everything we do.
                </p>
                <ul className="space-y-2">
                  <li>
                    <a href="#" className="hover:text-white transition-colors duration-200 block">
                      → Our Story
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-white transition-colors duration-200 block">
                      → Join Our Team
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-white transition-colors duration-200 block">
                      → News & Updates
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            {/* Feedback Section */}
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-white mb-6">Share Your Thoughts</h3>
              <form className="space-y-4">
                <div className="relative">
                  <textarea
                    placeholder="We'd love to hear from you..."
                    rows={4}
                    className="w-full px-4 py-3 bg-white/10 rounded-lg placeholder-white/50 text-white border border-white/20 focus:border-white/40 focus:ring-2 focus:ring-white/20 transition-all duration-200 resize-none"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full px-6 py-3 bg-white text-purple-600 rounded-lg font-semibold hover:bg-opacity-90 transition-all duration-200 transform hover:translate-y-[-2px] active:translate-y-0 shadow-lg hover:shadow-xl"
                >
                  Send Feedback
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Lower section remains the same but styled with Tailwind */}
      <div className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Social Media */}
            <div className="text-center md:text-left">
              <h3 className="text-xl font-semibold mb-4">Follow Us</h3>
              <div className="flex justify-center md:justify-start space-x-4">
                {[FaFacebook, FaTwitter, FaInstagram, FaYoutube, FaLinkedin].map(
                  (Icon, index) => (
                    <a
                      key={index}
                      href="#"
                      className="text-2xl hover:text-purple-400 transition-colors duration-200"
                    >
                      <Icon />
                    </a>
                  )
                )}
              </div>
            </div>

            {/* Newsletter */}
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-4">Stay Updated</h3>
              <form className="flex flex-col sm:flex-row gap-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20"
                />
                <button
                  type="submit"
                  className="px-6 py-2 bg-purple-600 rounded-lg font-semibold hover:bg-purple-500 transition-colors duration-200"
                >
                  Subscribe
                </button>
              </form>
            </div>

            {/* Extra Links */}
            <div className="text-center md:text-right">
              <h3 className="text-xl font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                {["Terms & Conditions", "Privacy Policy", "Blog"].map((item, index) => (
                  <li key={index}>
                    <a
                      href="#"
                      className="hover:text-purple-400 transition-colors duration-200"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;