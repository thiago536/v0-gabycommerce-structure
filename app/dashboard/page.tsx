import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DynamicBackground } from "@/components/dynamic-background"
import { Header } from "@/components/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { User, ShoppingBag, Heart, Settings } from "lucide-react"
import Link from "next/link"

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()
  if (error || !user) {
    redirect("/auth/login")
  }

  // Get user profile
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  // Get user stats
  const { data: orders } = await supabase.from("orders").select("*").eq("user_id", user.id)
  const { data: favorites } = await supabase.from("favorites").select("*").eq("user_id", user.id)

  return (
    <DynamicBackground>
      <Header />
      <main className="py-8 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-primary mb-2">
              Olá, {profile?.first_name || user.email?.split("@")[0]}!
            </h1>
            <p className="text-muted-foreground">Bem-vindo ao seu painel GabySummer</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <Card className="bg-card/80 backdrop-blur-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pedidos</CardTitle>
                <ShoppingBag className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">{orders?.length || 0}</div>
                <p className="text-xs text-muted-foreground">Total de pedidos realizados</p>
              </CardContent>
            </Card>

            <Card className="bg-card/80 backdrop-blur-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Favoritos</CardTitle>
                <Heart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">{favorites?.length || 0}</div>
                <p className="text-xs text-muted-foreground">Produtos salvos</p>
              </CardContent>
            </Card>

            <Card className="bg-card/80 backdrop-blur-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Conta</CardTitle>
                <User className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">Ativa</div>
                <p className="text-xs text-muted-foreground">Status da conta</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Card className="bg-card/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-card-foreground">Ações Rápidas</CardTitle>
                <CardDescription>Acesse rapidamente suas funcionalidades favoritas</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button asChild className="w-full justify-start bg-transparent" variant="outline">
                  <Link href="/favoritos">
                    <Heart className="mr-2 h-4 w-4" />
                    Ver Favoritos
                  </Link>
                </Button>
                <Button asChild className="w-full justify-start bg-transparent" variant="outline">
                  <Link href="/carrinho">
                    <ShoppingBag className="mr-2 h-4 w-4" />
                    Ver Carrinho
                  </Link>
                </Button>
                <Button asChild className="w-full justify-start bg-transparent" variant="outline">
                  <Link href="/perfil">
                    <Settings className="mr-2 h-4 w-4" />
                    Editar Perfil
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-card/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-card-foreground">Últimos Pedidos</CardTitle>
                <CardDescription>Acompanhe seus pedidos recentes</CardDescription>
              </CardHeader>
              <CardContent>
                {orders && orders.length > 0 ? (
                  <div className="space-y-3">
                    {orders.slice(0, 3).map((order) => (
                      <div key={order.id} className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">#{order.order_number}</p>
                          <p className="text-sm text-muted-foreground">R$ {order.total_amount.toFixed(2)}</p>
                        </div>
                        <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">{order.status}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">Nenhum pedido ainda</p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </DynamicBackground>
  )
}
