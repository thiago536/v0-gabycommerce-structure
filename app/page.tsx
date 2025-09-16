import { createClient } from "@/lib/supabase/server"
import { DynamicBackground } from "@/components/dynamic-background"
import { Header } from "@/components/header"
import { ProductCard } from "@/components/product-card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"

export default async function HomePage() {
  const supabase = await createClient()

  // Get featured products (latest products)
  const { data: featuredProducts } = await supabase
    .from("products")
    .select("*")
    .eq("status", "active")
    .order("created_at", { ascending: false })
    .limit(8)

  // Get categories
  const { data: categories } = await supabase.from("categories").select("*").order("name")

  return (
    <DynamicBackground>
      <Header />
      <main>
        {/* Hero Section */}
        <section className="py-20 px-4">
          <div className="container mx-auto text-center">
            <h1 className="text-5xl md:text-7xl font-bold text-primary mb-6 text-balance">Verão com Estilo</h1>
            <p className="text-xl md:text-2xl text-foreground/80 mb-8 max-w-3xl mx-auto text-pretty">
              Descubra a coleção GabySummer: moda praia, fitness e acessórios que combinam elegância e conforto para
              seus dias ensolarados
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild className="text-lg px-8 py-6">
                <Link href="/categoria/moda-praia">Ver Moda Praia</Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="text-lg px-8 py-6 bg-transparent">
                <Link href="/categoria/fitness">Ver Fitness</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="py-16 px-4">
          <div className="container mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-primary mb-12">Nossas Categorias</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {categories?.map((category) => (
                <Link
                  key={category.id}
                  href={`/categoria/${category.slug}`}
                  className="group relative overflow-hidden rounded-lg aspect-[4/3] bg-card hover:shadow-xl transition-all duration-300"
                >
                  <Image
                    src={category.background_image_url || "/placeholder.svg?height=400&width=600"}
                    alt={category.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-6 left-6 text-white">
                    <h3 className="text-2xl font-bold mb-2">{category.name}</h3>
                    <p className="text-white/80">{category.description}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Products */}
        <section className="py-16 px-4">
          <div className="container mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-primary mb-12">Produtos em Destaque</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts?.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
            <div className="text-center mt-12">
              <Button size="lg" variant="outline" asChild>
                <Link href="/produtos">Ver Todos os Produtos</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
    </DynamicBackground>
  )
}
