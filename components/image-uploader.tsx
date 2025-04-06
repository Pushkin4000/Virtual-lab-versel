"use client"

import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Upload, ImageIcon } from "lucide-react"

interface ImageUploaderProps {
  onImageUpload: (imageDataUrl: string) => void
}

export default function ImageUploader({ onImageUpload }: ImageUploaderProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = () => {
        const dataUrl = reader.result as string
        setPreviewUrl(dataUrl)
      }
      reader.readAsDataURL(file)
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".gif"],
    },
    maxFiles: 1,
  })

  const handleUpload = () => {
    if (previewUrl) {
      onImageUpload(previewUrl)
    }
  }

  const handleSampleImage = () => {
    // Use a placeholder image
    const sampleImageUrl = "/placeholder.svg?height=300&width=300"
    setPreviewUrl(sampleImageUrl)
  }

  return (
    <div className="space-y-6">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
          ${isDragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-primary/50"}`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="bg-primary/10 p-4 rounded-full">
            <Upload className="h-8 w-8 text-primary" />
          </div>
          <div>
            <p className="text-lg font-medium">Drag & drop an image here, or click to select</p>
            <p className="text-sm text-muted-foreground mt-1">Supported formats: JPEG, PNG, GIF</p>
          </div>
        </div>
      </div>

      {previewUrl ? (
        <Card>
          <CardContent className="p-4 flex flex-col items-center">
            <div className="relative w-full max-w-md mx-auto aspect-square mb-4">
              <img
                src={previewUrl || "/placeholder.svg"}
                alt="Preview"
                className="rounded-md object-contain w-full h-full"
              />
            </div>
            <Button onClick={handleUpload} size="lg">
              Classify Image
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="text-center">
          <p className="mb-2">Don't have an image handy?</p>
          <Button variant="outline" onClick={handleSampleImage}>
            <ImageIcon className="h-4 w-4 mr-2" />
            Use Sample Image
          </Button>
        </div>
      )}
    </div>
  )
}

