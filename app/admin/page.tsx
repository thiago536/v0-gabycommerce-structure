import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { AdminDashboard } from "@/components/admin/admin-dashboard"

export default async function AdminPage() {
  const supabase = await createClient()

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()
  if (error || !user) {
    redirect("/auth/login")
  }

  // Check if user is admin
  const { data: profile } = await supabase.from("profiles").select("is_admin").eq("id", user.id).single()

  if (!profile?.is_admin) {
    redirect("/dashboard")
  }

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
  const { data: recentOrders } = await supabase
    .from("orders")
    .select(
      `
      *,
      profiles (first_name, last_name)
    `,
    )
    .order("created_at", { ascending: false })
    .limit(5)

  // Calculate total revenue
  const { data: revenueData } = await supabase.from("orders").select("total_amount").eq("status", "delivered")

  const totalRevenue = revenueData?.reduce((sum, order) => sum + order.total_amount, 0) || 0

  return (
    <AdminDashboard
      stats={{
        products: productsCount || 0,
        orders: ordersCount || 0,
        customers: customersCount || 0,
        categories: categoriesCount || 0,
        revenue: totalRevenue,
      }}
      recentOrders={recentOrders || []}
      lowStockProducts={products?.filter((p) => p.stock_quantity <= p.min_stock_alert) || []}
    />
  )
}
