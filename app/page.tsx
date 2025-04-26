"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Upload, AlertTriangle } from "lucide-react"
import AboutSection from "@/components/about-section"
import FileUploadModal from "@/components/file-upload-modal"
import LoadingScreen from "@/components/loading-screen"
import ReportScreen from "@/components/report-screen"
import AnimatedBackground from "@/components/animated-background"
import { Button } from "@/components/ui/button"

export default function Home() {
  const [currentScreen, setCurrentScreen] = useState<"home" | "loading" | "report">("home")
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [fakeReviews, setFakeReviews] = useState<string[]>([])
  const [reviewStats, setReviewStats] = useState({ real: 0, fake: 0 })

  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return

    setShowUploadModal(false)
    setCurrentScreen("loading")

    try {
      // Create a FormData object to send the file
      const formData = new FormData()
      formData.append('file', files[0])
      formData.append('model', 'thudm/glm-4-9b:free') // Use a faster free model

      // Get the API URL and protocol from environment variables or use defaults
      // Try to use the direct URL first if available
      const directUrl = process.env.NEXT_PUBLIC_API_DIRECT_URL
      const apiHost = process.env.NEXT_PUBLIC_API_URL || 'localhost:8000'
      const apiProtocol = process.env.NEXT_PUBLIC_API_PROTOCOL || 'http'

      // Construct the full URL with appropriate protocol
      // If direct URL is available, use it
      // Otherwise, if apiHost already includes http:// or https://, use it as is
      // Otherwise, construct the URL from protocol and host
      const apiUrl = directUrl || (apiHost.startsWith('http') ? apiHost : `${apiProtocol}://${apiHost}`)

      console.log('Using API URL:', apiUrl)

      // Send the file to the API
      console.log('Sending request to:', `${apiUrl}/api/analyze`)

      let response;
      try {
        response = await fetch(`${apiUrl}/api/analyze`, {
          method: 'POST',
          body: formData,
          mode: 'cors',
          credentials: 'omit',
          headers: {
            'Accept': 'application/json',
          },
        })

        console.log('Response status:', response.status)

        if (!response.ok) {
          const errorText = await response.text()
          console.error('Error response:', errorText)
          throw new Error(`API request failed with status ${response.status}: ${errorText}`)
        }
      } catch (fetchError) {
        console.error('Fetch error:', fetchError)
        throw new Error(`Network error: ${fetchError.message}`)
      }

      // Parse the response
      const data = await response.json()

      if (data.error) {
        throw new Error(data.error)
      }

      // Update the state with the analysis results
      setReviewStats({
        real: data.stats.real || 0,
        fake: data.stats.fake || 0,
      })

      setFakeReviews(data.fakeReviews || [])
      setCurrentScreen("report")
    } catch (error) {
      console.error('Error analyzing reviews:', error)

      // Show an error message and return to home screen
      alert(`Error analyzing reviews: ${error instanceof Error ? error.message : 'Unknown error'}`)
      setCurrentScreen("home")
    }
  }

  return (
    <main className="min-h-screen bg-black text-white overflow-hidden">
      {/* Enhanced animated background */}
      <AnimatedBackground />

      {/* Header */}
      <header className="relative z-10 p-6">
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, type: "spring", bounce: 0.5 }}
          className="flex items-center justify-between"
        >
          <div className="flex items-center gap-2">
            <motion.div
              initial={{ rotate: 0 }}
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            >
              <AlertTriangle className="h-8 w-8 text-[#8919A5]" />
            </motion.div>
            <h1 className="text-4xl font-bold tracking-tighter">
              <span className="text-[#8919A5]">FAKE</span>DETECTOR
            </h1>
          </div>

          {currentScreen === "home" && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  onClick={() => setShowUploadModal(true)}
                  className="bg-gradient-to-r from-[#8919A5] to-[#E23F8B] hover:from-[#E23F8B] hover:to-[#8919A5] text-white rounded-full px-6 py-2 font-bold flex items-center gap-2 shadow-lg shadow-[#8919A5]/20"
                >
                  <Upload className="h-5 w-5" />
                  <span>Scan Reviews</span>
                </Button>
              </motion.div>
            </motion.div>
          )}

          {currentScreen !== "home" && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <Button
                onClick={() => setCurrentScreen("home")}
                variant="outline"
                className="border-[#8919A5] text-[#8919A5] hover:bg-[#8919A5]/10 rounded-full px-6 py-2 font-bold"
              >
                Back to Home
              </Button>
            </motion.div>
          )}
        </motion.div>
      </header>

      {/* Main content */}
      <AnimatePresence mode="wait">
        {currentScreen === "home" && (
          <motion.div
            key="home"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="relative z-10 container mx-auto px-4 py-12"
          >
            <AboutSection />
          </motion.div>
        )}

        {currentScreen === "loading" && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="relative z-10 container mx-auto px-4 py-12"
          >
            <LoadingScreen />
          </motion.div>
        )}

        {currentScreen === "report" && (
          <motion.div
            key="report"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="relative z-10 container mx-auto px-4 py-12"
          >
            <ReportScreen stats={reviewStats} fakeReviews={fakeReviews} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* File upload modal */}
      <AnimatePresence>
        {showUploadModal && <FileUploadModal onClose={() => setShowUploadModal(false)} onUpload={handleFileUpload} />}
      </AnimatePresence>
    </main>
  )
}
