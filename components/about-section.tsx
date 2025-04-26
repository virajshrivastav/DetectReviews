"use client"

import { motion } from "framer-motion"
import { FileText, ShieldAlert, BarChart2 } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function AboutSection() {
  const features = [
    {
      icon: <FileText className="h-10 w-10 text-[#8919A5]" />,
      title: "Review Analysis",
      description: "Our system scans and analyzes thousands of reviews in seconds using advanced AI algorithms.",
    },
    {
      icon: <ShieldAlert className="h-10 w-10 text-[#E23F8B]" />,
      title: "Fake Detection",
      description: "Identifies suspicious patterns and language that indicate fake or paid reviews.",
    },
    {
      icon: <BarChart2 className="h-10 w-10 text-[#FF8F41]" />,
      title: "Detailed Reports",
      description: "Get comprehensive reports with visual breakdowns of authentic vs. fake reviews.",
    },
  ]

  return (
    <div className="space-y-16">
      {/* Hero section */}
      <div className="flex flex-col items-center text-center space-y-8">
        <motion.h1
          className="text-6xl md:text-8xl font-bold tracking-tighter"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="text-[#8919A5]">FAKE</span> REVIEW <br />
          <motion.span
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            DETECTOR
          </motion.span>
        </motion.h1>

        <motion.p
          className="text-xl text-gray-300 max-w-2xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          Our cutting-edge AI system helps you identify fake reviews with unparalleled accuracy. Protect your business
          and customers from misleading information.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          <Button
            className="bg-[#8919A5] hover:bg-[#8919A5]/80 text-white rounded-full px-8 py-6 text-lg font-bold"
            onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" })}
          >
            Learn More
          </Button>
        </motion.div>
      </div>

      {/* Enhanced animated 3D text with floating elements */}
      <div className="relative h-60 md:h-80 overflow-hidden my-16">
        <motion.div
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
        >
          {/* Floating shapes */}
          {Array.from({ length: 15 }).map((_, i) => {
            // Use deterministic values based on index instead of random
            const leftPos = (i * 7) % 100;
            const topPos = (i * 13) % 100;
            const xOffset = 30 + (i % 5) * 10;
            const yOffset = 25 + (i % 3) * 10;
            const rotation = (i * 24) % 360;
            const duration = 10 + (i % 5) * 2;

            return (
              <motion.div
                key={i}
                className="absolute"
                style={{
                  left: `${leftPos}%`,
                  top: `${topPos}%`,
                }}
                animate={{
                  x: [0, xOffset - 25, 0],
                  y: [0, yOffset - 15, 0],
                  rotate: [0, rotation, 0],
                }}
                transition={{
                  duration: duration,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }}
              >
                <div
                  className={`
              ${i % 3 === 0 ? "bg-[#8919A5]" : i % 3 === 1 ? "bg-[#E23F8B]" : "bg-[#FF8F41]"}
              ${i % 3 === 0 ? "h-8 w-8 rounded-full" : i % 3 === 1 ? "h-10 w-10 rotate-45" : "h-6 w-6 rounded-md"}
            `}
                  style={{ opacity: 0.2 }}
                />
              </motion.div>
            );
          })}

          {/* 3D Text */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            animate={{
              rotateX: [0, 10, 0, -10, 0],
              rotateY: [0, 15, 0, -15, 0],
              z: [0, 50, 0, -50, 0],
            }}
            transition={{
              duration: 8,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          >
            <div className="relative">
              {/* Shadow text for 3D effect */}
              <h2 className="absolute text-8xl md:text-9xl font-extrabold tracking-tighter text-black opacity-30 blur-sm transform translate-x-2 translate-y-2">
                REAL OR FAKE?
              </h2>

              {/* Main text */}
              <h2 className="relative text-8xl md:text-9xl font-extrabold tracking-tighter bg-gradient-to-r from-[#8919A5] to-[#E23F8B] text-transparent bg-clip-text drop-shadow-[0_0_15px_rgba(137,25,165,0.5)]">
                REAL OR FAKE?
              </h2>

              {/* Glowing outline */}
              <motion.div
                className="absolute inset-0 text-8xl md:text-9xl font-extrabold tracking-tighter text-transparent"
                style={{
                  WebkitTextStroke: "2px #8919A5",
                  filter: "blur(4px)",
                  opacity: 0.5,
                }}
                animate={{ opacity: [0.3, 0.7, 0.3] }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
              >
                REAL OR FAKE?
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Enhanced Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:border-[#8919A5]/30 transition-all overflow-hidden relative group"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 + index * 0.2, duration: 0.5 }}
            whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
          >
            {/* Background glow effect */}
            <motion.div
              className="absolute -inset-1 bg-gradient-to-r from-[#8919A5] to-[#E23F8B] opacity-0 group-hover:opacity-30 blur-xl transition-opacity duration-500"
              animate={{
                rotate: [0, 360],
              }}
              transition={{
                duration: 10,
                repeat: Number.POSITIVE_INFINITY,
                ease: "linear",
              }}
            />

            {/* Icon with animation */}
            <motion.div
              className="bg-gradient-to-br from-[#8919A5] to-[#E23F8B] rounded-2xl w-16 h-16 flex items-center justify-center mb-6 relative z-10"
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
            >
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: "reverse",
                }}
              >
                {feature.icon}
              </motion.div>

              {/* Pulsing effect */}
              <motion.div
                className="absolute inset-0 rounded-2xl bg-[#8919A5]"
                animate={{
                  opacity: [0, 0.5, 0],
                  scale: [1, 1.5, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: "loop",
                }}
                style={{ filter: "blur(8px)" }}
              />
            </motion.div>

            <motion.h3
              className="text-2xl font-bold mb-2 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent"
              whileHover={{ x: 5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              {feature.title}
            </motion.h3>

            <p className="text-gray-300 relative z-10">{feature.description}</p>

            {/* Decorative elements */}
            <motion.div
              className="absolute -bottom-4 -right-4 w-24 h-24 rounded-full bg-gradient-to-r from-[#8919A5]/20 to-[#E23F8B]/20 blur-xl"
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 45, 0],
              }}
              transition={{
                duration: 5,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "reverse",
              }}
            />
          </motion.div>
        ))}
      </div>

      {/* How it works - with floating animation */}
      <motion.div
        className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 md:p-12 relative overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8, duration: 0.8 }}
        whileHover={{ boxShadow: "0 0 30px rgba(137, 25, 165, 0.2)" }}
      >
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          {Array.from({ length: 10 }).map((_, i) => {
            // Use deterministic values based on index
            const width = 50 + (i * 10) % 100;
            const height = 50 + (i * 8) % 100;
            const leftPos = (i * 9) % 100;
            const topPos = (i * 11) % 100;
            const xOffset = (i * 5) % 25;
            const yOffset = (i * 7) % 25;
            const scaleMax = 1 + (0.5 + (i % 5) * 0.1);
            const duration = 5 + (i % 5);

            return (
              <motion.div
                key={i}
                className="absolute rounded-full bg-[#8919A5]/10"
                style={{
                  width: width,
                  height: height,
                  left: `${leftPos}%`,
                  top: `${topPos}%`,
                }}
                animate={{
                  x: [0, xOffset - 12.5, 0],
                  y: [0, yOffset - 12.5, 0],
                  scale: [1, scaleMax, 1],
                }}
                transition={{
                  duration: duration,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }}
              />
            );
          })}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
          {[
            {
              step: 1,
              title: "Upload Reviews",
              description: "Upload your review data in Excel format.",
            },
            {
              step: 2,
              title: "AI Analysis",
              description: "Our AI scans for patterns, language anomalies, and suspicious content.",
            },
            {
              step: 3,
              title: "Get Results",
              description: "Receive a detailed report with identified fake reviews and statistics.",
            },
          ].map((item, index) => (
            <motion.div
              key={index}
              className="text-center space-y-4 relative"
              whileHover={{ y: -10 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              {/* Connecting lines between steps */}
              {index < 2 && (
                <motion.div
                  className="hidden md:block absolute top-8 left-[calc(100%_-_16px)] h-0.5 w-8 bg-gradient-to-r from-white/30 to-transparent z-0"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 2 + index * 0.5, duration: 0.8 }}
                />
              )}

              {/* Step number with animation */}
              <motion.div
                className="relative mx-auto"
                initial={{ scale: 0 }}
                animate={{ scale: 1, rotate: [0, 360] }}
                transition={{
                  scale: { delay: 2 + index * 0.3, duration: 0.5, type: "spring" },
                  rotate: { delay: 2 + index * 0.3, duration: 0.8 },
                }}
              >
                <div className="bg-gradient-to-br from-gray-700 to-gray-900 rounded-full w-20 h-20 flex items-center justify-center mx-auto shadow-lg">
                  <motion.span
                    className="text-3xl font-bold text-white"
                    animate={{
                      scale: [1, 1.2, 1],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Number.POSITIVE_INFINITY,
                      repeatType: "reverse",
                      delay: index * 0.3,
                    }}
                  >
                    {item.step}
                  </motion.span>
                </div>


              </motion.div>

              <motion.h3
                className="text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 2.2 + index * 0.3, duration: 0.5 }}
              >
                {item.title}
              </motion.h3>

              <motion.p
                className="text-gray-300"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2.4 + index * 0.3, duration: 0.5 }}
              >
                {item.description}
              </motion.p>

              {/* Decorative icon */}
              <motion.div
                className="absolute -z-10 opacity-10 right-0 bottom-0"
                animate={{
                  rotate: [0, 10, -10, 0],
                  scale: [1, 1.1, 0.9, 1],
                }}
                transition={{
                  duration: 5,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: "reverse",
                }}
              >
                <div className="text-[80px] text-[#8919A5]">{index === 0 ? "📤" : index === 1 ? "🔍" : "📊"}</div>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
