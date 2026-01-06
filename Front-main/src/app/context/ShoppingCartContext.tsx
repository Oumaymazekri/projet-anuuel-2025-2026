"use client"

import { createContext, useContext } from "react"

interface ShoppingCartContextType {
  addToCart: (product: any) => void
}

const ShoppingCartContext = createContext<ShoppingCartContextType>({
  addToCart: () => {},
})

export const useShoppingCart = () => useContext(ShoppingCartContext)

export const ShoppingCartProvider = ShoppingCartContext.Provider

