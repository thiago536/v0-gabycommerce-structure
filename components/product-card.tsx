"use client"

import { Heart, ShoppingBag } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useCart } from "@/hooks/use-cart"
import { useFavorites } from "@/hooks/use-favorites"
import { useState } from "react"

interface Product {
  id: string
  name: string
  slug: string
  price: number
  promotional_price?: number
  images: string[]
  short_description?: string
  stock_quantity: number
}

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem: addToCart, isLoading: cartLoading } = useCart()
  const { addItem: addToFavorites, removeItem: removeFromFavorites, isInFavorites } = useFavorites()
  const [isAddingToCart, setIsAddingToCart] = useState(false)

  const hasDiscount = product.promotional_price && product.promotional_price < product.price
  const discountPercentage = hasDiscount
    ? Math.round(((product.price - product.promotional_price!) / product.price) * 100)
    : 0

  const isFavorite = isInFavorites(product.id)

  const handleAddToCart = async () => {
    setIsAddingToCart(true)
    await addToCart(product.id)
    setIsAddingToCart(false)
  }

  const handleToggleFavorite = async () => {
    if (isFavorite) {
      await removeFromFavorites(product.id)
    } else {
      await addToFavorites(product.id)
    }
  }

  return (
    <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 bg-card/80 backdrop-blur-sm">
      <div className="relative aspect-[3/4] overflow-hidden">
        <Link href={`/produto/${product.slug}`}>
          <Image
            src={product.images[0] || "/placeholder.svg?height=400&width=300"}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </Link>
        {hasDiscount && (
          <Badge className="absolute top-2 left-2 bg-secondary text-secondary-foreground">-{discountPercentage}%</Badge>
        )}
        {product.stock_quantity <= 5 && product.stock_quantity > 0 && (
          <Badge variant="outline" className="absolute top-2 right-2 bg-background/80">
            Últimas unidades
          </Badge>
        )}
        {product.stock_quantity === 0 && (
          <Badge variant="destructive" className="absolute top-2 right-2">
            Esgotado
          </Badge>
        )}
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            size="icon"
            variant={isFavorite ? "default" : "secondary"}
            className="h-8 w-8"
            onClick={handleToggleFavorite}
          >
            <Heart className={`h-4 w-4 ${isFavorite ? "fill-current" : ""}`} />
          </Button>
        </div>
      </div>
      <CardContent className="p-4">
        <Link href={`/produto/${product.slug}`}>
          <h3 className="font-semibold text-card-foreground group-hover:text-primary transition-colors text-balance">
            {product.name}
          </h3>
        </Link>
        {product.short_description && (
          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{product.short_description}</p>
        )}
        <div className="flex items-center justify-between mt-3">
          <div className="flex flex-col">
            {hasDiscount ? (
              <>
                <span className="text-lg font-bold text-primary">R$ {product.promotional_price!.toFixed(2)}</span>
                <span className="text-sm text-muted-foreground line-through">R$ {product.price.toFixed(2)}</span>
              </>
            ) : (
              <span className="text-lg font-bold text-primary">R$ {product.price.toFixed(2)}</span>
            )}
          </div>
          <Button
            size="sm"
            disabled={product.stock_quantity === 0 || isAddingToCart}
            className="gap-2"
            onClick={handleAddToCart}
          >
            <ShoppingBag className="h-4 w-4" />
            {product.stock_quantity === 0 ? "Esgotado" : isAddingToCart ? "Adicionando..." : "Adicionar"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
