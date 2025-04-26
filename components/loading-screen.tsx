"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Loader2 } from "lucide-react"

export default function LoadingScreen() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        // Reduced increment to make progress 3x slower
        const newProgress = prev + 0.27  // Changed from 0.8 to 0.27 (3x slower)
        return newProgress > 100 ? 100 : newProgress
      })
    }, 200)

    return () => {
      clearInterval(interval)
    }
  }, [])

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] space-y-12">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center space-y-6"
      >
        <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
          <span className="text-[#8919A5]">AI</span> is analyzing your reviews
        </h2>
        <p className="text-xl text-gray-300">Our advanced algorithms are scanning for fake reviews</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="relative w-full max-w-md"
      >
        <div className="h-3 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-[#8919A5]"
            initial={{ width: "0%" }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.2 }}
          />
        </div>
        <div className="flex justify-between mt-2 text-sm text-gray-400">
          <span>Analyzing</span>
          <span>{Math.round(progress)}%</span>
        </div>
      </motion.div>

      <div className="relative w-40 h-40 mx-auto">
        {/* Multiple rotating rings */}
        {[1, 2, 3].map((ring) => (
          <motion.div
            key={ring}
            className="absolute inset-0"
            style={{
              border: `${ring * 2}px solid rgba(137, 25, 165, ${0.3 / ring})`,
              borderRadius: "50%",
            }}
            animate={{
              rotate: [0, 360],
              scale: [1, 1 + ring * 0.05, 1],
            }}
            transition={{
              rotate: [0, 360],
              scale: [1, 1 + ring * 0.05, 1],
            }}
            transition={{
              rotate: { duration: 10 / ring, repeat: Number.POSITIVE_INFINITY, ease: "linear" },
              scale: { duration: 3, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" },
            }}
          />
        ))}

        {/* Glowing core */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-[#8919A5] to-[#E23F8B] rounded-full"
          style={{ filter: "blur(8px)" }}
          animate={{
            opacity: [0.5, 1, 0.5],
            scale: [0.8, 1, 0.8],
          }}
          transition={{
            duration: 2,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
          }}
        />

        {/* Central scanner animation */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative w-24 h-24 bg-black/40 backdrop-blur-sm border-2 border-[#8919A5] rounded-full overflow-hidden">
            {/* Scanning line animation */}
            <motion.div
              className="absolute left-0 w-full h-1 bg-[#8919A5]"
              initial={{ top: 0 }}
              animate={{ top: ["0%", "100%", "0%"] }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
            />

            {/* Rotating AI icon */}
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              animate={{ rotate: 360 }}
              transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            >
              <Loader2 className="h-10 w-10 text-[#8919A5]" />
            </motion.div>

            {/* Pulsing glow */}
            <motion.div
              className="absolute inset-0 bg-[#8919A5]"
              animate={{
                opacity: [0, 0.3, 0],
              }}
              transition={{
                duration: 1.5,
                repeat: Number.POSITIVE_INFINITY,
              }}
              style={{ filter: "blur(10px)" }}
            />
          </div>
        </div>

        {/* Orbiting particles */}
        {Array.from({ length: 8 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-4 h-4 rounded-full bg-[#8919A5]"
            style={{
              top: "calc(50% - 8px)",
              left: "calc(50% - 8px)",
            }}
            animate={{
              x: Math.cos(i * (Math.PI / 4)) * 80,
              y: Math.sin(i * (Math.PI / 4)) * 80,
              scale: [1, 1.5, 1],
              opacity: [0.7, 1, 0.7],
            }}
            transition={{
              x: { duration: 3, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" },
              y: { duration: 3, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" },
              scale: { duration: 2, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse", delay: i * 0.1 },
              opacity: { duration: 2, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse", delay: i * 0.1 },
            }}
          />
        ))}
      </div>

      <motion.div
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
        className="text-center"
      >
        <p className="text-lg font-medium text-[#8919A5]">Processing your data</p>
        <p className="text-sm text-gray-400 mt-1">Please wait while we analyze your reviews</p>
      </motion.div>


    </div>
  )
}
