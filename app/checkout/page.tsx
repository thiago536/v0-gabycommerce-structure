"use client"

import { DynamicBackground } from "@/components/dynamic-background"
import { Header } from "@/components/header"
import { CheckoutForm } from "@/components/checkout-form"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useCart } from "@/hooks/use-cart"
import { ShoppingBag } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useEffect } from "react"

export default function CheckoutPage() {
  const { items, getTotalPrice, loadCart } = useCart()

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
            <h1 className="text-3xl font-bold text-primary mb-4">Carrinho vazio</h1>
            <p className="text-lg text-muted-foreground mb-8">Adicione produtos ao carrinho para finalizar a compra</p>
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
            >
              Continuar Comprando
            </Link>
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
          <h1 className="text-3xl font-bold text-primary mb-8">Finalizar Compra</h1>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Checkout Form */}
            <div>
              <CheckoutForm cartItems={items} totalAmount={finalTotal} />
            </div>

            {/* Order Summary */}
            <div>
              <Card className="bg-card/80 backdrop-blur-sm sticky top-24">
                <CardHeader>
                  <CardTitle className="text-card-foreground">Resumo do Pedido</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {items.map((item) => {
                      const price = item.product.promotional_price || item.product.price
                      return (
                        <div key={item.id} className="flex gap-3">
                          <div className="relative w-16 h-16 flex-shrink-0">
                            <Image
                              src={item.product.images[0] || "/placeholder.svg"}
                              alt={item.product.name}
                              fill
                              className="object-cover rounded"
                            />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-sm">{item.product.name}</h4>
                            {item.variant && (
                              <p className="text-xs text-muted-foreground">Tamanho: {item.variant.name}</p>
                            )}
                            <div className="flex justify-between items-center mt-1">
                              <span className="text-xs text-muted-foreground">Qtd: {item.quantity}</span>
                              <span className="font-medium text-sm">R$ {(price * item.quantity).toFixed(2)}</span>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>

                  <Separator className="my-4" />

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Subtotal</span>
                      <span>R$ {totalPrice.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Frete</span>
                      <span>{shipping === 0 ? "Grátis" : `R$ ${shipping.toFixed(2)}`}</span>
                    </div>
                    {shipping === 0 && totalPrice > 150 && (
                      <p className="text-xs text-green-600">Frete grátis para compras acima de R$ 150!</p>
                    )}
                    <Separator />
                    <div className="flex justify-between font-bold">
                      <span>Total</span>
                      <span className="text-primary">R$ {finalTotal.toFixed(2)}</span>
                    </div>
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
