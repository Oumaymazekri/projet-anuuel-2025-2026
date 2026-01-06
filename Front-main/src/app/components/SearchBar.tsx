"use client";

import type React from "react";
import Image from "next/image";
import { Search, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { useProducts } from "../context/ProductContext";

const SearchBar = () => {
  const router = useRouter();
  const { products } = useProducts();
  const [isFocused, setIsFocused] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Filtrer les produits en fonction du terme de recherche
  const filteredProducts =
    searchTerm.trim() !== ""
      ? products
          .filter((product) => {
            const searchLower = searchTerm.toLowerCase().trim();
            const nameLower = product.name.toLowerCase();
            const categoryLower = (product.category || "").toLowerCase();

            // Vérifier si le terme de recherche est dans le nom ou la catégorie
            return (
              nameLower.includes(searchLower) ||
              categoryLower.includes(searchLower)
            );
          })
          .slice(0, 4) // Limiter à 4 résultats pour la prévisualisation
      : [];

  // Fermer les résultats si on clique en dehors
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setShowResults(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Gérer la soumission du formulaire
  function handleSearch(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (searchTerm.trim()) {
      router.push(`/shop?search=${encodeURIComponent(searchTerm.trim())}`);
      setShowResults(false);
    }
  }

  // Gérer le clic sur un produit
  function handleProductClick(productId: string) {
    router.push(`/details_product/${productId}`);
    setShowResults(false);
    setSearchTerm("");
  }

  // Gérer le changement dans l'input
  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    setSearchTerm(value);
    setShowResults(value.trim().length > 0);
  }

  // Effacer la recherche
  function clearSearch() {
    setSearchTerm("");
    setShowResults(false);
  }

  return (
    <div className="relative w-full max-w-md" ref={searchRef}>
      <form
        className={`flex items-center gap-3 bg-white rounded-full px-4 py-2 w-full transition-all duration-200 border-2 ${
          isFocused ? "border-[#F35C7A] shadow-md" : "border-gray-200"
        }`}
        onSubmit={handleSearch}
      >
        <Search
          className={`w-5 h-5 transition-colors duration-200 ${
            isFocused ? "text-[#F35C7A]" : "text-gray-400"
          }`}
        />
        <input
          type="text"
          name="name"
          value={searchTerm}
          onChange={handleInputChange}
          placeholder="Search for accessories..."
          className="flex-1 bg-transparent outline-none text-sm"
          onFocus={() => {
            setIsFocused(true);
            if (searchTerm.trim()) setShowResults(true);
          }}
          onBlur={() => setIsFocused(false)}
        />
        {searchTerm && (
          <button
            type="button"
            onClick={clearSearch}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-4 h-4" />
          </button>
        )}
        <button
          type="submit"
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
            isFocused
              ? "bg-[#F35C7A] text-white"
              : "bg-gray-100 text-gray-500 hover:bg-gray-200"
          }`}
        >
          Search
        </button>
      </form>

      {/* Résultats de recherche */}
      {showResults && searchTerm.trim() && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg z-50 overflow-hidden">
          {filteredProducts.length > 0 ? (
            <>
              <div className="p-2">
                {filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-md cursor-pointer transition-colors"
                    onClick={() => handleProductClick(product.id)}
                  >
                    <div className="w-12 h-12 relative rounded overflow-hidden flex-shrink-0">
                      <Image
                        src={
                          product.images && product.images.length > 0
                            ? `http://localhost/images/products/${product.images[0]}`
                            : "/placeholder.svg"
                        }
                        alt={product.name}
                        className="object-cover w-full h-full"
                        width={122}
                        height={122}
                        unoptimized
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm text-gray-800 truncate">
                        {product.name}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {product.category || "Non catégorisé"}
                      </p>
                    </div>
                    <div className="text-sm font-bold text-[#F35C7A]">
                      ${product.price.toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-2 border-t">
                <button
                  onClick={() =>
                    router.push(
                      `/shop?search=${encodeURIComponent(searchTerm.trim())}`
                    )
                  }
                  className="w-full text-center text-sm text-blue-600 hover:text-blue-800 py-1"
                >
                  Voir tous les résultats
                </button>
              </div>
            </>
          ) : (
            <div className="p-4 text-center text-gray-500">
              Aucun produit trouvé pour {searchTerm.trim()}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
