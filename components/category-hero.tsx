interface CategoryHeroProps {
  title: string
  description: string
  productCount: number
}

export function CategoryHero({ title, description, productCount }: CategoryHeroProps) {
  return (
    <div className="text-center py-16 px-4">
      <h1 className="text-4xl md:text-6xl font-bold text-primary mb-4 text-balance">{title}</h1>
      <p className="text-lg md:text-xl text-foreground/80 mb-6 max-w-2xl mx-auto text-pretty">{description}</p>
      <p className="text-muted-foreground">
        {productCount} {productCount === 1 ? "produto encontrado" : "produtos encontrados"}
      </p>
    </div>
  )
}
