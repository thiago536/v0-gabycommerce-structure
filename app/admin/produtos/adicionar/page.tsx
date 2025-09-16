"use client"
import { useRouter } from "next/navigation"
import AddEditProductForm from "@/components/admin/add-edit-product-form"
import { DynamicBackground } from "@/components/dynamic-background"

export default function AddProductPage() {
  const router = useRouter()

  const handleSave = () => {
    router.push("/admin/produtos")
  }

  const handleCancel = () => {
    router.push("/admin/produtos")
  }

  return (
    <div className="min-h-screen">
      <DynamicBackground category="admin" />
      <div className="relative z-10 container mx-auto px-4 py-8">
        <AddEditProductForm onSave={handleSave} onCancel={handleCancel} />
      </div>
    </div>
  )
}
