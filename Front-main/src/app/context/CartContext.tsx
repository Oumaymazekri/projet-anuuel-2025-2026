"use client"
import { createContext, useContext, useState, useEffect, type ReactNode, useCallback } from "react"

// Define the CartItem type
export interface CartItem {
  id: string | number
  name: string
  price: number
  quantity: number
  image: string
  category: string
  description: string
}

// Define the Product type for better type safety
export interface Product {
  id: string | number
  name: string
  price: number
  images?: string[] | { url: string }[]
  description?: string
  category?: string
  [key: string]: any // Allow other properties
}

// Define the CartContextType
interface CartContextType {
  items: CartItem[]
  addToCart: (product: Product) => void
  removeFromCart: (id: string | number) => void
  updateQuantity: (id: string | number, quantity: number) => void
  clearCart: () => void
  totalItems: number
  totalPrice: number
}

// Create the context with default values
const CartContext = createContext<CartContextType>({
  items: [],
  addToCart: () => {},
  removeFromCart: () => {},
  updateQuantity: () => {},
  clearCart: () => {},
  totalItems: 0,
  totalPrice: 0,
})

// Custom hook to use the cart context
export const useCart = () => useContext(CartContext)

// Helper function to get image URL
const getImageUrl = (product: Product): string => {
  // If no images, return placeholder
  if (!product.images || !product.images.length) {
    return "/placeholder.svg"
  }

  const firstImage = product.images[0]

  // Handle different image formats
  if (typeof firstImage === "string") {
    // If it's already a full URL, use it
    if (firstImage.startsWith("http") || firstImage.startsWith("/")) {
      return firstImage
    }
    // Otherwise, prepend the API URL
    return `http://localhost/images/products/${firstImage}`
  }
  // Handle object format like { url: "..." }
  else if (typeof firstImage === "object" && firstImage !== null && "url" in firstImage) {
    return firstImage.url
  }

  // Fallback to placeholder
  return "/placeholder.svg"
}

// Cart provider component
export const CartProvider = ({ children }: { children: ReactNode }) => {
  // Initialize state from localStorage if available, otherwise empty array
  const [items, setItems] = useState<CartItem[]>(() => {
    if (typeof window !== "undefined") {
      const savedCart = localStorage.getItem("cart")
      if (savedCart) {
        try {
          return JSON.parse(savedCart)
        } catch (error) {
          console.error("Failed to parse cart from localStorage:", error)
        }
      }
    }
    return []
  })

  // Save cart to localStorage with debounce
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saveTimeout = setTimeout(() => {
        localStorage.setItem("cart", JSON.stringify(items))
        console.log("Cart saved to localStorage:", items)
      }, 300) // 300ms debounce

      return () => clearTimeout(saveTimeout)
    }
  }, [items])

  // Add a product to the cart
  const addToCart = useCallback((product: Product) => {
    console.log("Adding product to cart:", product)

    if (!product || !product.id || !product.name || typeof product.price !== "number") {
      console.error("Invalid product data:", product)
      return
    }

    setItems((prevItems) => {
      // Check if the item is already in the cart
      const existingItem = prevItems.find((item) => item.id === product.id)

      if (existingItem) {
        // If it exists, increase the quantity
        return prevItems.map((item) => (item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item))
      } else {
        // If it doesn't exist, add it with quantity 1
        const imageUrl = getImageUrl(product)

        const newItem: CartItem = {
          id: product.id,
          name: product.name,
          price: product.price,
          quantity: 1,
          image: imageUrl,
          description: product.description || "",
          category: product.category || "",
        }
        console.log("New item added to cart:", newItem)
        return [...prevItems, newItem]
      }
    })
  }, [])

  // Remove an item from the cart
  const removeFromCart = useCallback((id: string | number) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== id))
  }, [])

  // Update the quantity of an item
  const updateQuantity = useCallback(
    (id: string | number, quantity: number) => {
      if (quantity < 1) {
        // If quantity is less than 1, remove the item
        removeFromCart(id)
        return
      }

      setItems((prevItems) => prevItems.map((item) => (item.id === id ? { ...item, quantity } : item)))
    },
    [removeFromCart],
  )

  // Clear the entire cart
  const clearCart = useCallback(() => {
    setItems([])
    if (typeof window !== "undefined") {
      localStorage.removeItem("cart")
    }
  }, [])

  // Calculate total items in cart
  const totalItems = items.reduce((total, item) => total + item.quantity, 0)

  // Calculate total price
  const totalPrice = items.reduce((total, item) => total + item.price * item.quantity, 0)

  // Memoize the context value to prevent unnecessary re-renders
  const contextValue = {
    items,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    totalItems,
    totalPrice,
  }

  return <CartContext.Provider value={contextValue}>{children}</CartContext.Provider>
}

