"use client"
import { createContext, useContext, useState, useEffect, type ReactNode, useCallback } from "react"

export interface Product {
  id: string
  name: string
  category: string
  images: string[]
  rating: number
  price: number
  description?: string
  favorit?: boolean
}

interface ProductContextType {
  products: Product[]
  loading: boolean
  error: string | null
  refreshProducts: () => Promise<void>
  toggleFavorite: (id: string) => void
}

const ProductContext = createContext<ProductContextType>({
  products: [],
  loading: true,
  error: null,
  refreshProducts: async () => {},
  toggleFavorite: () => {},
})

export const useProducts = () => useContext(ProductContext)

export const ProductProvider = ({ children }: { children: ReactNode }) => {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchProducts = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch("http://localhost/products/GetAllProducts", {
        method: "GET",
      })

      if (!response.ok) {
        throw new Error("Erreur lors de la récupération des produits")
      }

      const data = await response.json()
      setProducts(data)
    } catch (err) {
      setError((err as Error).message || "Échec de la connexion au serveur.")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  const refreshProducts = async () => {
    await fetchProducts()
  }

  // Fonction pour basculer l'état favori localement
  const toggleFavorite = (id: string) => {
    setProducts(prev =>
      prev.map(product =>
        product.id === id ? { ...product, favorit: !product.favorit } : product
      )
    )
  }

  return (
    <ProductContext.Provider
      value={{
        products,
        loading,
        error,
        refreshProducts,
        toggleFavorite,
      }}
    >
      {children}
    </ProductContext.Provider>
  )
}
