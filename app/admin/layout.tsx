import type React from "react"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    redirect("/auth/login")
  }

  // Check if user is admin
  const { data: profile } = await supabase.from("profiles").select("role, is_admin").eq("id", user.id).single()

  const isAdmin = profile?.role === "admin" || profile?.is_admin === true

  if (!isAdmin) {
    redirect("/dashboard")
  }

  return <>{children}</>
}
