import React from 'react'
import { motion } from 'framer-motion'
import { DISCORD_USER_ID } from '../config'

type Contact = {
  email?: string
  github?: string
  linkedin?: string
  discord?: string
  instagram?: string
}

function GlassContactButton({
  icon,
  label,
  value,
  href,
  external,
  active,
  onHoverStart,
  onHoverEnd,
  forceExpanded
}: {
  icon: React.ReactNode
  label: string
  value: string
  href?: string
  external?: boolean
  active: boolean
  onHoverStart: () => void
  onHoverEnd: () => void
  forceExpanded?: boolean
}) {
  const Comp: any = motion.a
  const commonProps = {
    className:
      'relative inline-flex items-center justify-center rounded-full text-sm font-medium text-neutral-900/90 overflow-hidden no-underline',
    style: {
      height: 40,
      width: forceExpanded ? 220 : 44,
      background: 'linear-gradient(135deg, rgba(255,255,255,0.40), rgba(255,255,255,0.12))',
      border: '1px solid rgba(255,255,255,0.35)',
      backdropFilter: 'blur(10px) saturate(120%)',
      WebkitBackdropFilter: 'blur(10px) saturate(120%)',
      boxShadow: '0 10px 30px rgba(0,0,0,0.10), inset 0 1px 0 rgba(255,255,255,0.35)',
      paddingLeft: forceExpanded ? 12 : 10,
      paddingRight: forceExpanded ? 16 : 10,
      color: '#0b0c0f'
    },
    initial: false,
    whileHover: forceExpanded ? undefined : { width: 220, paddingRight: 16, paddingLeft: 12 },
    transition: { type: 'tween' as const, ease: 'easeInOut', duration: 0.28 }
  }

  const inner = (
    <>
      <span className="absolute left-3 z-10 flex items-center justify-center" style={{ width: 20 }}>
        {icon}
      </span>
      <motion.span
        className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none select-none whitespace-nowrap"
        style={{ color: '#0b0c0f', textShadow: '0 1px 2px rgba(255,255,255,0.55)' }}
        initial={false}
        animate={{ opacity: active || forceExpanded ? 1 : 0 }}
        transition={{ duration: 0.22, ease: 'easeOut', delay: active && !forceExpanded ? 0.16 : 0 }}
      >
        {value || '—'}
      </motion.span>
      <motion.span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-full z-0"
        style={{ background: 'radial-gradient(200px 120px at var(--mx,50%) var(--my,0%), rgba(255,255,255,0.22), rgba(255,255,255,0) 70%)' }}
      />
    </>
  )

  if (!href) {
    return (
      <Comp
        role="button"
        aria-label={label}
        {...commonProps}
        onHoverStart={onHoverStart}
        onHoverEnd={onHoverEnd}
        onPointerMove={(e: any) => {
          const el = e.currentTarget as HTMLElement
          const rect = el.getBoundingClientRect()
          const mx = ((e.clientX - rect.left) / rect.width) * 100
          const my = ((e.clientY - rect.top) / rect.height) * 100
          el.style.setProperty('--mx', `${mx}%`)
          el.style.setProperty('--my', `${my}%`)
        }}
      >
        {inner}
      </Comp>
    )
  }

  return (
    <Comp
      href={href}
      target={external ? '_blank' : undefined}
      rel={external ? 'noreferrer' : undefined}
      aria-label={label}
      {...commonProps}
      onHoverStart={onHoverStart}
      onHoverEnd={onHoverEnd}
      onPointerMove={(e: any) => {
        const el = e.currentTarget as HTMLElement
        const rect = el.getBoundingClientRect()
        const mx = ((e.clientX - rect.left) / rect.width) * 100
        const my = ((e.clientY - rect.top) / rect.height) * 100
        el.style.setProperty('--mx', `${mx}%`)
        el.style.setProperty('--my', `${my}%`)
      }}
    >
      {inner}
    </Comp>
  )
}

