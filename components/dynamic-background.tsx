"use client"

import type React from "react"

import { useEffect, useState } from "react"

interface DynamicBackgroundProps {
  category?: string
  children: React.ReactNode
}

const backgroundImages = {
  "moda-praia": "/placeholder.svg?height=1080&width=1920",
  fitness: "/placeholder.svg?height=1080&width=1920",
  acessorios: "/placeholder.svg?height=1080&width=1920",
  default: "/placeholder.svg?height=1080&width=1920",
}

export function DynamicBackground({ category = "default", children }: DynamicBackgroundProps) {
  const [currentBg, setCurrentBg] = useState(backgroundImages.default)

  useEffect(() => {
    const bgImage = backgroundImages[category as keyof typeof backgroundImages] || backgroundImages.default
    setCurrentBg(bgImage)
  }, [category])

  return (
    <div
      className="min-h-screen dynamic-background"
      style={{
        backgroundImage: `url(${currentBg})`,
      }}
    >
      <div className="category-overlay min-h-screen">{children}</div>
    </div>
  )
}
