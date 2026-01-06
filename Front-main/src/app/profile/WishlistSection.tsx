"use client"
import { useState, useEffect } from "react"
import { FaHeart, FaRegHeart } from 'react-icons/fa'
import { useProducts } from '../context/ProductContext'
import Image from "next/image"
import { useRouter } from "next/navigation"

const WishlistSection: React.FC = () => {
  const [favorisMap, setFavorisMap] = useState<{ [productId: string]: boolean }>({})
  const { products, loading, error } = useProducts()
  const router = useRouter()

  // Initialiser favorisMap une fois les produits chargés
  useEffect(() => {
    if (!loading && products.length > 0) {
      const initialFavoris: { [productId: string]: boolean } = {}
      products.forEach((product) => {
        initialFavoris[product.id] = product.favorit ?? false
      })
      setFavorisMap(initialFavoris)
    }
  }, [loading, products])

  // Produits favoris basés sur favorisMap (pas directement sur product.favorit)
  const favorites = products.filter(product => favorisMap[product.id])

  // Redirection vers la page de détails
  const handleClickProduct = (id: string) => {
    router.push(`/details_product/${id}`)
  }

  // Gestion du clic sur le cœur
  const handleFavoriToggle = async (e: React.MouseEvent, productId: string) => {
    e.stopPropagation()

    const newFavorit = !favorisMap[productId]

    // Mettre à jour localement
    setFavorisMap(prev => ({
      ...prev,
      [productId]: newFavorit
    }))

    // Envoyer la mise à jour au backend
    try {
      const response = await fetch(`http://localhost/products/UpdateProduct/${productId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ favorit: newFavorit }),
      })

      if (!response.ok) {
        throw new Error("Erreur lors de la mise à jour du produit")
      }

      const updatedProduct = await response.json()
      console.log("Produit mis à jour :", updatedProduct)
    } catch (err) {
      console.error("Erreur lors de la mise à jour du favori :", err)
    }
  }

  // Affichage
  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6 text-center text-gray-500">
        Loading your wishlist...
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6 text-center text-red-500">
        Failed to load wishlist: {error}
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h3 className="text-2xl font-bold text-gray-900 mb-6">My Wishlist</h3>

      {favorites.length === 0 ? (
        <div className="text-center text-gray-500 py-8">
          <FaHeart className="w-12 h-12 mx-auto text-gray-300 mb-4" />
          <p>Your wishlist is empty</p>
          <button className="mt-4 px-6 py-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white rounded-lg shadow-lg hover:shadow-xl transition-shadow">
            Browse Products
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {favorites.map((product) => (
            <div
              key={product.id}
              className="flex items-center gap-4 p-4 border rounded-xl shadow-sm hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => handleClickProduct(product.id)}
            >
              <Image
                src={
                  product.images && product.images.length > 0
                    ? `http://localhost/images/products/${product.images[0]}`
                    : "/placeholder.svg"
                }
                alt={product.name}
                className="w-20 h-20 object-cover rounded-lg"
                unoptimized
                width={122}
                height={122}
              />
              <div className="flex-1">
                <h4 className="text-lg font-semibold text-gray-800">{product.name}</h4>
                <p className="text-sm text-gray-500">${product.price}</p>
              </div>
              <button
                onClick={(e) => handleFavoriToggle(e, product.id)}
                className="text-pink-500 focus:outline-none"
                aria-label="Toggle favorite"
              >
                {favorisMap[product.id] ? <FaHeart /> : <FaRegHeart />}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default WishlistSection
