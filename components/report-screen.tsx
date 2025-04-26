"use client"

import { useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { AlertTriangle, CheckCircle, BarChart2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "@/components/ui/chart"

interface ReportScreenProps {
  stats: {
    real: number
    fake: number
  }
  fakeReviews: string[]
}

export default function ReportScreen({ stats, fakeReviews }: ReportScreenProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight

    // Animation variables
    let particles: Array<{
      x: number
      y: number
      radius: number
      color: string
      speedX: number
      speedY: number
    }> = []

    // Create particles
    const createParticles = () => {
      particles = []
      const particleCount = 50

      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          radius: Math.random() * 3 + 1,
          color: i % 2 === 0 ? "#8919A5" : "#E23F8B",
          speedX: (Math.random() - 0.5) * 2,
          speedY: (Math.random() - 0.5) * 2,
        })
      }
    }

    // Update particles
    const updateParticles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particles.forEach((particle) => {
        // Update position
        particle.x += particle.speedX
        particle.y += particle.speedY

        // Bounce off edges
        if (particle.x < 0 || particle.x > canvas.width) {
          particle.speedX *= -1
        }

        if (particle.y < 0 || particle.y > canvas.height) {
          particle.speedY *= -1
        }

        // Draw particle
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2)
        ctx.fillStyle = particle.color
        ctx.globalAlpha = 0.5
        ctx.fill()
      })

      // Connect particles with lines
      ctx.globalAlpha = 0.2
      ctx.strokeStyle = "#8919A5"

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < 100) {
            ctx.beginPath()
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.stroke()
          }
        }
      }

      requestAnimationFrame(updateParticles)
    }

    createParticles()
    updateParticles()

    return () => {
      // Cleanup
      particles = []
    }
  }, [])

  const data = [
    { name: "Real Reviews", value: stats.real },
    { name: "Fake Reviews", value: stats.fake },
  ]

  const COLORS = ["#4CAF50", "#8919A5"]

  const totalReviews = stats.real + stats.fake
  const fakePercentage = totalReviews > 0 ? Math.round((stats.fake / totalReviews) * 100) : 0

  return (
    <div className="space-y-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center space-y-4"
      >
        <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
          Analysis <span className="text-[#8919A5]">Complete</span>
        </h2>
        <p className="text-xl text-gray-300">
          We've analyzed {totalReviews} reviews and identified potential fake reviews
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 relative overflow-hidden"
        >
          <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

          <div className="relative z-10">
            <h3 className="text-2xl font-bold mb-6">Review Authenticity</h3>

            <div className="h-80 relative">
              {/* Animated decorative elements around the chart */}
              <div className="absolute inset-0 z-0">
                {Array.from({ length: 8 }).map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-3 h-3"
                    style={{
                      left: "calc(50% - 1.5px)",
                      top: "calc(50% - 1.5px)",
                      background: i % 2 === 0 ? "#8919A5" : "#4CAF50",
                      borderRadius: i % 3 === 0 ? "50%" : i % 3 === 1 ? "0%" : "30%",
                    }}
                    animate={{
                      x: Math.cos(i * (Math.PI / 4)) * 160,
                      y: Math.sin(i * (Math.PI / 4)) * 160,
                      rotate: [0, 360],
                      scale: [1, i % 2 === 0 ? 1.5 : 0.8, 1],
                    }}
                    transition={{
                      x: { duration: 20, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" },
                      y: { duration: 20, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" },
                      rotate: { duration: 10, repeat: Number.POSITIVE_INFINITY, ease: "linear" },
                      scale: { duration: 3, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" },
                    }}
                  />
                ))}
              </div>

              {/* Animated rings */}
              <div className="absolute inset-0 z-0 flex items-center justify-center">
                {[140, 150, 160].map((size, i) => (
                  <motion.div
                    key={i}
                    className="absolute rounded-full border border-dashed"
                    style={{
                      width: size,
                      height: size,
                      borderColor: i % 2 === 0 ? "#8919A5" : "#4CAF50",
                      opacity: 0.3,
                    }}
                    animate={{ rotate: i % 2 === 0 ? 360 : -360 }}
                    transition={{ duration: 20 + i * 5, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                  />
                ))}
              </div>

              {/* Main chart */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="relative z-10"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <defs>
                      <linearGradient id="colorReal" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#4CAF50" stopOpacity={1} />
                        <stop offset="100%" stopColor="#2E7D32" stopOpacity={1} />
                      </linearGradient>
                      <linearGradient id="colorFake" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#E23F8B" stopOpacity={1} />
                        <stop offset="100%" stopColor="#8919A5" stopOpacity={1} />
                      </linearGradient>
                      <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur stdDeviation="4" result="blur" />
                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                      </filter>
                    </defs>

                    {/* Background circle */}
                    <Pie
                      data={[{ value: 1 }]}
                      cx="50%"
                      cy="50%"
                      innerRadius={75}
                      outerRadius={125}
                      fill="#1E1E1E"
                      stroke="none"
                      dataKey="value"
                    />

                    {/* Animated pie chart */}
                    <Pie
                      data={data}
                      cx="50%"
                      cy="50%"
                      innerRadius={80}
                      outerRadius={120}
                      paddingAngle={5}
                      dataKey="value"
                      startAngle={90}
                      endAngle={-270}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      labelLine={false}
                      animationBegin={300}
                      animationDuration={1500}
                      filter="url(#glow)"
                    >
                      {data.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={index === 0 ? "url(#colorReal)" : "url(#colorFake)"}
                          stroke={index === 0 ? "#4CAF50" : "#8919A5"}
                          strokeWidth={2}
                        />
                      ))}
                    </Pie>

                    <Tooltip
                      contentStyle={{
                        backgroundColor: "rgba(0, 0, 0, 0.8)",
                        borderColor: "#8919A5",
                        borderRadius: "8px",
                        boxShadow: "0 4px 20px rgba(137, 25, 165, 0.3)",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>

                {/* Central content */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div
                    className="text-center bg-black/50 backdrop-blur-sm rounded-full w-32 h-32 flex flex-col items-center justify-center"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 1, duration: 0.5, type: "spring" }}
                  >
                    <motion.div
                      className="text-3xl font-bold text-white"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1.3, duration: 0.5 }}
                    >
                      {totalReviews}
                    </motion.div>
                    <motion.div
                      className="text-sm text-gray-300"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1.5, duration: 0.5 }}
                    >
                      Total Reviews
                    </motion.div>
                  </motion.div>
                </div>
              </motion.div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="bg-white/10 rounded-xl p-4 text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="font-medium">Real Reviews</span>
                </div>
                <div className="text-3xl font-bold">{stats.real}</div>
              </div>

              <div className="bg-white/10 rounded-xl p-4 text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <AlertTriangle className="h-5 w-5 text-[#8919A5]" />
                  <span className="font-medium">Fake Reviews</span>
                </div>
                <div className="text-3xl font-bold">{stats.fake}</div>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="space-y-6"
        >
          <div className="bg-gradient-to-br from-white/10 to-black/40 backdrop-blur-sm rounded-2xl p-6 border border-white/10 relative overflow-hidden">
            {/* Animated background elements */}
            <motion.div
              className="absolute -left-20 -top-20 w-64 h-64 rounded-full bg-gradient-to-r from-green-500/20 to-[#8919A5]/20 blur-3xl"
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, -45, 0],
              }}
              transition={{
                duration: 10,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "reverse",
              }}
            />

            {/* Header with animated icon */}
            <div className="flex items-center gap-3 mb-6 relative z-10">
              <motion.div
                animate={{
                  rotate: [0, 360],
                }}
                transition={{
                  duration: 10,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "linear",
                }}
                className="bg-gradient-to-br from-green-500 to-green-700 p-2 rounded-lg"
              >
                <BarChart2 className="h-6 w-6 text-white" />
              </motion.div>
              <h3 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Summary
              </h3>
            </div>

            <div className="space-y-6 relative z-10">
              {/* Animated stats */}
              {[
                { label: "Total Reviews Analyzed", value: totalReviews, color: "white" },
                { label: "Fake Review Percentage", value: `${fakePercentage}%`, color: "#8919A5" },
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  className="flex items-center justify-between relative"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.2, duration: 0.5 }}
                >
                  <div className="flex items-center gap-2">
                    <motion.div
                      animate={{
                        scale: [1, 1.2, 1],
                        rotate: [0, 5, -5, 0],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Number.POSITIVE_INFINITY,
                        repeatType: "reverse",
                        delay: index * 0.3,
                      }}
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: stat.color }}
                    />
                    <span>{stat.label}</span>
                  </div>

                  <motion.span
                    className="font-bold"
                    style={{ color: stat.color }}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{
                      delay: 0.6 + index * 0.2,
                      type: "spring",
                      stiffness: 500,
                      damping: 15,
                    }}
                  >
                    {stat.value}
                  </motion.span>

                  {/* Animated line connecting */}
                  <motion.div
                    className="absolute top-1/2 left-0 right-0 h-px bg-white/10 -z-10"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: 0.5 + index * 0.2, duration: 0.8 }}
                  />
                </motion.div>
              ))}

              {/* Enhanced progress bar */}
              <div className="mt-6 relative">
                <div className="h-4 bg-black/40 rounded-full mt-2 overflow-hidden border border-white/10">
                  <motion.div
                    className="h-full bg-gradient-to-r from-green-500 to-[#8919A5] rounded-full relative"
                    initial={{ width: 0 }}
                    animate={{ width: `${100 - fakePercentage}%` }}
                    transition={{ delay: 0.8, duration: 1 }}
                  >
                    {/* Animated particles inside the progress bar */}
                    {Array.from({ length: 5 }).map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute top-0 bottom-0 w-2 bg-white/30"
                        style={{ left: `${i * 20}%` }}
                        animate={{
                          x: [0, 20, 0],
                          opacity: [0.3, 0.7, 0.3],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Number.POSITIVE_INFINITY,
                          repeatType: "reverse",
                          delay: i * 0.2,
                        }}
                      />
                    ))}
                  </motion.div>

                  {/* Animated marker */}
                  <motion.div
                    className="absolute top-0 bottom-0 w-1 bg-white"
                    style={{ left: `${100 - fakePercentage}%` }}
                    initial={{ height: 0 }}
                    animate={{ height: "100%" }}
                    transition={{ delay: 1.8, duration: 0.3 }}
                  />
                </div>

                <div className="flex justify-between text-sm text-gray-400 mt-2">
                  <motion.div
                    className="flex items-center gap-1"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1, duration: 0.5 }}
                  >
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                      className="w-3 h-3 rounded-full bg-green-500"
                    />
                    <span>Trustworthy</span>
                  </motion.div>

                  <motion.div
                    className="flex items-center gap-1"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1, duration: 0.5 }}
                  >
                    <span>Suspicious</span>
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                      className="w-3 h-3 rounded-full bg-[#8919A5]"
                    />
                  </motion.div>
                </div>
              </div>

              {/* Animated decorative elements */}
              <motion.div
                className="absolute -bottom-10 -right-10 w-40 h-40 opacity-20"
                animate={{
                  rotate: [0, 360],
                }}
                transition={{
                  duration: 20,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "linear",
                }}
              >
                <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                  <path d="M50,0 L100,50 L50,100 L0,50 Z" fill="none" stroke="#8919A5" strokeWidth="1" />
                  <path d="M50,10 L90,50 L50,90 L10,50 Z" fill="none" stroke="#8919A5" strokeWidth="1" />
                  <path d="M50,20 L80,50 L50,80 L20,50 Z" fill="none" stroke="#8919A5" strokeWidth="1" />
                  <path d="M50,30 L70,50 L50,70 L30,50 Z" fill="none" stroke="#8919A5" strokeWidth="1" />
                </svg>
              </motion.div>
            </div>
          </div>


        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="bg-gradient-to-br from-white/10 to-black/40 backdrop-blur-sm rounded-2xl p-6 border border-white/10 relative overflow-hidden"
      >
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <svg width="100%" height="100%" className="absolute opacity-5">
            <pattern
              id="pattern-circles"
              x="0"
              y="0"
              width="50"
              height="50"
              patternUnits="userSpaceOnUse"
              patternContentUnits="userSpaceOnUse"
            >
              <circle id="pattern-circle" cx="10" cy="10" r="1.6257413380501518" fill="#8919A5" />
            </pattern>
            <rect id="rect" x="0" y="0" width="100%" height="100%" fill="url(#pattern-circles)" />
          </svg>

          <motion.div
            className="absolute -right-20 -bottom-20 w-64 h-64 rounded-full bg-gradient-to-r from-[#8919A5]/20 to-[#E23F8B]/20 blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 45, 0],
            }}
            transition={{
              duration: 10,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
            }}
          />
        </div>

        {/* Header with animated icon */}
        <div className="flex items-center gap-3 mb-6 relative z-10">
          <motion.div
            animate={{
              rotate: [0, 10, -10, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 3,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
            }}
            className="bg-gradient-to-br from-[#8919A5] to-[#E23F8B] p-2 rounded-lg"
          >
            <AlertTriangle className="h-6 w-6 text-white" />
          </motion.div>
          <h3 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            Identified Fake Reviews
          </h3>

          {/* Animated counter */}
          <motion.div
            className="ml-auto bg-[#8919A5]/20 text-[#8919A5] px-3 py-1 rounded-full flex items-center gap-1"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.8, type: "spring" }}
          >
            <span className="text-sm font-bold">{fakeReviews.length}</span>
            <span className="text-xs">detected</span>
          </motion.div>
        </div>

        <div className="space-y-4 relative z-10">
          {fakeReviews.length > 0 ? (
            fakeReviews.map((review, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 + index * 0.2, duration: 0.5 }}
                whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
              >
                <Card className="bg-gradient-to-br from-black/60 to-black/40 border-[#8919A5]/30 p-4 overflow-hidden relative">
                  {/* Animated highlight effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-[#8919A5]/0 via-[#8919A5]/10 to-[#8919A5]/0"
                    animate={{
                      x: ["-100%", "100%"],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "linear",
                      delay: index * 0.5,
                    }}
                  />

                  <div className="flex gap-3 relative z-10">
                    <motion.div
                      animate={{
                        scale: [1, 1.2, 1],
                        rotate: [0, 5, -5, 0],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Number.POSITIVE_INFINITY,
                        repeatType: "reverse",
                        delay: index * 0.2,
                      }}
                      className="flex-shrink-0 mt-1"
                    >
                      <AlertTriangle className="h-5 w-5 text-[#8919A5]" />
                    </motion.div>

                    <div className="w-full">
                      <motion.p
                        className="text-gray-300"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1 + index * 0.2, duration: 0.5 }}
                      >
                        {review}
                      </motion.p>

                      <div className="flex flex-wrap gap-2 mt-3">
                        {["Excessive Enthusiasm", "Generic Language", "Suspicious Pattern"].map((tag, tagIndex) => (
                          <motion.span
                            key={tagIndex}
                            className="text-xs bg-gradient-to-r from-[#8919A5]/20 to-[#E23F8B]/20 text-[#8919A5] px-2 py-1 rounded-full border border-[#8919A5]/20 flex items-center gap-1"
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{
                              delay: 1.2 + index * 0.2 + tagIndex * 0.1,
                              type: "spring",
                              stiffness: 500,
                              damping: 15,
                            }}
                            whileHover={{ scale: 1.05 }}
                          >
                            <motion.span
                              animate={{ scale: [1, 1.2, 1] }}
                              transition={{
                                duration: 2,
                                repeat: Number.POSITIVE_INFINITY,
                                repeatType: "reverse",
                                delay: tagIndex * 0.3,
                              }}
                              className="inline-block w-2 h-2 rounded-full bg-[#8919A5]"
                            />
                            {tag}
                          </motion.span>
                        ))}
                      </div>


                    </div>
                  </div>
                </Card>
              </motion.div>
            ))
          ) : (
            <motion.div
              className="text-center py-12 text-gray-400"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.5 }}
            >
              <motion.div
                animate={{
                  y: [0, -10, 0],
                  rotate: [0, 5, -5, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: "reverse",
                }}
                className="text-5xl mb-4 inline-block"
              >
                ✓
              </motion.div>
              <p>No fake reviews detected</p>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  )
}
