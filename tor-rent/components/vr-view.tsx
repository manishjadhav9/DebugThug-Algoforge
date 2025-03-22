"use client"

import { useState } from "react"

import { useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { CuboidIcon as Cube, RotateCcw } from "lucide-react"

interface VRViewProps {
  propertyId: string
}

export function VRView({ propertyId }: VRViewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [rotation, setRotation] = useState(0)
  const animationRef = useRef<number>()

  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false)

      // Draw a simple 3D-like room
      const drawRoom = () => {
        if (!ctx) return

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height)

        // Set background
        ctx.fillStyle = "#f0f0f0"
        ctx.fillRect(0, 0, canvas.width, canvas.height)

        // Draw floor
        ctx.fillStyle = "#e0e0e0"
        ctx.beginPath()
        ctx.moveTo(100, 300)
        ctx.lineTo(700, 300)
        ctx.lineTo(600, 400)
        ctx.lineTo(200, 400)
        ctx.closePath()
        ctx.fill()

        // Draw back wall
        ctx.fillStyle = "#f8f8f8"
        ctx.beginPath()
        ctx.moveTo(100, 100)
        ctx.lineTo(700, 100)
        ctx.lineTo(700, 300)
        ctx.lineTo(100, 300)
        ctx.closePath()
        ctx.fill()

        // Draw side wall
        ctx.fillStyle = "#f5f5f5"
        ctx.beginPath()
        ctx.moveTo(700, 100)
        ctx.lineTo(700, 300)
        ctx.lineTo(600, 400)
        ctx.lineTo(600, 200)
        ctx.closePath()
        ctx.fill()

        // Draw window
        ctx.fillStyle = "#a8d5ff"
        ctx.beginPath()
        ctx.moveTo(300, 150)
        ctx.lineTo(500, 150)
        ctx.lineTo(500, 250)
        ctx.lineTo(300, 250)
        ctx.closePath()
        ctx.fill()

        // Window frame
        ctx.strokeStyle = "#888"
        ctx.lineWidth = 5
        ctx.strokeRect(300, 150, 200, 100)

        // Draw furniture based on rotation
        const furnitureOffset = Math.sin(rotation / 50) * 20

        // Draw sofa
        ctx.fillStyle = "#d35400"
        ctx.beginPath()
        ctx.moveTo(200 + furnitureOffset, 320)
        ctx.lineTo(400 + furnitureOffset, 320)
        ctx.lineTo(380 + furnitureOffset, 370)
        ctx.lineTo(220 + furnitureOffset, 370)
        ctx.closePath()
        ctx.fill()

        // Draw table
        ctx.fillStyle = "#8b4513"
        ctx.beginPath()
        ctx.moveTo(450 + furnitureOffset / 2, 330)
        ctx.lineTo(550 + furnitureOffset / 2, 330)
        ctx.lineTo(530 + furnitureOffset / 2, 380)
        ctx.lineTo(470 + furnitureOffset / 2, 380)
        ctx.closePath()
        ctx.fill()

        // Draw some text
        ctx.fillStyle = "#333"
        ctx.font = "16px Arial"
        ctx.fillText(`VR Tour: Property #${propertyId}`, 20, 30)
        ctx.fillText("Use arrow keys or drag to look around", 20, 60)

        // Update rotation for next frame
        setRotation((prev) => prev + 1)
      }

      // Animation loop
      const animate = () => {
        drawRoom()
        animationRef.current = requestAnimationFrame(animate)
      }

      animate()
    }, 1500)

    return () => {
      clearTimeout(timer)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [propertyId])

  return (
    <div className="relative w-full">
      {isLoading ? (
        <div className="flex h-[400px] w-full items-center justify-center bg-gray-100">
          <div className="flex flex-col items-center">
            <Cube className="h-12 w-12 animate-pulse text-orange-500" />
            <p className="mt-4 text-gray-500">Loading VR Tour...</p>
          </div>
        </div>
      ) : (
        <>
          <canvas ref={canvasRef} width={800} height={450} className="w-full rounded-md border" />
          <div className="absolute bottom-4 right-4 flex gap-2">
            <Button variant="outline" size="sm" className="bg-white" onClick={() => setRotation(0)}>
              <RotateCcw className="mr-1 h-4 w-4" />
              Reset View
            </Button>
          </div>
        </>
      )}
    </div>
  )
}

