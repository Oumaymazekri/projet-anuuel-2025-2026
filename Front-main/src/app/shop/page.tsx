'use client';

import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { FaHeart, FaStar } from 'react-icons/fa';
import { useProducts } from "../context/ProductContext";
import Image from "next/image";

type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
  rating: number;
  images?: string[];
  favorit?: boolean;
};

const categories = ["Tous", "Phones", "Audio", "Cameras", "Power", "Tablets"];

const ShopPage: React.FC = () => {
  
  const { refreshProducts ,products, loading, error } = useProducts();
  const [favorisMap, setFavorisMap] = useState<{ [productId: string]: boolean }>({});
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("Tous");
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const getCurrentCategory = () => {
    if (isClient) {
      const searchParams = new URLSearchParams(window.location.search);
      return searchParams.get("category") || "Tous";
    }
    return "Tous";
  };

  const currentCategory = getCurrentCategory();

  useEffect(() => {
    if (!loading && products.length > 0) {
      const initialFavoris: { [productId: string]: boolean } = {};
      products.forEach((product) => {
        initialFavoris[product.id] = product.favorit ?? false;
      });
      setFavorisMap(initialFavoris);
    }
  }, [loading, products]);

  useEffect(() => {
    setSelectedCategory(currentCategory);
  }, [currentCategory]);

  const filteredProducts = products.filter((product: Product) => {
    const matchesCategory =
      selectedCategory === "Tous" || product.category === selectedCategory;
    const matchesSearch =
      searchTerm.trim() === "" ||
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (product.category &&
        product.category.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
    if (isClient) {
      const params = new URLSearchParams(window.location.search);
      params.set('category', category);
      router.push(`?${params.toString()}`);
    }
  };

  const handleProductClick = (productId: string) => {
    router.push(`/details_product/${productId}`);
  };

const handleFavoriToggle = async (e: React.MouseEvent, productId: string) => {
  e.stopPropagation();

  const newFavorit = !favorisMap[productId];

  setFavorisMap((prev) => ({
    ...prev,
    [productId]: newFavorit,
  }));

  try {
    const response = await fetch(`http://localhost:3001/products/UpdateProduct/${productId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ favorit: newFavorit }),
    });

    if (!response.ok) {
      throw new Error("Erreur lors de la mise à jour du produit");
    }

    const updatedProduct = await response.json();
    console.log("Produit mis à jour :", updatedProduct);

    // 👉 Rafraîchir les produits du contexte pour que le changement soit globalement visible
    await refreshProducts();
  } catch (err) {
    console.error("Erreur lors de la mise à jour du favori :", err);
  }
};


  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {error && <div className="text-red-500 text-center mb-4">{error}</div>}

        <div className="mb-6 flex justify-center">
          <input
            type="text"
            placeholder="Rechercher un produit..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all w-full max-w-md"
          />
        </div>

        <nav className="flex justify-center space-x-4 mb-12 flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => handleCategoryClick(category)}
              className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 transform hover:scale-105 ${
                selectedCategory === category
                  ? "bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white shadow-lg"
                  : "bg-white text-gray-600 hover:bg-gray-50 shadow"
              }`}
            >
              {category}
            </button>
          ))}
        </nav>

        {loading ? (
          <div className="text-center text-gray-600">Chargement des produits...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence>
              {filteredProducts.map((product: Product) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="relative group cursor-pointer"
                  onClick={() => handleProductClick(product.id)}
                >
                  <div className="bg-white rounded-2xl shadow-lg overflow-hidden transition-transform duration-300 transform hover:-translate-y-2">
                    <div className="relative h-64 overflow-hidden">
                      <Image
                        src={
                          product?.images?.[0]
                            ? `http://localhost/images/products/${product.images[0]}`
                            : "/placeholder.jpeg"
                        }
                        alt={product.name}
                        className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-110"
                        fill
                        unoptimized
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <button
                        onClick={(e) => handleFavoriToggle(e, product.id)}
                        className="absolute top-4 right-4 p-2 bg-white/90 rounded-full shadow-lg transform transition-transform duration-300 hover:scale-110 z-10"
                      >
                        {favorisMap[product.id] ? (
                          <FaHeart className="w-5 h-5 text-pink-500" />
                        ) : (
                          <FaHeart className="w-5 h-5 text-gray-300" />
                        )}
                      </button>
                    </div>

                    <div className="p-6">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {product.name}
                      </h3>
                      <div className="flex items-center mt-2">
                        {[...Array(5)].map((_, i) => (
                          <FaStar
                            key={i}
                            className={`w-4 h-4 ${
                              i < Math.round(product.rating)
                                ? "text-yellow-400"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <p className="text-lg font-bold text-blue-600 mt-2">
                        ${product.price}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShopPage;
