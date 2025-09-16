import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DynamicBackground } from "@/components/dynamic-background"
import { Header } from "@/components/header"
import { ProfileForm } from "@/components/profile-form"

export default async function ProfilePage() {
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

  return (
    <DynamicBackground>
      <Header />
      <main className="py-8 px-4">
        <div className="container mx-auto max-w-2xl">
          <h1 className="text-3xl font-bold text-primary mb-8">Meu Perfil</h1>
          <ProfileForm user={user} profile={profile} />
        </div>
      </main>
    </DynamicBackground>
  )
}
