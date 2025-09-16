import { createClient } from "@/lib/supabase/server"
import { DynamicBackground } from "@/components/dynamic-background"
import { Header } from "@/components/header"
import { ProductCard } from "@/components/product-card"
import { CategoryHero } from "@/components/category-hero"
import { notFound } from "next/navigation"

interface CategoryPageProps {
  params: Promise<{ slug: string }>
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params
  const supabase = await createClient()

  // Get category
  const { data: category } = await supabase.from("categories").select("*").eq("slug", slug).single()

  if (!category) {
    notFound()
  }

  // Get products in this category
  const { data: products } = await supabase
    .from("products")
    .select("*")
    .eq("category_id", category.id)
    .eq("status", "active")
    .order("name")

  return (
    <DynamicBackground category={category.slug}>
      <Header />
      <main>
        <CategoryHero
          title={category.name}
          description={category.description || ""}
          productCount={products?.length || 0}
        />

        <section className="py-8 px-4">
          <div className="container mx-auto">
            {products && products.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <p className="text-lg text-muted-foreground">Nenhum produto encontrado nesta categoria.</p>
              </div>
            )}
          </div>
        </section>
      </main>
    </DynamicBackground>
  )
}
