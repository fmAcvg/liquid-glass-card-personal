import { motion } from 'framer-motion'
import React from 'react'

export default function ThemeToggle() {
  const [dark, setDark] = React.useState<boolean>(false)

  React.useEffect(() => {
    const saved = localStorage.getItem('theme')
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
    const isDark = saved ? saved === 'dark' : prefersDark
    setDark(isDark)
    document.documentElement.classList.toggle('dark', isDark)
  }, [])

  function toggle() {
    setDark(prev => {
      const next = !prev
      document.documentElement.classList.toggle('dark', next)
      localStorage.setItem('theme', next ? 'dark' : 'light')
      return next
    })
  }

  return (
    <motion.button
      onClick={toggle}
      aria-label="Toggle theme"
      className="relative inline-flex items-center justify-center rounded-full overflow-hidden"
      style={{
        height: 40,
        width: 72,
        background: 'linear-gradient(135deg, rgba(255,255,255,0.40), rgba(255,255,255,0.12))',
        border: '1px solid rgba(255,255,255,0.35)',
        backdropFilter: 'blur(10px) saturate(120%)',
        WebkitBackdropFilter: 'blur(10px) saturate(120%)',
        boxShadow: '0 10px 30px rgba(0,0,0,0.10), inset 0 1px 0 rgba(255,255,255,0.35)'
      }}
      whileTap={{ scale: 0.98 }}
    >
      <motion.span
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(220px 160px at var(--mx,50%) var(--my,50%), var(--aura), rgba(0,0,0,0) 65%)'
        }}
        initial={false}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.25 }}
      />
      <motion.div
        className="absolute left-1 top-1 bottom-1 rounded-full flex items-center justify-center"
        style={{ width: 38, background: 'white' }}
        initial={false}
        animate={{ x: dark ? 32 : 0, backgroundColor: dark ? '#8b5cf6' : '#ffffff' }}
        transition={{ type: 'spring', stiffness: 300, damping: 22 }}
      >
        {dark ? (
          // Moon icon
          <svg width="16" height="16" viewBox="0 0 24 24" fill="#ffffff" xmlns="http://www.w3.org/2000/svg" aria-hidden>
            <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>
          </svg>
        ) : (
          // Premade sun icon (lucide-style)
          <svg width="16" height="16" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden>
            <g stroke="#0b0c0f" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none">
              <circle cx="12" cy="12" r="4" />
              <path d="M12 2v2" />
              <path d="M12 20v2" />
              <path d="M2 12h2" />
              <path d="M20 12h2" />
              <path d="M4.93 4.93l1.41 1.41" />
              <path d="M17.66 17.66l1.41 1.41" />
              <path d="M6.34 17.66l-1.41 1.41" />
              <path d="M19.07 4.93l-1.41 1.41" />
            </g>
          </svg>
        )}
      </motion.div>
      {/* hint icons removed for cleaner look */}
    </motion.button>
  )
}


