"use client"
import Link from "next/link"
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa"
import { useCart } from "../context/CartContext"
import { useProducts, type Product } from "../context/ProductContext"
import Image from "next/image";
const ProductList = () => {
  const { products, loading, error } = useProducts()
  const { addToCart } = useCart()

  const renderStars = (rating: number) => {
    const stars = []
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 >= 0.5

    // Add full stars
    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={`star-${i}`} className="w-5 h-5 text-yellow-400 transition-transform hover:scale-110" />)
    }

    // Add half star if needed
    if (hasHalfStar) {
      stars.push(
        <FaStarHalfAlt key="half-star" className="w-5 h-5 text-yellow-400 transition-transform hover:scale-110" />,
      )
    }

    // Add empty stars
    const emptyStars = 5 - Math.ceil(rating)
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <FaRegStar key={`empty-star-${i}`} className="w-5 h-5 text-yellow-400 transition-transform hover:scale-110" />,
      )
    }

    return (
      <div className="flex items-center gap-1">
        <div className="flex gap-0.5">{stars}</div>
        <span className="ml-2 text-sm font-medium text-gray-600">{rating.toFixed(1)}</span>
      </div>
    )
  }

  const handleAddToCart = (product: Product) => {
    addToCart(product)
  }

  if (loading) {
    return (
      <div className="mt-12 flex justify-center items-center h-40">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="mt-12 text-center text-red-500">
        <p>Erreur: {error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Réessayer
        </button>
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div className="mt-12 text-center text-gray-500">
        <p>Aucun produit disponible pour le moment.</p>
      </div>
    )
  }

  // Limiter à 6 produits seulement
  const limitedProducts = products.slice(0, 6)

  return (
    <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {limitedProducts.map((product) => (
        <div
          key={product.id}
          className="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
        >
          {/* Image and product link */}
          <Link href={`/details_product/${product.id}`}>
            <div className="relative w-full h-80 overflow-hidden">
              <Image
                src={
                  product.images && product.images.length > 0
                    ? `http://localhost/images/products/${product.images[0]}`
                    : "/placeholder.svg"
                }
                alt={product.name}
                className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                width={122}
                height={122}
                unoptimized
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          </Link>

          {/* Product info */}
          <div className="p-6">
            <div className="flex justify-between items-start mb-3">
              <Link href={`/details_product/${product.id}`}>
                <h3 className="text-xl font-semibold text-gray-800 hover:text-blue-600 transition-colors duration-300">
                  {product.name}
                </h3>
              </Link>
              <span className="px-3 py-1 bg-blue-100 text-blue-600 text-sm font-medium rounded-full">New</span>
            </div>

            <p className="text-gray-600 text-sm leading-relaxed min-h-[3rem] mb-4">
              {product.description || "Description non disponible"}
            </p>

            <div className="space-y-4">
              {/* Rating */}
              <div className="flex items-center">{renderStars(product.rating || 0)}</div>

              {/* Price and CTA */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <span className="text-2xl font-bold text-gray-900">
                  {typeof product.price === "number" ? `${product.price.toFixed(2)} TND` : "Prix non disponible"}
                </span>
              
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default ProductList

