"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { AdminDashboard } from "@/components/admin/mobile-admin-dashboard"

export default function AdminDashboardPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [stats, setStats] = useState({
    products: 0,
    orders: 0,
    customers: 0,
    categories: 0,
    revenue: 0,
  })
  const [recentOrders, setRecentOrders] = useState([])
  const [lowStockProducts, setLowStockProducts] = useState([])
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const sessionToken = localStorage.getItem("gabysummer_admin_session")
    if (!sessionToken) {
      router.push("/painel-admin")
      return
    }

    loadDashboardData()
  }, [router])

  const loadDashboardData = async () => {
    try {
      // Get dashboard stats
      const [
        { data: products, count: productsCount },
        { data: orders, count: ordersCount },
        { data: customers, count: customersCount },
        { data: categories, count: categoriesCount },
      ] = await Promise.all([
        supabase.from("products").select("*", { count: "exact" }).limit(5),
        supabase.from("orders").select("*", { count: "exact" }).limit(5),
        supabase.from("profiles").select("*", { count: "exact" }).limit(5),
        supabase.from("categories").select("*", { count: "exact" }),
      ])

      // Get recent orders with customer info
      const { data: recentOrdersData } = await supabase
        .from("orders")
        .select(`
          *,
          profiles (first_name, last_name)
        `)
        .order("created_at", { ascending: false })
        .limit(5)

      // Calculate total revenue
      const { data: revenueData } = await supabase.from("orders").select("total_amount").eq("status", "delivered")

      const totalRevenue = revenueData?.reduce((sum, order) => sum + order.total_amount, 0) || 0

      setStats({
        products: productsCount || 0,
        orders: ordersCount || 0,
        customers: customersCount || 0,
        categories: categoriesCount || 0,
        revenue: totalRevenue,
      })

      setRecentOrders(recentOrdersData || [])
      setLowStockProducts(products?.filter((p) => p.stock_quantity <= p.min_stock_alert) || [])
    } catch (error) {
      console.error("Error loading dashboard data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando painel...</p>
        </div>
      </div>
    )
  }

  return <AdminDashboard stats={stats} recentOrders={recentOrders} lowStockProducts={lowStockProducts} />
}
