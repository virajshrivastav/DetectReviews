"use client"

import { useEffect, useRef } from "react"

interface Particle {
  x: number
  y: number
  size: number
  speedX: number
  speedY: number
  color: string
  opacity: number
  rotation: number
  rotationSpeed: number
}

export default function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    const setCanvasDimensions = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    setCanvasDimensions()
    window.addEventListener("resize", setCanvasDimensions)

    // Define header exclusion zone (to prevent particles from appearing behind the logo)
    const headerExclusionZone = {
      x: 0,
      y: 0,
      width: 300, // Width of the exclusion zone
      height: 100, // Height of the exclusion zone
    }

    // Create particles
    const particles: Particle[] = []
    const particleCount = Math.min(Math.floor(window.innerWidth / 10), 150)

    for (let i = 0; i < particleCount; i++) {
      // Generate random position
      let x = Math.random() * canvas.width
      let y = Math.random() * canvas.height

      // Ensure particles don't start in the header area
      while (
        x >= headerExclusionZone.x &&
        x <= headerExclusionZone.x + headerExclusionZone.width &&
        y >= headerExclusionZone.y &&
        y <= headerExclusionZone.y + headerExclusionZone.height
      ) {
        x = Math.random() * canvas.width
        y = Math.random() * canvas.height
      }

      particles.push({
        x,
        y,
        size: Math.random() * 5 + 1,
        speedX: (Math.random() - 0.5) * 1,
        speedY: (Math.random() - 0.5) * 1,
        color: i % 6 === 0 ? "#8919A5" : i % 6 === 1 ? "#E23F8B" : i % 6 === 2 ? "#EEB8A0" : i % 6 === 3 ? "#FF8F41" : i % 6 === 4 ? "#F84941" : "#B8294D",
        opacity: Math.random() * 0.5 + 0.1,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 2,
      })
    }

    // Draw shapes
    const drawShape = (
      x: number,
      y: number,
      size: number,
      rotation: number,
      color: string,
      opacity: number,
      type: number,
    ) => {
      ctx.save()
      ctx.translate(x, y)
      ctx.rotate((rotation * Math.PI) / 180)
      ctx.globalAlpha = opacity

      if (type < 0.33) {
        // Draw triangle
        ctx.beginPath()
        ctx.moveTo(0, -size)
        ctx.lineTo(size, size)
        ctx.lineTo(-size, size)
        ctx.closePath()
        ctx.fillStyle = color
        ctx.fill()
      } else if (type < 0.66) {
        // Draw square
        ctx.fillStyle = color
        ctx.fillRect(-size / 2, -size / 2, size, size)
      } else {
        // Draw circle
        ctx.beginPath()
        ctx.arc(0, 0, size / 2, 0, Math.PI * 2)
        ctx.fillStyle = color
        ctx.fill()
      }

      ctx.restore()
    }

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Update and draw particles
      particles.forEach((particle, index) => {
        particle.x += particle.speedX
        particle.y += particle.speedY
        particle.rotation += particle.rotationSpeed

        // Bounce off edges
        if (particle.x < 0 || particle.x > canvas.width) {
          particle.speedX *= -1
        }
        if (particle.y < 0 || particle.y > canvas.height) {
          particle.speedY *= -1
        }

        // Bounce particles away from the header area
        if (
          particle.x >= headerExclusionZone.x &&
          particle.x <= headerExclusionZone.x + headerExclusionZone.width &&
          particle.y >= headerExclusionZone.y &&
          particle.y <= headerExclusionZone.y + headerExclusionZone.height
        ) {
          // Push particles away from the header
          if (particle.y < headerExclusionZone.height / 2) {
            particle.speedY = -Math.abs(particle.speedY) // Push up
          } else {
            particle.speedY = Math.abs(particle.speedY) // Push down
          }

          if (particle.x < headerExclusionZone.width / 2) {
            particle.speedX = -Math.abs(particle.speedX) // Push left
          } else {
            particle.speedX = Math.abs(particle.speedX) // Push right
          }

          // Move the particle out of the exclusion zone immediately
          particle.x += particle.speedX * 5
          particle.y += particle.speedY * 5
        }

        // Draw particle
        drawShape(
          particle.x,
          particle.y,
          particle.size,
          particle.rotation,
          particle.color,
          particle.opacity,
          index / particles.length,
        )
      })

      // Draw connections
      ctx.strokeStyle = "#8919A5" // Purple
      ctx.lineWidth = 0.3
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const distance = Math.sqrt(dx * dx + dy * dy)

          // Skip connections if either particle is in the header area
          const particle1InHeader =
            particles[i].x >= headerExclusionZone.x &&
            particles[i].x <= headerExclusionZone.x + headerExclusionZone.width &&
            particles[i].y >= headerExclusionZone.y &&
            particles[i].y <= headerExclusionZone.y + headerExclusionZone.height

          const particle2InHeader =
            particles[j].x >= headerExclusionZone.x &&
            particles[j].x <= headerExclusionZone.x + headerExclusionZone.width &&
            particles[j].y >= headerExclusionZone.y &&
            particles[j].y <= headerExclusionZone.y + headerExclusionZone.height

          if (distance < 150 && !particle1InHeader && !particle2InHeader) {
            ctx.globalAlpha = 0.2 * (1 - distance / 150)
            ctx.beginPath()
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.stroke()
          }
        }
      }

      requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", setCanvasDimensions)
    }
  }, [])

  return <canvas ref={canvasRef} className="fixed inset-0 z-0" />
}
