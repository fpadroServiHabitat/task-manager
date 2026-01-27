'use client'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

export default function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    console.log('Canviant tema de', theme, 'a', newTheme)
    console.log('Resolved theme:', resolvedTheme)
    setTheme(newTheme)
    
    // Force check after setting
    setTimeout(() => {
      console.log('Després del canvi - Theme:', theme, 'Resolved:', resolvedTheme)
      console.log('HTML class:', document.documentElement.className)
    }, 100)
  }

  if (!mounted) {
    return (
      <button className="p-2 rounded-md border-2 border-cyan-300 bg-cyan-200 transition-colors">
        <span className="text-xl">☀️</span>
      </button>
    )
  }

  console.log('Tema actual:', theme, 'Resolt:', resolvedTheme)
  console.log('Document class:', document.documentElement.className)

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-md border-2 border-blue-300 bg-blue-200 hover:bg-blue-300 dark:border-fuchsia-300 dark:bg-fuchsia-200 dark:hover:bg-fuchsia-300 transition-colors"
      aria-label="Toggle theme"
    >
      {resolvedTheme === 'light' ? (
        <span className="text-xl text-blue-400">☀️</span>
      ) : (
        <span className="text-xl text-fuchsia-400">🌙</span>
      )}
    </button>
  )
}