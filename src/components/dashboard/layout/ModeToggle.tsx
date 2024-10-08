import { useTheme } from "./ThemeProvider"
import { Switch } from "@/components/ui/switch" 
import { useState, useEffect } from "react"

export function ModeToggle() {
  const { setTheme } = useTheme()
  const [isDarkMode, setIsDarkMode] = useState(false)

  useEffect(() => {
    const darkThemeMediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
    setIsDarkMode(darkThemeMediaQuery.matches)
    
    darkThemeMediaQuery.addEventListener("change", (event) => {
      setIsDarkMode(event.matches)
    })

    return () => {
      darkThemeMediaQuery.removeEventListener("change", (event) => {
        setIsDarkMode(event.matches)
      })
    }
  }, [])

  const handleThemeToggle = () => {
    if (isDarkMode) {
      setTheme("light")
    } else {
      setTheme("dark")
    }
    setIsDarkMode(!isDarkMode)
  }

  return (
    <div className="flex items-center space-x-2">
      {/* Custom Switch Component */}
      <Switch
        checked={isDarkMode}
        onCheckedChange={handleThemeToggle}
        className="transition-all"
      />
    </div>
  )
}
