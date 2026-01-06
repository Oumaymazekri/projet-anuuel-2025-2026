"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Phone,
  Headphones,
  Camera,
  Battery,
  Tablet,
  Laptop,
  Gamepad,
  Apple
} from 'lucide-react';

interface Category {
  icon: React.ReactNode;
  name: string;
  description: string;
  color: string;
  shopCategory: string;
}

const CategorySelection: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const router = useRouter(); // ✅ fixed this line

  const categories: Category[] = [
    {
      icon: <Phone className="w-8 h-8" />,
      name: "Phones",
      description: "Latest Smartphones",
      color: "from-pink-500 to-rose-500",
      shopCategory: "Phones",
    },
    {
      icon: <Headphones className="w-8 h-8" />,
      name: "Audio",
      description: "Premium Sound",
      color: "from-purple-500 to-indigo-500",
      shopCategory: "Audio",
    },
    {
      icon: <Camera className="w-8 h-8" />,
      name: "Cameras",
      description: "Pro Photography",
      color: "from-blue-500 to-cyan-500",
      shopCategory: "Cameras",
    },
    {
      icon: <Battery className="w-8 h-8" />,
      name: "Power",
      description: "Fast Charging",
      color: "from-green-500 to-emerald-500",
      shopCategory: "Power",
    },
    {
      icon: <Tablet className="w-8 h-8" />,
      name: "Tablets",
      description: "Touch Computing",
      color: "from-orange-500 to-amber-500",
      shopCategory: "Tablets",
    },
    {
      icon: <Laptop className="w-8 h-8" />,
      name: "Laptops",
      description: "Portable Power",
      color: "from-red-500 to-pink-500",
      shopCategory: "Tous",
    },
    {
      icon: <Gamepad className="w-8 h-8" />,
      name: "Gaming",
      description: "Play More",
      color: "from-violet-500 to-purple-500",
      shopCategory: "Tous",
    },
    {
      icon: <Apple className="w-8 h-8" />,
      name: "Apple",
      description: "iOS Ecosystem",
      color: "from-gray-700 to-gray-900",
      shopCategory: "Tous",
    },
  ];

  const handleCategoryClick = (category: string) => {
    router.push(`/shop?category=${category}`); // ✅ fixed this line
  };

  return (
    <div className="py-16 px-4 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent mb-4">
            Explore Categories
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Discover our wide range of premium tech accessories and gadgets
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {categories.map((category, index) => (
            <div
              key={index}
              className="group relative"
              onMouseEnter={() => setActiveIndex(index)}
              onClick={() => handleCategoryClick(category.shopCategory)}
            >
              <div
                className={`relative overflow-hidden rounded-2xl p-6
                  bg-gradient-to-br ${category.color}
                  transform transition-all duration-300
                  group-hover:scale-105 group-hover:shadow-xl
                  cursor-pointer`}
              >
                {/* Icon Container */}
                <div
                  className="flex items-center justify-center w-16 h-16 mx-auto mb-4
                    bg-white/20 rounded-full backdrop-blur-sm
                    transform transition-transform duration-300 group-hover:rotate-12"
                >
                  {category.icon}
                </div>

                {/* Category Info */}
                <div className="text-center text-white">
                  <h3 className="font-bold text-xl mb-1">{category.name}</h3>
                  <p className="text-sm text-white/80">{category.description}</p>
                </div>

                {/* Hover Overlay */}
                <div
                  className="absolute inset-0 rounded-2xl
                    bg-gradient-to-t from-black/50 to-transparent
                    opacity-0 group-hover:opacity-100
                    transition-opacity duration-300"
                />

                {/* "NEW" Badge */}
                {index === activeIndex && (
                  <div
                    className="absolute top-4 right-4
                      bg-white text-purple-600
                      px-3 py-1 rounded-full
                      text-xs font-bold animate-pulse"
                  >
                    NEW
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategorySelection;
