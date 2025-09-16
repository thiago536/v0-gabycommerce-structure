"use client"

import { createClient } from "@/lib/supabase/client"
import { create } from "zustand"
import { persist } from "zustand/middleware"

interface CartItem {
  id: string
  product_id: string
  product_variant_id?: string
  quantity: number
  product: {
    id: string
    name: string
    slug: string
    price: number
    promotional_price?: number
    images: string[]
    stock_quantity: number
  }
  variant?: {
    id: string
    name: string
    attributes: any
    stock_quantity: number
  }
}

interface CartStore {
  items: CartItem[]
  isLoading: boolean
  addItem: (productId: string, variantId?: string, quantity?: number) => Promise<void>
  removeItem: (itemId: string) => Promise<void>
  updateQuantity: (itemId: string, quantity: number) => Promise<void>
  clearCart: () => void
  getTotalItems: () => number
  getTotalPrice: () => number
  loadCart: () => Promise<void>
}

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isLoading: false,

      addItem: async (productId: string, variantId?: string, quantity = 1) => {
        set({ isLoading: true })
        const supabase = createClient()

        try {
          // Get product details
          const { data: product } = await supabase.from("products").select("*").eq("id", productId).single()

          if (!product) throw new Error("Product not found")

          // Get variant details if specified
          let variant = null
          if (variantId) {
            const { data: variantData } = await supabase
              .from("product_variants")
              .select("*")
              .eq("id", variantId)
              .single()
            variant = variantData
          }

          // Check if item already exists in cart
          const existingItem = get().items.find(
            (item) => item.product_id === productId && item.product_variant_id === variantId,
          )

          if (existingItem) {
            // Update quantity
            await get().updateQuantity(existingItem.id, existingItem.quantity + quantity)
          } else {
            // Add new item
            const newItem: CartItem = {
              id: `${productId}-${variantId || "default"}-${Date.now()}`,
              product_id: productId,
              product_variant_id: variantId,
              quantity,
              product,
              variant,
            }

            set((state) => ({
              items: [...state.items, newItem],
            }))

            // Save to database if user is logged in
            const {
              data: { user },
            } = await supabase.auth.getUser()
            if (user) {
              await supabase.from("cart_items").insert({
                user_id: user.id,
                product_id: productId,
                product_variant_id: variantId,
                quantity,
              })
            }
          }
        } catch (error) {
          console.error("Error adding item to cart:", error)
        } finally {
          set({ isLoading: false })
        }
      },

      removeItem: async (itemId: string) => {
        const supabase = createClient()
        const item = get().items.find((i) => i.id === itemId)

        set((state) => ({
          items: state.items.filter((item) => item.id !== itemId),
        }))

        // Remove from database if user is logged in
        try {
          const {
            data: { user },
          } = await supabase.auth.getUser()
          if (user && item) {
            await supabase
              .from("cart_items")
              .delete()
              .eq("user_id", user.id)
              .eq("product_id", item.product_id)
              .eq("product_variant_id", item.product_variant_id || null)
          }
        } catch (error) {
          console.error("Error removing item from cart:", error)
        }
      },

      updateQuantity: async (itemId: string, quantity: number) => {
        if (quantity <= 0) {
          await get().removeItem(itemId)
          return
        }

        const supabase = createClient()
        const item = get().items.find((i) => i.id === itemId)

        set((state) => ({
          items: state.items.map((item) => (item.id === itemId ? { ...item, quantity } : item)),
        }))

        // Update in database if user is logged in
        try {
          const {
            data: { user },
          } = await supabase.auth.getUser()
          if (user && item) {
            await supabase
              .from("cart_items")
              .update({ quantity })
              .eq("user_id", user.id)
              .eq("product_id", item.product_id)
              .eq("product_variant_id", item.product_variant_id || null)
          }
        } catch (error) {
          console.error("Error updating cart item:", error)
        }
      },

      clearCart: () => {
        set({ items: [] })
      },

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0)
      },

      getTotalPrice: () => {
        return get().items.reduce((total, item) => {
          const price = item.product.promotional_price || item.product.price
          return total + price * item.quantity
        }, 0)
      },

      loadCart: async () => {
        const supabase = createClient()
        try {
          const {
            data: { user },
          } = await supabase.auth.getUser()
          if (user) {
            const { data: cartItems } = await supabase
              .from("cart_items")
              .select(
                `
                *,
                products (*),
                product_variants (*)
              `,
              )
              .eq("user_id", user.id)

            if (cartItems) {
              const items: CartItem[] = cartItems.map((item) => ({
                id: `${item.product_id}-${item.product_variant_id || "default"}-${item.created_at}`,
                product_id: item.product_id,
                product_variant_id: item.product_variant_id,
                quantity: item.quantity,
                product: item.products,
                variant: item.product_variants,
              }))

              set({ items })
            }
          }
        } catch (error) {
          console.error("Error loading cart:", error)
        }
      },
    }),
    {
      name: "gabysummer-cart",
      partialize: (state) => ({ items: state.items }),
    },
  ),
)
