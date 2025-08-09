import React from 'react'
import { motion } from 'framer-motion'
import { PROJECT_GITHUB_URL } from '../config'

export function ResumeButton() {
  return (
    <motion.a
      href="#"
      aria-label="Open resume"
      className="relative inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium text-neutral-900/90 dark:text-neutral-50 follow-pointer"
      style={{
        background: 'linear-gradient(135deg, rgba(255,255,255,0.40), rgba(255,255,255,0.12))',
        border: '1px solid rgba(255,255,255,0.35)',
        backdropFilter: 'blur(10px) saturate(120%)',
        WebkitBackdropFilter: 'blur(10px) saturate(120%)',
        boxShadow: '0 10px 30px rgba(0,0,0,0.10), inset 0 1px 0 rgba(255,255,255,0.35)'
      }}
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.985 }}
      transition={{ type: 'spring', stiffness: 180, damping: 20 }}
      onPointerMove={(e) => {
        const el = e.currentTarget as HTMLElement
        const rect = el.getBoundingClientRect()
        const mx = ((e.clientX - rect.left) / rect.width) * 100
        const my = ((e.clientY - rect.top) / rect.height) * 100
        el.style.setProperty('--mx', `${mx}%`)
        el.style.setProperty('--my', `${my}%`)
      }}
    >
      <span>Resume</span>
      <motion.span aria-hidden className="pointer-events-none absolute inset-0 rounded-full" style={{ background: 'radial-gradient(200px 120px at var(--mx,50%) var(--my,0%), rgba(255,255,255,0.28), rgba(255,255,255,0) 70%)' }} />
    </motion.a>
  )
}

export function ProjectButton() {
  return (
    <motion.a
      href={PROJECT_GITHUB_URL || '#'}
      target="_blank"
      rel="noreferrer"
      aria-label="Open project source"
      className="group relative inline-flex items-center justify-center rounded-full text-sm font-medium text-neutral-900/90 dark:text-neutral-50 overflow-hidden follow-pointer"
      style={{
        height: 40,
        width: 44,
        background: 'linear-gradient(135deg, rgba(255,255,255,0.40), rgba(255,255,255,0.12))',
        border: '1px solid rgba(255,255,255,0.35)',
        backdropFilter: 'blur(10px) saturate(120%)',
        WebkitBackdropFilter: 'blur(10px) saturate(120%)',
        boxShadow: '0 10px 30px rgba(0,0,0,0.10), inset 0 1px 0 rgba(255,255,255,0.35)',
        paddingLeft: 10,
        paddingRight: 10
      }}
      initial={false}
      whileHover={{ width: 168, paddingRight: 16, paddingLeft: 12 }}
      transition={{ type: 'tween', ease: 'easeInOut', duration: 0.28 }}
      onPointerMove={(e) => {
        const el = e.currentTarget as HTMLElement
        const rect = el.getBoundingClientRect()
        const mx = ((e.clientX - rect.left) / rect.width) * 100
        const my = ((e.clientY - rect.top) / rect.height) * 100
        el.style.setProperty('--mx', `${mx}%`)
        el.style.setProperty('--my', `${my}%`)
      }}
    >
      <span className="absolute left-3 z-10 flex items-center justify-center" style={{ width: 20 }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M9.5 16L5.5 12L9.5 8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M14.5 8L18.5 12L14.5 16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </span>
      <span className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none select-none opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-neutral-900/90 dark:text-neutral-50" style={{ textShadow: '0 1px 2px rgba(255,255,255,0.55)' }}>
        Code
      </span>
      <motion.span aria-hidden className="pointer-events-none absolute inset-0 rounded-full z-0" style={{ background: 'radial-gradient(200px 120px at var(--mx,50%) var(--my,0%), rgba(255,255,255,0.22), rgba(255,255,255,0) 70%)' }} />
    </motion.a>
  )
}


