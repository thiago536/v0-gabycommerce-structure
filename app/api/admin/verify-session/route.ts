import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { sessionToken } = await request.json()

    if (!sessionToken) {
      return NextResponse.json({ valid: false, error: "No session token provided" }, { status: 401 })
    }

    // Simple session validation (in production, use proper JWT validation)
    try {
      const decoded = Buffer.from(sessionToken, "base64").toString("utf-8")
      const [username, timestamp] = decoded.split(":")

      // Check if session is not older than 24 hours
      const sessionAge = Date.now() - Number.parseInt(timestamp)
      const maxAge = 24 * 60 * 60 * 1000 // 24 hours

      if (sessionAge > maxAge) {
        return NextResponse.json({ valid: false, error: "Session expired" }, { status: 401 })
      }

      return NextResponse.json({
        valid: true,
        username,
      })
    } catch (error) {
      return NextResponse.json({ valid: false, error: "Invalid session token" }, { status: 401 })
    }
  } catch (error) {
    console.error("Session verification error:", error)
    return NextResponse.json({ valid: false, error: "Internal server error" }, { status: 500 })
  }
}
