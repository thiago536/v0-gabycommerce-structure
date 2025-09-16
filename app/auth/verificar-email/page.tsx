import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DynamicBackground } from "@/components/dynamic-background"
import { Header } from "@/components/header"
import { Mail } from "lucide-react"

export default function VerifyEmailPage() {
  return (
    <DynamicBackground>
      <Header />
      <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-6">
        <div className="w-full max-w-sm">
          <Card className="bg-card/80 backdrop-blur-sm">
            <CardHeader className="text-center">
              <Mail className="h-12 w-12 text-primary mx-auto mb-4" />
              <CardTitle className="text-2xl text-card-foreground">Verifique seu email</CardTitle>
              <CardDescription>Enviamos um link de confirmação para seu email</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground text-center">
                Clique no link que enviamos para seu email para ativar sua conta. Não esqueça de verificar sua caixa de
                spam!
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </DynamicBackground>
  )
}
