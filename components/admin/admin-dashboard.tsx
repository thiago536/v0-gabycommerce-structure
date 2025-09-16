"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AdminSidebar } from "./admin-sidebar"
import { Package, ShoppingCart, Users, FolderOpen, DollarSign, AlertTriangle } from "lucide-react"
import Link from "next/link"

interface AdminDashboardProps {
  stats: {
    products: number
    orders: number
    customers: number
    categories: number
    revenue: number
  }
  recentOrders: any[]
  lowStockProducts: any[]
}

export function AdminDashboard({ stats, recentOrders, lowStockProducts }: AdminDashboardProps) {
  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />
      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-primary">Dashboard Administrativo</h1>
            <p className="text-muted-foreground">Visão geral do seu e-commerce GabySummer</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Produtos</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">{stats.products}</div>
                <p className="text-xs text-muted-foreground">Total de produtos</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pedidos</CardTitle>
                <ShoppingCart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">{stats.orders}</div>
                <p className="text-xs text-muted-foreground">Total de pedidos</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Clientes</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">{stats.customers}</div>
                <p className="text-xs text-muted-foreground">Clientes cadastrados</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Categorias</CardTitle>
                <FolderOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">{stats.categories}</div>
                <p className="text-xs text-muted-foreground">Categorias ativas</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Receita</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">R$ {stats.revenue.toFixed(2)}</div>
                <p className="text-xs text-muted-foreground">Receita total</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Recent Orders */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Pedidos Recentes
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/admin/pedidos">Ver Todos</Link>
                  </Button>
                </CardTitle>
                <CardDescription>Últimos pedidos realizados</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentOrders.length > 0 ? (
                    recentOrders.map((order) => (
                      <div key={order.id} className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">#{order.order_number}</p>
                          <p className="text-sm text-muted-foreground">
                            {order.profiles?.first_name} {order.profiles?.last_name}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">R$ {order.total_amount.toFixed(2)}</p>
                          <Badge
                            variant={
                              order.status === "delivered"
                                ? "default"
                                : order.status === "cancelled"
                                  ? "destructive"
                                  : "secondary"
                            }
                          >
                            {order.status}
                          </Badge>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-muted-foreground">Nenhum pedido encontrado</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Low Stock Alert */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-amber-500" />
                  Estoque Baixo
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/admin/produtos">Gerenciar</Link>
                  </Button>
                </CardTitle>
                <CardDescription>Produtos com estoque baixo</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {lowStockProducts.length > 0 ? (
                    lowStockProducts.map((product) => (
                      <div key={product.id} className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{product.name}</p>
                          <p className="text-sm text-muted-foreground">SKU: {product.sku}</p>
                        </div>
                        <div className="text-right">
                          <Badge variant="destructive">{product.stock_quantity} unidades</Badge>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-muted-foreground">Todos os produtos com estoque adequado</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
