import { createClient } from "@/lib/supabase/server"
import { DynamicBackground } from "@/components/dynamic-background"
import { Header } from "@/components/header"
import { ProductCard } from "@/components/product-card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Heart, ShoppingBag, Minus, Plus } from "lucide-react"
import Image from "next/image"
import { notFound } from "next/navigation"

interface ProductPageProps {
  params: Promise<{ slug: string }>
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params
  const supabase = await createClient()

  // Get product with category
  const { data: product } = await supabase
    .from("products")
    .select(`
      *,
      categories (name, slug)
    `)
    .eq("slug", slug)
    .eq("status", "active")
    .single()

  if (!product) {
    notFound()
  }

  // Get product variants
  const { data: variants } = await supabase
    .from("product_variants")
    .select("*")
    .eq("product_id", product.id)
    .order("name")

  // Get related products from same category
  const { data: relatedProducts } = await supabase
    .from("products")
    .select("*")
    .eq("category_id", product.category_id)
    .neq("id", product.id)
    .eq("status", "active")
    .limit(4)

  const hasDiscount = product.promotional_price && product.promotional_price < product.price
  const discountPercentage = hasDiscount
    ? Math.round(((product.price - product.promotional_price!) / product.price) * 100)
    : 0

  return (
    <DynamicBackground category={product.categories?.slug}>
      <Header />
      <main className="py-8 px-4">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 mb-16">
            {/* Product Images */}
            <div className="space-y-4">
              <div className="relative aspect-square overflow-hidden rounded-lg bg-card">
                <Image
                  src={product.images[0] || "/placeholder.svg?height=600&width=600"}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
                {hasDiscount && (
                  <Badge className="absolute top-4 left-4 bg-secondary text-secondary-foreground">
                    -{discountPercentage}%
                  </Badge>
                )}
              </div>
              {product.images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {product.images.slice(1, 5).map((image, index) => (
                    <div key={index} className="relative aspect-square overflow-hidden rounded bg-card">
                      <Image
                        src={image || "/placeholder.svg"}
                        alt={`${product.name} ${index + 2}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <p className="text-sm text-muted-foreground mb-2">{product.categories?.name}</p>
                <h1 className="text-3xl md:text-4xl font-bold text-primary mb-4 text-balance">{product.name}</h1>
                <p className="text-lg text-foreground/80 text-pretty">{product.short_description}</p>
              </div>

              <div className="flex items-center gap-4">
                {hasDiscount ? (
                  <>
                    <span className="text-3xl font-bold text-primary">R$ {product.promotional_price!.toFixed(2)}</span>
                    <span className="text-xl text-muted-foreground line-through">R$ {product.price.toFixed(2)}</span>
                  </>
                ) : (
                  <span className="text-3xl font-bold text-primary">R$ {product.price.toFixed(2)}</span>
                )}
              </div>

              {/* Variants */}
              {variants && variants.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-3">Tamanho:</h3>
                  <div className="flex gap-2">
                    {variants.map((variant) => (
                      <Button
                        key={variant.id}
                        variant="outline"
                        size="sm"
                        disabled={variant.stock_quantity === 0}
                        className="min-w-12 bg-transparent"
                      >
                        {variant.name}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div>
                <h3 className="font-semibold mb-3">Quantidade:</h3>
                <div className="flex items-center gap-3">
                  <Button variant="outline" size="icon">
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-12 text-center">1</span>
                  <Button variant="outline" size="icon">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-4">
                <Button size="lg" className="flex-1 gap-2" disabled={product.stock_quantity === 0}>
                  <ShoppingBag className="h-5 w-5" />
                  {product.stock_quantity === 0 ? "Produto Esgotado" : "Adicionar ao Carrinho"}
                </Button>
                <Button size="lg" variant="outline">
                  <Heart className="h-5 w-5" />
                </Button>
              </div>

              {/* Stock Info */}
              {product.stock_quantity <= 5 && product.stock_quantity > 0 && (
                <p className="text-sm text-amber-600">Apenas {product.stock_quantity} unidades restantes!</p>
              )}

              {/* Product Details */}
              {product.description && (
                <div>
                  <h3 className="font-semibold mb-3">Descrição:</h3>
                  <div className="prose prose-sm max-w-none text-foreground/80">
                    <p>{product.description}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Related Products */}
          {relatedProducts && relatedProducts.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold text-primary mb-8">Produtos Relacionados</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedProducts.map((relatedProduct) => (
                  <ProductCard key={relatedProduct.id} product={relatedProduct} />
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
    </DynamicBackground>
  )
}
