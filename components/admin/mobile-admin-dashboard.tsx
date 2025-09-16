"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Package, ShoppingCart, Users, TrendingUp, Plus, LogOut, Menu, X, Grid3X3, AlertTriangle } from "lucide-react"

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
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const router = useRouter()

  const handleLogout = () => {
    localStorage.removeItem("gabysummer_admin_session")
    localStorage.removeItem("gabysummer_admin_username")
    router.push("/painel-admin")
  }

  const menuItems = [
    { icon: Grid3X3, label: "Dashboard", href: "/painel-admin/dashboard", active: true },
    { icon: Package, label: "Produtos", href: "/painel-admin/produtos" },
    { icon: ShoppingCart, label: "Pedidos", href: "/painel-admin/pedidos" },
    { icon: Users, label: "Clientes", href: "/painel-admin/clientes" },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(!sidebarOpen)} className="md:hidden">
              {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
            <h1 className="text-lg font-bold text-orange-900">GabySummer Admin</h1>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sair
          </Button>
        </div>
      </header>

      <div className="flex">
        {sidebarOpen && (
          <div className="fixed inset-0 z-30 bg-black bg-opacity-50 md:hidden" onClick={() => setSidebarOpen(false)} />
        )}

        <aside
          className={`
          fixed md:static inset-y-0 left-0 z-40 w-64 bg-white shadow-lg transform transition-transform duration-200 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
          md:block
        `}
        >
          <nav className="mt-4 px-4 space-y-2">
            {menuItems.map((item) => (
              <Button
                key={item.href}
                variant={item.active ? "default" : "ghost"}
                className={`w-full justify-start ${
                  item.active ? "bg-orange-500 hover:bg-orange-600" : "hover:bg-gray-100"
                }`}
                onClick={() => {
                  router.push(item.href)
                  setSidebarOpen(false)
                }}
              >
                <item.icon className="h-4 w-4 mr-3" />
                {item.label}
              </Button>
            ))}
          </nav>
        </aside>

        <main className="flex-1 p-4 md:p-6 space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Produtos</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.products}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pedidos</CardTitle>
                <ShoppingCart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.orders}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Clientes</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.customers}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Receita</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">R$ {stats.revenue.toFixed(2)}</div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Ações Rápidas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button
                  onClick={() => router.push("/painel-admin/produtos/adicionar")}
                  className="bg-orange-500 hover:bg-orange-600"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Produto
                </Button>
                <Button variant="outline" onClick={() => router.push("/painel-admin/pedidos")}>
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Ver Pedidos
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Low Stock Alert */}
          {lowStockProducts.length > 0 && (
            <Card className="border-orange-200">
              <CardHeader>
                <CardTitle className="text-lg flex items-center text-orange-800">
                  <AlertTriangle className="h-5 w-5 mr-2" />
                  Produtos com Estoque Baixo
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {lowStockProducts.slice(0, 3).map((product) => (
                    <div key={product.id} className="flex justify-between items-center p-2 bg-orange-50 rounded">
                      <span className="text-sm font-medium">{product.name}</span>
                      <Badge variant="destructive">{product.stock_quantity} restantes</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Recent Orders */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Pedidos Recentes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentOrders.slice(0, 5).map((order) => (
                  <div key={order.id} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                    <div>
                      <p className="font-medium text-sm">
                        {order.profiles?.first_name} {order.profiles?.last_name}
                      </p>
                      <p className="text-xs text-gray-500">{new Date(order.created_at).toLocaleDateString("pt-BR")}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-sm">R$ {order.total_amount.toFixed(2)}</p>
                      <Badge variant={order.status === "delivered" ? "default" : "secondary"}>{order.status}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  )
}
