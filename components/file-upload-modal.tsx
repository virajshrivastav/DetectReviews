"use client"

import type React from "react"

import { useState, useRef } from "react"
import { motion } from "framer-motion"
import { Upload, X, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"

interface FileUploadModalProps {
  onClose: () => void
  onUpload: (files: FileList | null) => void
}

export default function FileUploadModal({ onClose, onUpload }: FileUploadModalProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setSelectedFiles(e.dataTransfer.files)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFiles(e.target.files)
    }
  }

  const handleUpload = () => {
    onUpload(selectedFiles)
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", damping: 25 }}
        className="bg-black border border-[#8919A5]/30 rounded-2xl w-full max-w-lg overflow-hidden"
      >
        <div className="flex justify-between items-center p-6 border-b border-[#8919A5]/20">
          <h2 className="text-2xl font-bold">Upload Reviews</h2>
          <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full hover:bg-[#8919A5]/10">
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="p-6 space-y-6">
          <div
            className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
              isDragging ? "border-[#8919A5] bg-[#8919A5]/10" : "border-gray-600 hover:border-[#8919A5]/50"
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept=".xlsx,.xls"
              multiple
            />

            <motion.div
              animate={{
                y: isDragging ? -10 : 0,
                scale: isDragging ? 1.1 : 1,
              }}
              className="flex flex-col items-center gap-4 cursor-pointer"
            >
              <div className="bg-[#8919A5]/20 rounded-full p-4">
                <Upload className="h-8 w-8 text-[#8919A5]" />
              </div>
              <div>
                <p className="text-lg font-medium">
                  {isDragging ? "Drop files here" : "Drag & drop files or click to browse"}
                </p>
                <p className="text-sm text-gray-400 mt-1">Supports Excel files only</p>
              </div>
            </motion.div>
          </div>

          {selectedFiles && selectedFiles.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
              <h3 className="font-medium">Selected Files:</h3>
              <div className="max-h-40 overflow-y-auto space-y-2">
                {Array.from(selectedFiles).map((file, index) => (
                  <div key={index} className="flex items-center gap-2 bg-white/5 p-2 rounded-lg">
                    <FileText className="h-5 w-5 text-[#8919A5]" />
                    <span className="text-sm truncate">{file.name}</span>
                    <span className="text-xs text-gray-400 ml-auto">{(file.size / 1024).toFixed(1)} KB</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>

        <div className="p-6 border-t border-[#8919A5]/20 flex justify-end gap-3">
          <Button variant="outline" onClick={onClose} className="border-gray-600 text-gray-300 hover:bg-gray-800">
            Cancel
          </Button>
          <Button
            onClick={handleUpload}
            disabled={!selectedFiles || selectedFiles.length === 0}
            className="bg-[#8919A5] hover:bg-[#8919A5]/80 text-white"
          >
            Upload & Analyze
          </Button>
        </div>
      </motion.div>
    </motion.div>
  )
}
