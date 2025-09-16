"use client"

import type React from "react"

import { useState } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { DynamicBackground } from "@/components/dynamic-background"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

export default function AdminAccessPage() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const supabase = createClientComponentClient()
  const router = useRouter()

  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage("")

    try {
      // Verificar se o usuário existe
      const { data: existingProfile } = await supabase.from("profiles").select("*").eq("email", email).single()

      if (!existingProfile) {
        setMessage("Usuário não encontrado. O usuário deve se cadastrar primeiro no site.")
        setLoading(false)
        return
      }

      // Tornar o usuário admin
      const { error } = await supabase.from("profiles").update({ role: "admin" }).eq("email", email)

      if (error) {
        console.error("Erro ao criar admin:", error)
        setMessage("Erro ao criar administrador. Verifique se você tem permissões.")
        setLoading(false)
        return
      }

      toast.success("Administrador criado com sucesso!")
      setMessage(`Usuário ${email} agora é administrador e pode acessar /admin`)
      setEmail("")
    } catch (error) {
      console.error("Erro:", error)
      setMessage("Erro inesperado. Tente novamente.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen">
      <DynamicBackground category="admin" />
      <div className="relative z-10 container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-center text-orange-600">
                Criar Conta de Administrador
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateAdmin} className="space-y-4">
                <div>
                  <Label htmlFor="email">Email do Usuário</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="usuario@exemplo.com"
                    required
                  />
                  <p className="text-sm text-muted-foreground mt-1">O usuário deve estar cadastrado no sistema</p>
                </div>

                <Button type="submit" className="w-full bg-orange-500 hover:bg-orange-600" disabled={loading}>
                  {loading ? "Criando..." : "Criar Administrador"}
                </Button>
              </form>

              {message && (
                <Alert className="mt-4">
                  <AlertDescription>{message}</AlertDescription>
                </Alert>
              )}

              <div className="mt-6 p-4 bg-orange-50 rounded-lg">
                <h3 className="font-semibold text-orange-800 mb-2">Como acessar o admin:</h3>
                <ol className="text-sm text-orange-700 space-y-1">
                  <li>1. Cadastre-se normalmente no site</li>
                  <li>2. Use este formulário para se tornar admin</li>
                  <li>3. Faça login normalmente</li>
                  <li>
                    4. Acesse <code className="bg-orange-200 px-1 rounded">/admin</code>
                  </li>
                </ol>
              </div>

              <div className="mt-4 text-center">
                <Button variant="outline" onClick={() => router.push("/")}>
                  Voltar ao Site
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
