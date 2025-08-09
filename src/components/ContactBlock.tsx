import React from 'react'
import { motion } from 'framer-motion'

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
      'relative inline-flex items-center justify-center rounded-full text-sm font-medium text-neutral-900/90 overflow-hidden',
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
  const isMobile = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(max-width: 768px)').matches
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
  const discordName = content?.discord ?? ''
  const instagramHandle = content?.instagram ?? ''
  const instagramUrl = instagramHandle
    ? (instagramHandle.startsWith('http') ? instagramHandle : `https://instagram.com/${instagramHandle}`)
    : ''

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
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 4h16v16H4z" stroke="currentColor" strokeWidth="1.6" />
            <path d="M7 17l10-10" stroke="currentColor" strokeWidth="1.6" />
          </svg>
        }
        label="LinkedIn"
        value={linkedinName}
        active={hovered === 2}
        onHoverStart={() => setHovered(2)}
        onHoverEnd={() => setHovered(prev => (prev === 2 ? null : prev))}
        forceExpanded={isMobile}
      />
      <GlassContactButton
        icon={
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M7.5 8.5c1.3.1 2.1-.5 2.8-1 1.1-.8 2.3-.8 3.4 0 .7.5 1.5 1.1 2.8 1 1.7-.1 2.7-.9 3.2-1.4-.2 1.4-.8 3.4-2.1 5.3-1.6 2.3-3.8 3.8-6.2 3.8-2.4 0-4.6-1.5-6.2-3.8-1.3-1.9-1.9-3.9-2.1-5.3.6.5 1.5 1.3 3.2 1.4z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        }
        label="Discord"
        value={discordName}
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
        value={instagramHandle}
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


