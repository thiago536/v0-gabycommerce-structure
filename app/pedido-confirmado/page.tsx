import { DynamicBackground } from "@/components/dynamic-background"
import { Header } from "@/components/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, MessageCircle, Home } from "lucide-react"
import Link from "next/link"

interface OrderConfirmationPageProps {
  searchParams: Promise<{ order?: string }>
}

export default async function OrderConfirmationPage({ searchParams }: OrderConfirmationPageProps) {
  const { order } = await searchParams

  return (
    <DynamicBackground>
      <Header />
      <main className="py-16 px-4">
        <div className="container mx-auto max-w-2xl">
          <Card className="bg-card/80 backdrop-blur-sm text-center">
            <CardHeader>
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <CardTitle className="text-3xl text-card-foreground">Pedido Confirmado!</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {order && (
                <div className="bg-primary/10 p-4 rounded-lg">
                  <p className="text-lg font-semibold text-primary">Número do Pedido: #{order}</p>
                </div>
              )}

              <div className="space-y-4">
                <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg">
                  <MessageCircle className="h-6 w-6 text-green-600" />
                  <div className="text-left">
                    <p className="font-medium text-green-800">WhatsApp Enviado</p>
                    <p className="text-sm text-green-600">
                      Seu pedido foi enviado via WhatsApp. Nossa equipe entrará em contato em breve!
                    </p>
                  </div>
                </div>

                <div className="text-left space-y-2">
                  <h3 className="font-semibold">Próximos Passos:</h3>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Nossa equipe confirmará seu pedido via WhatsApp</li>
                    <li>• Você receberá informações sobre pagamento e entrega</li>
                    <li>• Acompanhe o status do seu pedido pelo WhatsApp</li>
                  </ul>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild>
                  <Link href="/">
                    <Home className="mr-2 h-4 w-4" />
                    Voltar à Loja
                  </Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/dashboard">Ver Meus Pedidos</Link>
                </Button>
              </div>

              <div className="text-sm text-muted-foreground">
                <p>
                  Dúvidas? Entre em contato conosco pelo WhatsApp:{" "}
                  <a
                    href="https://wa.me/5511999999999"
                    className="text-primary underline"
                    target="_blank"
                    rel="noreferrer"
                  >
                    (11) 99999-9999
                  </a>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </DynamicBackground>
  )
}
