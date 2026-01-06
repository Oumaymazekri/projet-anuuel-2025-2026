"use client"
import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { useCart } from "../../context/CartContext"
import Toast from "../../components/Toats"

const ProductDetails = () => {
  const params = useParams()
  const router = useRouter()
  const productId = params.id
  const { addToCart, items } = useCart()

  const [product, setProduct] = useState(null)
  const [selectedImage, setSelectedImage] = useState("")
  const [isHovering, setIsHovering] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [addedToCart, setAddedToCart] = useState(false)
  const [showToast, setShowToast] = useState(false)

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await fetch(`http://localhost/products/GetProductById/${productId}`, {
          method: "GET",
          
          
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message || "Erreur lors du chargement du produit.")
        }

        const data = await response.json()
        console.log("Product data:", data)
        setProduct(data)

        // Set the first image as the selected image
        if (data.images && data.images.length > 0) {
          setSelectedImage(`http://localhost/images/products/${data.images[0]}`)
        }
      } catch (err) {
        setError(err.message || "Échec de la connexion au serveur.")
      } finally {
        setLoading(false)
      }
    }

    if (productId) {
      fetchProductDetails()
    }
  }, [productId])

  const handleImageHover = (image) => {
    setSelectedImage(`http://localhost/images/products/${image}`)
  }

  const handleAddToCart = () => {
    if (product) {
      console.log("Adding to cart:", product)

      // Create a modified product object with the correct image URL format
      const cartProduct = {
        id: product.id,
        name: product.name,
        price: product.price,
        images: product.images,
        stock: product.stock,
        category: product.category,
        description:product.description
      }

      addToCart(cartProduct)
      setAddedToCart(true)
      setShowToast(true)

      // Log the cart items after adding
      console.log("Cart items after adding:", items)

      // Store in localStorage directly as a backup
      const currentCart = JSON.parse(localStorage.getItem("cart") || "[]")
      const existingItemIndex = currentCart.findIndex((item) => item.id === product.id)

      if (existingItemIndex >= 0) {
        currentCart[existingItemIndex].quantity += 1
      } else {
        currentCart.push({
          id: product.id,
          name: product.name,
          price: product.price,
          quantity: 1,
          image:
            product.images && product.images.length > 0
              ? `http://localhost/images/products/${product.images[0]}`
              : "/placeholder.svg",
        })
      }

      localStorage.setItem("cart", JSON.stringify(currentCart))
      console.log("Cart saved directly to localStorage:", currentCart)

      // Redirect after a delay
      setTimeout(() => {
        router.push("/shopping_cart")
      }, 2000)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement du produit...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
          <h2 className="text-2xl font-bold text-red-500 mb-4">Erreur</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link href="/shop">
            <button className="w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-pink-500 text-white font-medium rounded-lg">
              Retour à la boutique
            </button>
          </Link>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Produit non trouvé</h2>
          <p className="text-gray-600 mb-6">Le produit que vous recherchez n&aposexiste pas ou a été supprimé.</p>
          <Link href="/shop">
            <button className="w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-pink-500 text-white font-medium rounded-lg">
              Retour à la boutique
            </button>
          </Link>
        </div>
      </div>
    )
  }

  // Parse features if they're in a string format
  const features = product.caracteristique ? product.caracteristique.split(", ") : []

  return (
    <>
      <div className="bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 p-6">
            {/* Image Gallery */}
            <div className="space-y-4">
              {/* Main Image with zoom effect */}
              <div
                className="relative overflow-hidden rounded-lg bg-gray-100"
                style={{ height: "400px" }}
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
              >
                <div
                  className="w-full h-full transition-transform duration-500 ease-out"
                  style={{
                    transform: isHovering ? "scale(1.15)" : "scale(1)",
                    backgroundImage: `url(${selectedImage})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                />
              </div>

              {/* Thumbnails */}
              <div className="flex gap-3 overflow-x-auto pb-2">
                {product.images &&
                  product.images.map((img, index) => (
                    <div
                      key={index}
                      className={`relative w-20 h-20 rounded-md overflow-hidden cursor-pointer transition-all duration-300 ${
                        selectedImage === `http://localhost/images/products/${img}`
                          ? "ring-2 ring-blue-500 ring-offset-2"
                          : "hover:opacity-80"
                      }`}
                      onMouseOver={() => handleImageHover(img)}
                    >
                      <div
                        className="w-full h-full"
                        style={{
                          backgroundImage: `url(http://localhost/images/products/${img})`,
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                        }}
                      />
                    </div>
                  ))}
              </div>
            </div>

            {/* Product Details */}
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
                <div className="mt-2 flex items-center">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`w-5 h-5 ${i < 4 ? "text-yellow-400" : "text-gray-300"}`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="ml-2 text-sm text-gray-600">4.0 ({Math.floor(Math.random() * 200) + 50} avis)</span>
                </div>
              </div>

              <div className="space-y-4 border-t border-b py-4">
                {product.taille && (
                  <div className="flex justify-between">
                    <span className="text-gray-700">Taille</span>
                    <span className="font-medium text-gray-900">{product.taille}</span>
                  </div>
                )}
                {product.marque && (
                  <div className="flex justify-between">
                    <span className="text-gray-700">Marque</span>
                    <span className="font-medium text-gray-900">{product.marque}</span>
                  </div>
                )}
                {product.couleur && (
                  <div className="flex justify-between">
                    <span className="text-gray-700">Couleur</span>
                    <div className="flex items-center">
                      <span className="w-4 h-4 rounded-full mr-2" style={{ backgroundColor: product.couleur }}></span>
                      <span className="font-medium" style={{ color: product.couleur }}>
                        {product.couleur}
                      </span>
                    </div>
                  </div>
                )}

                <div className="flex justify-between">
                  <span className="text-gray-700">Catégorie</span>
                  <span className="font-medium text-gray-900">{product.category}</span>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900">Description</h3>
                <p className="mt-2 text-gray-600">
                  {product.description}
                </p>
              </div>

              {features.length > 0 && (
                <div className="pt-2">
                  <h3 className="text-lg font-medium text-gray-900">Caractéristiques</h3>
                  <ul className="mt-2 space-y-2 text-gray-600">
                    {features.map((feature, index) => (
                      <li key={index} className="flex items-center">
                        <svg
                          className="w-5 h-5 text-green-500 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Purchase Box */}
            <div className="bg-gray-50 p-6 rounded-xl shadow-sm">
              <div className="mb-6">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Prix</span>
                  <span className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-pink-600 bg-clip-text text-transparent">
                    {product.price && product.price.toFixed(2)} TND
                  </span>
                </div>
                <div className="mt-2 text-sm text-gray-500">Livraison gratuite à partir de 35TND</div>
              </div>

              <div className="mb-6">
                <div className="flex items-center">
                  {product.stock > 0 ? (
                    <>
                      <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      <span className="text-green-700 font-medium">En stock</span>
                      <span className="ml-1 text-gray-600">({product.stock} disponibles)</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M6 18L18 6M6 6l12 12"
                        ></path>
                      </svg>
                      <span className="text-red-700 font-medium">Rupture de stock</span>
                    </>
                  )}
                </div>
                <div className="mt-2 text-sm text-gray-500">Livraison sous 2-3 jours ouvrés</div>
              </div>

              <div className="space-y-3">
               
                <button
                  className={`w-full py-3 px-4 font-medium rounded-lg shadow-sm transition-all duration-300 transform hover:scale-[1.02] flex items-center justify-center ${
                    product.stock > 0
                      ? "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                      : "bg-gray-100 border border-gray-200 text-gray-400 cursor-not-allowed"
                  }`}
                  disabled={product.stock <= 0 || addedToCart}
                  onClick={handleAddToCart}
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                    ></path>
                  </svg>
                  {addedToCart ? "Ajouté au panier" : "Ajouter au panier"}
                </button>
              </div>

              <div className="mt-6 border-t pt-4">
                <div className="flex items-center mb-2">
                  <svg className="w-5 h-5 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9h3l3 6h6l3-6h3"></path>
                  </svg>
                  <span className="text-sm text-gray-600">Garantie de remboursement sous 30 jours</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Toast 
        message={`${product.name} ajouté au panier !`}
        isVisible={showToast}
        onClose={() => setShowToast(false)}
      />
    </>
  )
}

export default ProductDetails