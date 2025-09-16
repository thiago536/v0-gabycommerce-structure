"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Eye, MessageCircle, ExternalLink } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useState } from "react"

interface Order {
  id: string
  order_number: string
  status: string
  total_amount: number
  created_at: string
  whatsapp_sent: boolean
  customer_info: any
  profiles?: {
    first_name?: string
    last_name?: string
    phone?: string
  }
}

interface OrdersTableProps {
  orders: Order[]
}

export function OrdersTable({ orders: initialOrders }: OrdersTableProps) {
  const [orders, setOrders] = useState(initialOrders)

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    const supabase = createClient()
    const { error } = await supabase.from("orders").update({ status: newStatus }).eq("id", orderId)

    if (!error) {
      setOrders((prev) => prev.map((order) => (order.id === orderId ? { ...order, status: newStatus } : order)))
    }
  }

  const sendWhatsAppMessage = async (order: Order) => {
    try {
      const response = await fetch("/api/whatsapp-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId: order.id }),
      })

      const data = await response.json()
      if (data.success) {
        window.open(data.whatsappUrl, "_blank")
        // Update local state
        setOrders((prev) => prev.map((o) => (o.id === order.id ? { ...o, whatsapp_sent: true } : o)))
      }
    } catch (error) {
      console.error("Error sending WhatsApp message:", error)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "secondary"
      case "confirmed":
        return "default"
      case "processing":
        return "default"
      case "shipped":
        return "default"
      case "delivered":
        return "default"
      case "cancelled":
        return "destructive"
      default:
        return "outline"
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Lista de Pedidos</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Pedido</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>WhatsApp</TableHead>
              <TableHead>Data</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell>
                  <p className="font-medium">#{order.order_number}</p>
                </TableCell>
                <TableCell>
                  <div>
                    <p className="font-medium">
                      {order.profiles?.first_name} {order.profiles?.last_name}
                    </p>
                    <p className="text-sm text-muted-foreground">{order.customer_info?.email}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <p className="font-medium">R$ {order.total_amount.toFixed(2)}</p>
                </TableCell>
                <TableCell>
                  <Select value={order.status} onValueChange={(value) => updateOrderStatus(order.id, value)}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pendente</SelectItem>
                      <SelectItem value="confirmed">Confirmado</SelectItem>
                      <SelectItem value="processing">Processando</SelectItem>
                      <SelectItem value="shipped">Enviado</SelectItem>
                      <SelectItem value="delivered">Entregue</SelectItem>
                      <SelectItem value="cancelled">Cancelado</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  <Badge variant={order.whatsapp_sent ? "default" : "secondary"}>
                    {order.whatsapp_sent ? "Enviado" : "Pendente"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <p className="text-sm">{new Date(order.created_at).toLocaleDateString("pt-BR")}</p>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => sendWhatsAppMessage(order)}
                      title="Enviar via WhatsApp"
                    >
                      <MessageCircle className="h-4 w-4" />
                    </Button>
                    {order.customer_info?.phone && (
                      <Button variant="ghost" size="icon" asChild>
                        <a
                          href={`https://wa.me/55${order.customer_info.phone.replace(/\D/g, "")}`}
                          target="_blank"
                          title="Contatar cliente"
                          rel="noreferrer"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
