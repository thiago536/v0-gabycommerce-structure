"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Edit, Trash2, Eye } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface Product {
  id: string
  name: string
  slug: string
  price: number
  promotional_price?: number
  stock_quantity: number
  status: string
  images: string[]
  categories?: { name: string }
}

interface ProductsTableProps {
  products: Product[]
}

export function ProductsTable({ products }: ProductsTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Lista de Produtos</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Produto</TableHead>
              <TableHead>Categoria</TableHead>
              <TableHead>Preço</TableHead>
              <TableHead>Estoque</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="relative w-12 h-12">
                      <Image
                        src={product.images[0] || "/placeholder.svg"}
                        alt={product.name}
                        fill
                        className="object-cover rounded"
                      />
                    </div>
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-muted-foreground">{product.slug}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{product.categories?.name || "Sem categoria"}</TableCell>
                <TableCell>
                  <div>
                    {product.promotional_price ? (
                      <>
                        <p className="font-medium">R$ {product.promotional_price.toFixed(2)}</p>
                        <p className="text-sm text-muted-foreground line-through">R$ {product.price.toFixed(2)}</p>
                      </>
                    ) : (
                      <p className="font-medium">R$ {product.price.toFixed(2)}</p>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      product.stock_quantity === 0
                        ? "destructive"
                        : product.stock_quantity <= 5
                          ? "secondary"
                          : "default"
                    }
                  >
                    {product.stock_quantity} unidades
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      product.status === "active" ? "default" : product.status === "inactive" ? "secondary" : "outline"
                    }
                  >
                    {product.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" asChild>
                      <Link href={`/produto/${product.slug}`} target="_blank">
                        <Eye className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button variant="ghost" size="icon" asChild>
                      <Link href={`/admin/produtos/editar/${product.id}`}>
                        <Edit className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
