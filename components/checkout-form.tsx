"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createClient } from "@/lib/supabase/client"
import { useCart } from "@/hooks/use-cart"
import { MessageCircle, CreditCard } from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"

interface CartItem {
  id: string
  product_id: string
  product_variant_id?: string
  quantity: number
  product: {
    id: string
    name: string
    slug: string
    price: number
    promotional_price?: number
    images: string[]
  }
  variant?: {
    id: string
    name: string
    attributes: any
  }
}

interface CheckoutFormProps {
  cartItems: CartItem[]
  totalAmount: number
}

export function CheckoutForm({ cartItems, totalAmount }: CheckoutFormProps) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    notes: "",
    paymentMethod: "whatsapp",
  })
  const [couponCode, setCouponCode] = useState("")
  const [discount, setDiscount] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { clearCart } = useCart()
  const router = useRouter()

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const applyCoupon = async () => {
    if (!couponCode.trim()) return

    const supabase = createClient()
    const { data: coupon } = await supabase
      .from("coupons")
      .select("*")
      .eq("code", couponCode.toUpperCase())
      .eq("is_active", true)
      .single()

    if (coupon && new Date(coupon.valid_until) > new Date()) {
      const discountAmount =
        coupon.discount_type === "percentage" ? (totalAmount * coupon.discount_value) / 100 : coupon.discount_value

      const finalDiscount = coupon.max_discount_amount
        ? Math.min(discountAmount, coupon.max_discount_amount)
        : discountAmount

      setDiscount(finalDiscount)
    } else {
      setError("Cupom inválido ou expirado")
    }
  }

  const generateOrderNumber = () => {
    return `GS${Date.now().toString().slice(-8)}`
  }

  const createWhatsAppMessage = (orderNumber: string) => {
    const customerInfo = `*Dados do Cliente:*
Nome: ${formData.firstName} ${formData.lastName}
Email: ${formData.email}
Telefone: ${formData.phone}
Endereço: ${formData.address}, ${formData.city} - ${formData.state}, ${formData.zipCode}`

    const itemsList = cartItems
      .map((item) => {
        const price = item.product.promotional_price || item.product.price
        const variant = item.variant ? ` (${item.variant.name})` : ""
        return `• ${item.product.name}${variant} - Qtd: ${item.quantity} - R$ ${(price * item.quantity).toFixed(2)}`
      })
      .join("\n")

    const finalTotal = totalAmount - discount

    const message = `🌊 *Novo Pedido GabySummer* 🌊

*Pedido:* #${orderNumber}

${customerInfo}

*Produtos:*
${itemsList}

*Resumo:*
Subtotal: R$ ${(totalAmount - (totalAmount > 150 ? 0 : 15)).toFixed(2)}
Frete: ${totalAmount > 150 ? "Grátis" : "R$ 15,00"}
${discount > 0 ? `Desconto: -R$ ${discount.toFixed(2)}` : ""}
*Total: R$ ${finalTotal.toFixed(2)}*

${formData.notes ? `*Observações:* ${formData.notes}` : ""}

Aguardando confirmação! 💙`

    return encodeURIComponent(message)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const supabase = createClient()
      const orderNumber = generateOrderNumber()

      // Get current user
      const {
        data: { user },
      } = await supabase.auth.getUser()

      const finalTotal = totalAmount - discount

      // Create order
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({
          user_id: user?.id || null,
          order_number: orderNumber,
          status: "pending",
          subtotal: totalAmount - (totalAmount > 150 ? 0 : 15),
          discount_amount: discount,
          total_amount: finalTotal,
          customer_info: {
            name: `${formData.firstName} ${formData.lastName}`,
            email: formData.email,
            phone: formData.phone,
            address: `${formData.address}, ${formData.city} - ${formData.state}, ${formData.zipCode}`,
          },
          notes: formData.notes || null,
        })
        .select()
        .single()

      if (orderError) throw orderError

      // Create order items
      const orderItems = cartItems.map((item) => ({
        order_id: order.id,
        product_id: item.product_id,
        product_variant_id: item.product_variant_id || null,
        quantity: item.quantity,
        unit_price: item.product.promotional_price || item.product.price,
        total_price: (item.product.promotional_price || item.product.price) * item.quantity,
        product_snapshot: {
          name: item.product.name,
          images: item.product.images,
          variant: item.variant,
        },
      }))

      const { error: itemsError } = await supabase.from("order_items").insert(orderItems)

      if (itemsError) throw itemsError

      // Generate WhatsApp message and redirect
      const whatsappMessage = createWhatsAppMessage(orderNumber)
      const whatsappNumber = "5511999999999" // Replace with actual WhatsApp number
      const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`

      // Mark WhatsApp as sent
      await supabase.from("orders").update({ whatsapp_sent: true }).eq("id", order.id)

      // Clear cart
      clearCart()

      // Redirect to WhatsApp
      window.open(whatsappUrl, "_blank")

      // Redirect to success page
      router.push(`/pedido-confirmado?order=${orderNumber}`)
    } catch (error) {
      setError(error instanceof Error ? error.message : "Erro ao processar pedido")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Customer Information */}
      <Card className="bg-card/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-card-foreground">Informações Pessoais</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName">Nome *</Label>
              <Input
                id="firstName"
                required
                value={formData.firstName}
                onChange={(e) => handleInputChange("firstName", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="lastName">Sobrenome *</Label>
              <Input
                id="lastName"
                required
                value={formData.lastName}
                onChange={(e) => handleInputChange("lastName", e.target.value)}
              />
            </div>
          </div>
          <div>
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              required
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="phone">Telefone/WhatsApp *</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="(11) 99999-9999"
              required
              value={formData.phone}
              onChange={(e) => handleInputChange("phone", e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Shipping Address */}
      <Card className="bg-card/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-card-foreground">Endereço de Entrega</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="address">Endereço Completo *</Label>
            <Input
              id="address"
              placeholder="Rua, número, complemento"
              required
              value={formData.address}
              onChange={(e) => handleInputChange("address", e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="city">Cidade *</Label>
              <Input
                id="city"
                required
                value={formData.city}
                onChange={(e) => handleInputChange("city", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="state">Estado *</Label>
              <Select value={formData.state} onValueChange={(value) => handleInputChange("state", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SP">São Paulo</SelectItem>
                  <SelectItem value="RJ">Rio de Janeiro</SelectItem>
                  <SelectItem value="MG">Minas Gerais</SelectItem>
                  <SelectItem value="RS">Rio Grande do Sul</SelectItem>
                  <SelectItem value="PR">Paraná</SelectItem>
                  <SelectItem value="SC">Santa Catarina</SelectItem>
                  <SelectItem value="BA">Bahia</SelectItem>
                  <SelectItem value="GO">Goiás</SelectItem>
                  <SelectItem value="PE">Pernambuco</SelectItem>
                  <SelectItem value="CE">Ceará</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Label htmlFor="zipCode">CEP *</Label>
            <Input
              id="zipCode"
              placeholder="00000-000"
              required
              value={formData.zipCode}
              onChange={(e) => handleInputChange("zipCode", e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Coupon */}
      <Card className="bg-card/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-card-foreground">Cupom de Desconto</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              placeholder="Digite o código do cupom"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
            />
            <Button type="button" variant="outline" onClick={applyCoupon}>
              Aplicar
            </Button>
          </div>
          {discount > 0 && <p className="text-sm text-green-600 mt-2">Desconto aplicado: R$ {discount.toFixed(2)}</p>}
        </CardContent>
      </Card>

      {/* Notes */}
      <Card className="bg-card/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-card-foreground">Observações</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Observações sobre o pedido (opcional)"
            value={formData.notes}
            onChange={(e) => handleInputChange("notes", e.target.value)}
          />
        </CardContent>
      </Card>

      {/* Payment Method */}
      <Card className="bg-card/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-card-foreground">Forma de Pagamento</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center space-x-2 p-3 border rounded-lg bg-primary/5 border-primary">
              <MessageCircle className="h-5 w-5 text-primary" />
              <div className="flex-1">
                <p className="font-medium text-primary">WhatsApp (Recomendado)</p>
                <p className="text-sm text-muted-foreground">
                  Finalize seu pedido via WhatsApp para negociar a forma de pagamento
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2 p-3 border rounded-lg opacity-50">
              <CreditCard className="h-5 w-5 text-muted-foreground" />
              <div className="flex-1">
                <p className="font-medium text-muted-foreground">Pagamento Online</p>
                <p className="text-sm text-muted-foreground">Em breve disponível</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {error && <div className="text-sm text-destructive bg-destructive/10 p-3 rounded">{error}</div>}

      <Button type="submit" size="lg" className="w-full gap-2" disabled={isLoading}>
        <MessageCircle className="h-5 w-5" />
        {isLoading ? "Processando..." : "Finalizar via WhatsApp"}
      </Button>
    </form>
  )
}
