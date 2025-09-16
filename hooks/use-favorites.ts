"use client"

import { createClient } from "@/lib/supabase/client"
import { create } from "zustand"
import { persist } from "zustand/middleware"

interface FavoriteItem {
  id: string
  product_id: string
  product: {
    id: string
    name: string
    slug: string
    price: number
    promotional_price?: number
    images: string[]
  }
}

interface FavoritesStore {
  items: FavoriteItem[]
  isLoading: boolean
  addItem: (productId: string) => Promise<void>
  removeItem: (productId: string) => Promise<void>
  isInFavorites: (productId: string) => boolean
  loadFavorites: () => Promise<void>
}

export const useFavorites = create<FavoritesStore>()(
  persist(
    (set, get) => ({
      items: [],
      isLoading: false,

      addItem: async (productId: string) => {
        set({ isLoading: true })
        const supabase = createClient()

        try {
          // Get product details
          const { data: product } = await supabase.from("products").select("*").eq("id", productId).single()

          if (!product) throw new Error("Product not found")

          // Check if already in favorites
          if (get().isInFavorites(productId)) {
            return
          }

          const newItem: FavoriteItem = {
            id: `fav-${productId}-${Date.now()}`,
            product_id: productId,
            product,
          }

          set((state) => ({
            items: [...state.items, newItem],
          }))

          // Save to database if user is logged in
          const {
            data: { user },
          } = await supabase.auth.getUser()
          if (user) {
            await supabase.from("favorites").insert({
              user_id: user.id,
              product_id: productId,
            })
          }
        } catch (error) {
          console.error("Error adding item to favorites:", error)
        } finally {
          set({ isLoading: false })
        }
      },

      removeItem: async (productId: string) => {
        const supabase = createClient()

        set((state) => ({
          items: state.items.filter((item) => item.product_id !== productId),
        }))

        // Remove from database if user is logged in
        try {
          const {
            data: { user },
          } = await supabase.auth.getUser()
          if (user) {
            await supabase.from("favorites").delete().eq("user_id", user.id).eq("product_id", productId)
          }
        } catch (error) {
          console.error("Error removing item from favorites:", error)
        }
      },

      isInFavorites: (productId: string) => {
        return get().items.some((item) => item.product_id === productId)
      },

      loadFavorites: async () => {
        const supabase = createClient()
        try {
          const {
            data: { user },
          } = await supabase.auth.getUser()
          if (user) {
            const { data: favorites } = await supabase
              .from("favorites")
              .select(
                `
                *,
                products (*)
              `,
              )
              .eq("user_id", user.id)

            if (favorites) {
              const items: FavoriteItem[] = favorites.map((fav) => ({
                id: fav.id,
                product_id: fav.product_id,
                product: fav.products,
              }))

              set({ items })
            }
          }
        } catch (error) {
          console.error("Error loading favorites:", error)
        }
      },
    }),
    {
      name: "gabysummer-favorites",
      partialize: (state) => ({ items: state.items }),
    },
  ),
)
