"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Plus, Search, Edit, Trash2, ArrowLeft, Package, Eye, EyeOff } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

interface MobileProductsTableProps {
  products: any[]
  onProductsChange: () => void
}

export function MobileProductsTable({ products, onProductsChange }: MobileProductsTableProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [isDeleting, setIsDeleting] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.categories?.name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleDelete = async (productId: string) => {
    if (!confirm("Tem certeza que deseja excluir este produto?")) return

    setIsDeleting(productId)
    try {
      const { error } = await supabase.from("products").delete().eq("id", productId)

      if (error) throw error
      onProductsChange()
    } catch (error) {
      console.error("Error deleting product:", error)
      alert("Erro ao excluir produto")
    } finally {
      setIsDeleting(null)
    }
  }

  const toggleVisibility = async (productId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase.from("products").update({ is_active: !currentStatus }).eq("id", productId)

      if (error) throw error
      onProductsChange()
    } catch (error) {
      console.error("Error updating product visibility:", error)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="sm" onClick={() => router.push("/painel-admin/dashboard")}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-lg font-bold text-orange-900">Produtos</h1>
          </div>
          <Button
            onClick={() => router.push("/painel-admin/produtos/adicionar")}
            className="bg-orange-500 hover:bg-orange-600"
            size="sm"
          >
            <Plus className="h-4 w-4 mr-2" />
            Adicionar
          </Button>
        </div>
      </header>

      <div className="p-4 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Buscar produtos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="space-y-3">
          {filteredProducts.map((product) => (
            <Card key={product.id} className="overflow-hidden">
              <CardContent className="p-4">
                <div className="flex space-x-3">
                  {/* Product Image */}
                  <div className="flex-shrink-0">
                    {product.images && product.images.length > 0 ? (
                      <img
                        src={product.images[0] || "/placeholder.svg"}
                        alt={product.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                        <Package className="h-6 w-6 text-gray-400" />
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-medium text-sm truncate">{product.name}</h3>
                        <p className="text-xs text-gray-500 mt-1">{product.categories?.name}</p>
                        <div className="flex items-center space-x-2 mt-2">
                          <span className="text-sm font-bold text-green-600">R$ {product.price.toFixed(2)}</span>
                          {product.compare_at_price && (
                            <span className="text-xs text-gray-400 line-through">
                              R$ {product.compare_at_price.toFixed(2)}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge variant={product.stock_quantity > 0 ? "default" : "destructive"}>
                            {product.stock_quantity} em estoque
                          </Badge>
                          <Badge variant={product.is_active ? "default" : "secondary"}>
                            {product.is_active ? "Ativo" : "Inativo"}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center space-x-2 mt-3">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => router.push(`/painel-admin/produtos/editar/${product.id}`)}
                      >
                        <Edit className="h-3 w-3 mr-1" />
                        Editar
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleVisibility(product.id, product.is_active)}
                      >
                        {product.is_active ? <EyeOff className="h-3 w-3 mr-1" /> : <Eye className="h-3 w-3 mr-1" />}
                        {product.is_active ? "Ocultar" : "Mostrar"}
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(product.id)}
                        disabled={isDeleting === product.id}
                      >
                        <Trash2 className="h-3 w-3 mr-1" />
                        {isDeleting === product.id ? "..." : "Excluir"}
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum produto encontrado</h3>
            <p className="text-gray-500 mb-4">
              {searchTerm ? "Tente buscar com outros termos" : "Comece adicionando seu primeiro produto"}
            </p>
            <Button
              onClick={() => router.push("/painel-admin/produtos/adicionar")}
              className="bg-orange-500 hover:bg-orange-600"
            >
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Produto
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
