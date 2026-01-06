"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from 'next/navigation'; 
import Link from "next/link"
const Slides = [
  {
    id: 1,
    title: "Wireless Earbuds",
    description: "Premium Sound Experience",
    images: ["https://images.unsplash.com/photo-1590658268037-6bf12165a8df?q=80&w=2070&auto=format&fit=crop"],
    width: 1200,
    height: 800,
    color: "from-purple-100 via-purple-50 to-transparent",
  },
  {
    id: 2,
    title: "Smart Watches",
    description: "Stay Connected in Style",
    images: ["https://images.unsplash.com/photo-1617043786394-f977fa12eddf?q=80&w=2070&auto=format&fit=crop"],
    width: 1200,
    height: 800,
    color: "from-blue-100 via-blue-50 to-transparent",
  },
  {
    id: 3,
    title: "Premium Cases",
    description: "Ultimate Protection",
    images: ["https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?q=80&w=2329&auto=format&fit=crop"],
    width: 1200,
    height: 800,
    color: "from-gray-100 via-gray-50 to-transparent",
  },
  {
    id: 4,
    title: "Power Banks",
    description: "Never Run Out of Power",
    images: ["https://images.unsplash.com/photo-1618410320928-25228d811631?q=80&w=2070&auto=format&fit=crop"],
    width: 1200,
    height: 800,
    color: "from-green-100 via-green-50 to-transparent",
  },
];

const Slider = () => {
  const [current, setCurrent] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const router = useRouter();
  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrent((prev) => (prev + 1) % Slides.length);
        setIsTransitioning(false);
      }, 300);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Background gradient overlay */}
      <div className={`absolute inset-0 bg-gradient-to-r ${Slides[current].color} z-10 transition-colors duration-700`} />

      {/* Background image */}
      <div className="absolute top-0 right-0 w-2/3 h-full">
        <Image
          src={Slides[current].images[0]}
          alt={Slides[current].title}
          fill
          className={`object-cover transition-all duration-700 ${
            isTransitioning ? "opacity-0 scale-105" : "opacity-100 scale-100"
          }`}
          priority
        />
      </div>

      {/* Content */}
      <div className="relative z-20 h-full flex items-center">
        <div className="container mx-auto px-8">
          <div className="max-w-xl space-y-8">
            <div className={`space-y-4 transition-all duration-500 ${
              isTransitioning ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0"
            }`}>
              <h2 className="text-xl font-medium text-gray-600 tracking-wide uppercase">
                {Slides[current].description}
              </h2>
              <h1 className="text-7xl font-bold text-gray-900 leading-tight">
                {Slides[current].title}
              </h1>
              <p className="text-lg text-gray-600 mt-4">
                Discover our latest collection of premium accessories
              </p>
            </div>
            <br></br>
            <Link href="/shop">
            <button 
            className="px-10 py-5 bg-black text-white rounded-full hover:bg-gray-800 transition-all duration-300 font-medium tracking-wide text-lg transform hover:scale-105">
              Shop Collection
              
            </button>
            </Link>
            {/* Navigation dots */}
            <div className="flex space-x-3 pt-12">
              {Slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setIsTransitioning(true);
                    setTimeout(() => {
                      setCurrent(index);
                      setIsTransitioning(false);
                    }, 300);
                  }}
                  className={`h-2 rounded-full transition-all duration-500 ${
                    index === current 
                      ? "bg-black w-20" 
                      : "bg-gray-300 hover:bg-gray-400 w-12"
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function Home() {
  return <Slider />;
}