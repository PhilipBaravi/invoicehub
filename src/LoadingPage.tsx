'use client'

import { useState, useEffect } from 'react'
import { Loader2 } from 'lucide-react'
import { Progress } from "@/components/ui/progress"

export default function LoadingPage() {
  const [progress, setProgress] = useState(0)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const progressTimer = setTimeout(() => setProgress(66), 500)
    const visibilityTimer = setTimeout(() => setIsVisible(true), 100)
    return () => {
      clearTimeout(progressTimer)
      clearTimeout(visibilityTimer)
    }
  }, [])

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col items-center justify-center p-4">
      <div 
        className={`w-full max-w-md transition-all duration-500 ease-out ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
        }`}
      >
        <div className="bg-white rounded-lg shadow-xl p-6 space-y-6">
          <div className="flex items-center justify-center">
            <Loader2 className="h-12 w-12 text-green-500 animate-spin" />
          </div>
          <h2 className="text-2xl font-semibold text-center text-stone-800">Logging In</h2>
          <Progress value={progress} className="w-full" />
          <p className="text-stone-600 text-center">Please wait while we securely log you into the system...</p>
          <div className="flex justify-center space-x-2">
            {[0, 1, 2].map((i) => (
              <div 
                key={i}
                className="w-3 h-3 bg-green-500 rounded-full animate-pulse"
                style={{ animationDelay: `${i * 0.2}s` }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}