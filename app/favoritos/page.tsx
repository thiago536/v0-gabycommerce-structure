"use client"

import { DynamicBackground } from "@/components/dynamic-background"
import { Header } from "@/components/header"
import { ProductCard } from "@/components/product-card"
import { Button } from "@/components/ui/button"
import { useFavorites } from "@/hooks/use-favorites"
import { Heart } from "lucide-react"
import Link from "next/link"
import { useEffect } from "react"

export default function FavoritesPage() {
  const { items, loadFavorites } = useFavorites()

  useEffect(() => {
    loadFavorites()
  }, [loadFavorites])

  if (items.length === 0) {
    return (
      <DynamicBackground>
        <Header />
        <main className="py-16 px-4">
          <div className="container mx-auto max-w-2xl text-center">
            <Heart className="h-24 w-24 text-muted-foreground mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-primary mb-4">Nenhum favorito ainda</h1>
            <p className="text-lg text-muted-foreground mb-8">
              Adicione produtos aos seus favoritos para encontrá-los facilmente depois!
            </p>
            <Button size="lg" asChild>
              <Link href="/">Descobrir Produtos</Link>
            </Button>
          </div>
        </main>
      </DynamicBackground>
    )
  }

  return (
    <DynamicBackground>
      <Header />
      <main className="py-8 px-4">
        <div className="container mx-auto">
          <h1 className="text-3xl font-bold text-primary mb-8">Meus Favoritos</h1>
          <p className="text-muted-foreground mb-8">{items.length} produtos salvos</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {items.map((item) => (
              <ProductCard key={item.id} product={item.product} />
            ))}
          </div>
        </div>
      </main>
    </DynamicBackground>
  )
}
