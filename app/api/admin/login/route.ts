import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()

    if (!username || !password) {
      return NextResponse.json({ error: "Username and password are required" }, { status: 400 })
    }

    const supabase = await createClient()

    const { data, error } = await supabase
      .from("admin_users")
      .select("username, password_hash, is_active")
      .eq("username", username)
      .eq("is_active", true)
      .single()

    if (error || !data) {
      console.error("Database error:", error)
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    if (data.password_hash !== password) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    // Generate a simple session token
    const sessionToken = Buffer.from(`${username}:${Date.now()}`).toString("base64")

    return NextResponse.json({
      success: true,
      sessionToken,
      username,
    })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
