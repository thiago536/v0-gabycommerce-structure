"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import AddEditProductForm from "@/components/admin/add-edit-product-form"
import { DynamicBackground } from "@/components/dynamic-background"
import { toast } from "sonner"

interface Product {
  id: string
  name: string
  description: string
  price: number
  status: "active" | "inactive"
  category_id: string
  image_urls: string[]
  stock_quantity: number
  sku: string
}

export default function EditProductPage({ params }: { params: { id: string } }) {
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClientComponentClient()

  useEffect(() => {
    fetchProduct()
  }, [params.id])

  const fetchProduct = async () => {
    try {
      const { data, error } = await supabase.from("products").select("*").eq("id", params.id).single()

      if (error) {
        console.error("Erro ao buscar produto:", error)
        toast.error("Produto não encontrado")
        router.push("/admin/produtos")
        return
      }

      setProduct(data)
    } catch (error) {
      console.error("Erro:", error)
      toast.error("Erro ao carregar produto")
      router.push("/admin/produtos")
    } finally {
      setLoading(false)
    }
  }

  const handleSave = () => {
    router.push("/admin/produtos")
  }

  const handleCancel = () => {
    router.push("/admin/produtos")
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando produto...</p>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Produto não encontrado</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <DynamicBackground category="admin" />
      <div className="relative z-10 container mx-auto px-4 py-8">
        <AddEditProductForm product={product} onSave={handleSave} onCancel={handleCancel} />
      </div>
    </div>
  )
}
