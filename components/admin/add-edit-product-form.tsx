"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { X, Upload } from "lucide-react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { toast } from "sonner"

interface Product {
  id?: string
  name: string
  description: string
  price: number
  status: "active" | "inactive"
  category_id: string
  image_urls: string[]
  stock_quantity: number
  sku: string
}

interface Category {
  id: string
  name: string
  slug: string
}

interface AddEditProductFormProps {
  product?: Product
  onSave: () => void
  onCancel: () => void
}

export default function AddEditProductForm({ product, onSave, onCancel }: AddEditProductFormProps) {
  const [formData, setFormData] = useState<Product>({
    name: "",
    description: "",
    price: 0,
    status: "active",
    category_id: "",
    image_urls: [],
    stock_quantity: 0,
    sku: "",
  })

  const [categories, setCategories] = useState<Category[]>([])
  const [imageFiles, setImageFiles] = useState<File[]>([])
  const [existingImages, setExistingImages] = useState<string[]>([])
  const [uploading, setUploading] = useState(false)
  const [loading, setLoading] = useState(false)

  const supabase = createClientComponentClient()

  useEffect(() => {
    fetchCategories()
    if (product) {
      setFormData(product)
      setExistingImages(product.image_urls || [])
    }
  }, [product])

  const fetchCategories = async () => {
    const { data, error } = await supabase.from("categories").select("*").eq("status", "active")

    if (error) {
      console.error("Erro ao buscar categorias:", error)
      return
    }

    setCategories(data || [])
  }

  const handleInputChange = (field: keyof Product, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    setImageFiles(files)
  }

  const removeExistingImage = (urlToRemove: string) => {
    setExistingImages((prev) => prev.filter((url) => url !== urlToRemove))
  }

  const removeNewImage = (indexToRemove: number) => {
    setImageFiles((prev) => prev.filter((_, index) => index !== indexToRemove))
  }

  const uploadImages = async (): Promise<string[]> => {
    const uploadedUrls: string[] = []

    for (const file of imageFiles) {
      const fileName = `products/${Date.now()}-${Math.random().toString(36).substring(7)}-${file.name}`

      const { error: uploadError } = await supabase.storage.from("product-images").upload(fileName, file)

      if (uploadError) {
        console.error("Erro ao fazer upload da imagem:", uploadError)
        throw new Error(`Erro ao fazer upload da imagem: ${file.name}`)
      }

      const { data: publicUrlData } = supabase.storage.from("product-images").getPublicUrl(fileName)

      uploadedUrls.push(publicUrlData.publicUrl)
    }

    return uploadedUrls
  }

  const generateSKU = () => {
    const timestamp = Date.now().toString().slice(-6)
    const random = Math.random().toString(36).substring(2, 5).toUpperCase()
    return `GS-${timestamp}-${random}`
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setLoading(true)
    setUploading(true)

    try {
      // Upload novas imagens
      let newImageUrls: string[] = []
      if (imageFiles.length > 0) {
        newImageUrls = await uploadImages()
      }

      setUploading(false)

      // Combinar imagens existentes com novas
      const allImageUrls = [...existingImages, ...newImageUrls]

      // Gerar SKU se não existir
      const sku = formData.sku || generateSKU()

      const productData = {
        ...formData,
        image_urls: allImageUrls,
        sku,
        price: Number(formData.price),
        stock_quantity: Number(formData.stock_quantity),
      }

      let error = null

      if (product?.id) {
        // Editar produto existente
        const { error: updateError } = await supabase.from("products").update(productData).eq("id", product.id)
        error = updateError
      } else {
        // Adicionar novo produto
        const { error: insertError } = await supabase.from("products").insert([productData])
        error = insertError
      }

      if (error) {
        console.error("Erro ao salvar produto:", error)
        toast.error("Erro ao salvar produto")
        return
      }

      toast.success(product?.id ? "Produto atualizado com sucesso!" : "Produto adicionado com sucesso!")
      onSave()
    } catch (error) {
      console.error("Erro:", error)
      toast.error("Erro ao processar produto")
    } finally {
      setLoading(false)
      setUploading(false)
    }
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-orange-600">
          {product?.id ? "Editar Produto" : "Adicionar Novo Produto"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informações Básicas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Nome do Produto *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="Digite o nome do produto"
                required
              />
            </div>

            <div>
              <Label htmlFor="sku">SKU</Label>
              <Input
                id="sku"
                value={formData.sku}
                onChange={(e) => handleInputChange("sku", e.target.value)}
                placeholder="Será gerado automaticamente se vazio"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Descreva o produto..."
              rows={4}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="price">Preço (R$) *</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={(e) => handleInputChange("price", Number.parseFloat(e.target.value) || 0)}
                required
              />
            </div>

            <div>
              <Label htmlFor="stock">Estoque *</Label>
              <Input
                id="stock"
                type="number"
                min="0"
                value={formData.stock_quantity}
                onChange={(e) => handleInputChange("stock_quantity", Number.parseInt(e.target.value) || 0)}
                required
              />
            </div>

            <div>
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value) => handleInputChange("status", value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Ativo</SelectItem>
                  <SelectItem value="inactive">Inativo</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="category">Categoria *</Label>
            <Select value={formData.category_id} onValueChange={(value) => handleInputChange("category_id", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma categoria" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Upload de Imagens */}
          <div>
            <Label htmlFor="images">Imagens do Produto</Label>
            <div className="mt-2">
              <div className="flex items-center justify-center w-full">
                <label
                  htmlFor="images"
                  className="flex flex-col items-center justify-center w-full h-32 border-2 border-orange-300 border-dashed rounded-lg cursor-pointer bg-orange-50 hover:bg-orange-100"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 mb-4 text-orange-500" />
                    <p className="mb-2 text-sm text-orange-500">
                      <span className="font-semibold">Clique para fazer upload</span> ou arraste e solte
                    </p>
                    <p className="text-xs text-orange-400">PNG, JPG ou JPEG (MAX. 5MB cada)</p>
                  </div>
                  <input
                    id="images"
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {/* Preview das Imagens */}
            {(existingImages.length > 0 || imageFiles.length > 0) && (
              <div className="mt-4">
                <Label>Preview das Imagens</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
                  {/* Imagens Existentes */}
                  {existingImages.map((url, index) => (
                    <div key={`existing-${index}`} className="relative group">
                      <img
                        src={url || "/placeholder.svg"}
                        alt={`Produto ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg border"
                      />
                      <button
                        type="button"
                        onClick={() => removeExistingImage(url)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-4 h-4" />
                      </button>
                      <Badge variant="secondary" className="absolute bottom-1 left-1 text-xs">
                        Existente
                      </Badge>
                    </div>
                  ))}

                  {/* Novas Imagens */}
                  {imageFiles.map((file, index) => (
                    <div key={`new-${index}`} className="relative group">
                      <img
                        src={URL.createObjectURL(file) || "/placeholder.svg"}
                        alt={`Nova ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg border"
                      />
                      <button
                        type="button"
                        onClick={() => removeNewImage(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-4 h-4" />
                      </button>
                      <Badge variant="default" className="absolute bottom-1 left-1 text-xs bg-green-500">
                        Nova
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Botões de Ação */}
          <div className="flex gap-4 pt-6">
            <Button type="submit" disabled={loading || uploading} className="flex-1 bg-orange-500 hover:bg-orange-600">
              {loading
                ? uploading
                  ? "Fazendo upload..."
                  : "Salvando..."
                : product?.id
                  ? "Salvar Alterações"
                  : "Adicionar Produto"}
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={loading}
              className="flex-1 bg-transparent"
            >
              Cancelar
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
