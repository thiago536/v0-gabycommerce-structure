import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { orderId } = await request.json()

    const supabase = await createClient()

    // Get order details with items
    const { data: order } = await supabase
      .from("orders")
      .select(
        `
        *,
        order_items (
          *,
          products (name, images),
          product_variants (name, attributes)
        )
      `,
      )
      .eq("id", orderId)
      .single()

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    // Generate WhatsApp message
    const customerInfo = `*Dados do Cliente:*
Nome: ${order.customer_info.name}
Email: ${order.customer_info.email}
Telefone: ${order.customer_info.phone}
Endereço: ${order.customer_info.address}`

    const itemsList = order.order_items
      .map((item: any) => {
        const variant = item.product_variants ? ` (${item.product_variants.name})` : ""
        return `• ${item.products.name}${variant} - Qtd: ${item.quantity} - R$ ${item.total_price.toFixed(2)}`
      })
      .join("\n")

    const message = `🌊 *Novo Pedido GabySummer* 🌊

*Pedido:* #${order.order_number}

${customerInfo}

*Produtos:*
${itemsList}

*Total: R$ ${order.total_amount.toFixed(2)}*

${order.notes ? `*Observações:* ${order.notes}` : ""}

Aguardando confirmação! 💙`

    // Update order as WhatsApp sent
    await supabase.from("orders").update({ whatsapp_sent: true }).eq("id", orderId)

    return NextResponse.json({
      success: true,
      message: encodeURIComponent(message),
      whatsappUrl: `https://wa.me/5511999999999?text=${encodeURIComponent(message)}`,
    })
  } catch (error) {
    console.error("WhatsApp order error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