export default function ContactBlock({ content }: { content?: Contact }) {
  const [hovered, setHovered] = React.useState<number | null>(null)
  // Expand on all phones: rely on viewport width <= 768px OR coarse pointer devices
  const isMobile = (typeof window !== 'undefined' && (
    (window.matchMedia && (window.matchMedia('(max-width: 768px)').matches || window.matchMedia('(pointer: coarse)').matches))
  ))
  const email = content?.email ?? ''
  const githubUrl = content?.github ?? ''
  const githubLabel = (() => {
    try {
      if (!githubUrl) return ''
      const u = new URL(githubUrl)
      const segments = u.pathname.split('/').filter(Boolean)
      return segments[segments.length - 1] || u.hostname
    } catch {
      return githubUrl
    }
  })()
  const linkedinName = content?.linkedin ?? ''
  const linkedinUrl = (() => {
    if (!linkedinName) return ''
    if (/^https?:\/\//i.test(linkedinName)) return linkedinName
    return ''
  })()
  const linkedinLabel = (() => {
    if (!linkedinName) return ''
    const normalize = (slug: string) => {
      const cleaned = decodeURIComponent(slug).replace(/^@/, '').replace(/\/$/, '')
      const tokens = cleaned.split(/[-_]/).filter(Boolean)
      const noDigits = tokens.filter(t => !/[0-9]/.test(t))
      const use = noDigits.length ? noDigits : tokens.slice(0, 2)
      if (!use.length) return 'LinkedIn'
      return use.map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
    }
    try {
      if (/^https?:\/\//i.test(linkedinName)) {
        const u = new URL(linkedinName)
        const segRaw = u.pathname.split('/').filter(Boolean)
        const last = segRaw[segRaw.length - 1] || ''
        return normalize(last)
      }
      return normalize(linkedinName)
    } catch {
      return 'LinkedIn'
    }
  })()
  const discordName = content?.discord ?? ''
  const discordUrl = (() => {
    const raw = discordName
    if (!raw && DISCORD_USER_ID) return `https://discordapp.com/users/${DISCORD_USER_ID}`
    if (/^https?:\/\//i.test(raw)) return raw
    if (/^\d{17,20}$/.test(raw)) return `https://discordapp.com/users/${raw}`
    // If only a handle is provided, we cannot deep-link reliably; fall back to ID if configured
    return DISCORD_USER_ID ? `https://discordapp.com/users/${DISCORD_USER_ID}` : ''
  })()
  const instagramHandle = content?.instagram ?? ''
  const instagramUrl = instagramHandle
    ? (instagramHandle.startsWith('http') ? instagramHandle : `https://instagram.com/${instagramHandle.replace(/^@/, '')}`)
    : ''
  const instagramLabel = (() => {
    if (!instagramHandle) return ''
    const raw = instagramHandle
    try {
      if (/^https?:\/\//i.test(raw)) {
        const u = new URL(raw)
        const seg = u.pathname.split('/').filter(Boolean)
        return (seg[seg.length - 1] || 'Instagram').replace(/^@/, '')
      }
      return raw.replace(/^@/, '')
    } catch {
      return 'Instagram'
    }
  })()

  return (
    <div className="w-full flex flex-wrap gap-3 justify-center">
      <GlassContactButton
        icon={
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 8l8 5 8-5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
            <rect x="3" y="6" width="18" height="12" rx="2" stroke="currentColor" strokeWidth="1.6" />
          </svg>
        }
        label="Email"
        value={email}
        href={email ? `mailto:${email}` : undefined}
        active={hovered === 0}
        onHoverStart={() => setHovered(0)}
        onHoverEnd={() => setHovered(prev => (prev === 0 ? null : prev))}
        forceExpanded={isMobile}
      />
      <GlassContactButton
        icon={
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2C6.48 2 2 6.48 2 12c0 4.42 2.87 8.17 6.84 9.5.5.09.68-.22.68-.48 0-.24-.01-.87-.01-1.71-2.78.6-3.37-1.19-3.37-1.19-.45-1.16-1.1-1.47-1.1-1.47-.9-.62.07-.61.07-.61 1 .07 1.53 1.03 1.53 1.03.89 1.52 2.34 1.08 2.91.83.09-.65.35-1.08.63-1.33-2.22-.25-4.55-1.11-4.55-4.95 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.28.1-2.66 0 0 .84-.27 2.75 1.02A9.56 9.56 0 0112 6.8c.85 0 1.7.12 2.5.35 1.9-1.29 2.74-1.02 2.74-1.02.56 1.38.21 2.41.1 2.66.64.7 1.03 1.59 1.03 2.68 0 3.85-2.34 4.7-4.57 4.95.36.31.67.92.67 1.86 0 1.34-.01 2.41-.01 2.74 0 .27.18.58.69.48A10.01 10.01 0 0022 12c0-5.52-4.48-10-10-10z" fill="currentColor"/>
          </svg>
        }
        label="GitHub"
        value={githubLabel}
        href={githubUrl || undefined}
        external
        active={hovered === 1}
        onHoverStart={() => setHovered(1)}
        onHoverEnd={() => setHovered(prev => (prev === 1 ? null : prev))}
        forceExpanded={isMobile}
      />
      <GlassContactButton
        icon={
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden>
            <path d="M22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.226.792 24 1.771 24h20.451C23.2 24 24 23.226 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003zM7.117 20.452H3.56V9h3.557v11.452zM5.338 7.433a2.062 2.062 0 110-4.125 2.062 2.062 0 010 4.125zM20.447 20.452h-3.554v-5.569c0-1.328-.027-3.039-1.852-3.039-1.853 0-2.136 1.445-2.136 2.939v5.669H9.35V9h3.414v1.561h.049c.476-.9 1.637-1.852 3.369-1.852 3.602 0 4.268 2.37 4.268 5.455v6.288z" />
          </svg>
        }
        label="LinkedIn"
        value={linkedinLabel}
        href={linkedinUrl || undefined}
        external={Boolean(linkedinUrl)}
        active={hovered === 2}
        onHoverStart={() => setHovered(2)}
        onHoverEnd={() => setHovered(prev => (prev === 2 ? null : prev))}
        forceExpanded={isMobile}
      />
      <GlassContactButton
        icon={
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden>
            <path d="M20.317 4.3698A19.7913 19.7913 0 0016.558 3a13.227 13.227 0 00-.651 1.342 18.533 18.533 0 00-5.813 0A13.107 13.107 0 009.443 3a19.736 19.736 0 00-3.758 1.369C2.362 8.013 1.865 11.558 2.06 15.06a19.9 19.9 0 005.993 3.058 14.1 14.1 0 001.2-1.948 12.294 12.294 0 01-1.9-.91c.159-.119.314-.244.463-.372a9.026 9.026 0 008.468 0c.151.128.307.253.463.372a12.1 12.1 0 01-1.9.91c.35.67.759 1.334 1.2 1.948a19.9 19.9 0 005.993-3.058c.25-4.276-.424-7.79-2.803-10.69zM9.5 13.5c-.82 0-1.5-.9-1.5-2s.66-2 1.5-2 1.5.9 1.5 2-.68 2-1.5 2zm5 0c-.82 0-1.5-.9-1.5-2s.66-2 1.5-2S16 10.4 16 11.5s-.68 2-1.5 2z"/>
          </svg>
        }
        label="Discord"
        value={discordName}
        href={discordUrl || undefined}
        external
        active={hovered === 3}
        onHoverStart={() => setHovered(3)}
        onHoverEnd={() => setHovered(prev => (prev === 3 ? null : prev))}
        forceExpanded={isMobile}
      />
      <GlassContactButton
        icon={
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="4" y="4" width="16" height="16" rx="4" stroke="currentColor" strokeWidth="1.6" />
            <circle cx="12" cy="12" r="3.5" stroke="currentColor" strokeWidth="1.6" />
            <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
          </svg>
        }
        label="Instagram"
        value={instagramLabel}
        href={instagramUrl || undefined}
        external
        active={hovered === 4}
        onHoverStart={() => setHovered(4)}
        onHoverEnd={() => setHovered(prev => (prev === 4 ? null : prev))}
        forceExpanded={isMobile}
      />
    </div>
  )
}


