"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { MobileProductsTable } from "@/components/admin/mobile-products-table"

export default function AdminProductsPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [products, setProducts] = useState([])
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const isAdminLoggedIn = localStorage.getItem("gabysummer_admin_logged_in")
    if (isAdminLoggedIn !== "true") {
      router.push("/painel-admin")
      return
    }

    loadProducts()
  }, [router])

  const loadProducts = async () => {
    try {
      const { data, error } = await supabase
        .from("products")
        .select(`
          *,
          categories (name)
        `)
        .order("created_at", { ascending: false })

      if (error) throw error
      setProducts(data || [])
    } catch (error) {
      console.error("Error loading products:", error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando produtos...</p>
        </div>
      </div>
    )
  }

  return <MobileProductsTable products={products} onProductsChange={loadProducts} />
}
