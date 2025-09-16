"use client"

import { DynamicBackground } from "@/components/dynamic-background"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { useCart } from "@/hooks/use-cart"
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useEffect } from "react"

export default function CartPage() {
  const { items, updateQuantity, removeItem, getTotalPrice, loadCart } = useCart()

  useEffect(() => {
    loadCart()
  }, [loadCart])

  const totalPrice = getTotalPrice()
  const shipping = totalPrice > 150 ? 0 : 15
  const finalTotal = totalPrice + shipping

  if (items.length === 0) {
    return (
      <DynamicBackground>
        <Header />
        <main className="py-16 px-4">
          <div className="container mx-auto max-w-2xl text-center">
            <ShoppingBag className="h-24 w-24 text-muted-foreground mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-primary mb-4">Seu carrinho está vazio</h1>
            <p className="text-lg text-muted-foreground mb-8">Que tal dar uma olhada nos nossos produtos incríveis?</p>
            <Button size="lg" asChild>
              <Link href="/">Continuar Comprando</Link>
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
        <div className="container mx-auto max-w-6xl">
          <h1 className="text-3xl font-bold text-primary mb-8">Carrinho de Compras</h1>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => {
                const price = item.product.promotional_price || item.product.price
                return (
                  <Card key={item.id} className="bg-card/80 backdrop-blur-sm">
                    <CardContent className="p-6">
                      <div className="flex gap-4">
                        <div className="relative w-24 h-24 flex-shrink-0">
                          <Image
                            src={item.product.images[0] || "/placeholder.svg"}
                            alt={item.product.name}
                            fill
                            className="object-cover rounded"
                          />
                        </div>
                        <div className="flex-1">
                          <Link href={`/produto/${item.product.slug}`}>
                            <h3 className="font-semibold text-card-foreground hover:text-primary transition-colors">
                              {item.product.name}
                            </h3>
                          </Link>
                          {item.variant && (
                            <p className="text-sm text-muted-foreground">Tamanho: {item.variant.name}</p>
                          )}
                          <p className="text-lg font-bold text-primary mt-2">R$ {price.toFixed(2)}</p>
                        </div>
                        <div className="flex flex-col items-end gap-4">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeItem(item.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              disabled={item.quantity <= 1}
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <span className="w-12 text-center">{item.quantity}</span>
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              disabled={item.quantity >= item.product.stock_quantity}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="bg-card/80 backdrop-blur-sm sticky top-24">
                <CardContent className="p-6">
                  <h2 className="text-xl font-bold text-card-foreground mb-4">Resumo do Pedido</h2>

                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Subtotal ({items.length} itens)</span>
                      <span>R$ {totalPrice.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Frete</span>
                      <span>{shipping === 0 ? "Grátis" : `R$ ${shipping.toFixed(2)}`}</span>
                    </div>
                    {shipping === 0 && totalPrice > 150 && (
                      <p className="text-sm text-green-600">Frete grátis para compras acima de R$ 150!</p>
                    )}
                    <Separator />
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span className="text-primary">R$ {finalTotal.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="mt-6 space-y-3">
                    <div>
                      <label className="text-sm font-medium">Cupom de Desconto</label>
                      <div className="flex gap-2 mt-1">
                        <Input placeholder="Digite o cupom" />
                        <Button variant="outline">Aplicar</Button>
                      </div>
                    </div>

                    <Button size="lg" className="w-full" asChild>
                      <Link href="/checkout">Finalizar Compra</Link>
                    </Button>

                    <Button variant="outline" size="lg" className="w-full bg-transparent" asChild>
                      <Link href="/">Continuar Comprando</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </DynamicBackground>
  )
}
