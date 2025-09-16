"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

export function useAdminAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [username, setUsername] = useState("")
  const router = useRouter()

  useEffect(() => {
    checkAuthStatus()
  }, [])

  const checkAuthStatus = async () => {
    const sessionToken = localStorage.getItem("gabysummer_admin_session")
    const storedUsername = localStorage.getItem("gabysummer_admin_username")

    if (!sessionToken) {
      setIsAuthenticated(false)
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch("/api/admin/verify-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ sessionToken }),
      })

      const data = await response.json()

      if (data.valid) {
        setIsAuthenticated(true)
        setUsername(storedUsername || data.username)
      } else {
        // Clear invalid session
        localStorage.removeItem("gabysummer_admin_session")
        localStorage.removeItem("gabysummer_admin_username")
        setIsAuthenticated(false)
      }
    } catch (error) {
      console.error("Auth check error:", error)
      setIsAuthenticated(false)
    }

    setIsLoading(false)
  }

  const logout = () => {
    localStorage.removeItem("gabysummer_admin_session")
    localStorage.removeItem("gabysummer_admin_username")
    setIsAuthenticated(false)
    setUsername("")
    router.push("/painel-admin")
  }

  return {
    isAuthenticated,
    isLoading,
    username,
    logout,
    checkAuthStatus,
  }
}
