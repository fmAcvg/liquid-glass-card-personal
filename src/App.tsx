import { motion, useReducedMotion } from 'framer-motion'
import React, { useState, useEffect } from 'react'
import BackgroundCapsules from './components/BackgroundCapsules'
import InteractiveCard from './components/InteractiveCard/InteractiveCard'
import ContactBlock from './components/ContactBlock'
import SkillsBlock from './components/SkillsBlock'
import SkillsPanel from './components/SkillsPanel'
import ImpressumPanel from './components/ImpressumPanel'
import OnlineDot from './components/OnlineDot'
import { ResumeButton, ProjectButton } from './components/Buttons/Buttons'

// card component extracted into components/InteractiveCard

// Avatar component removed (inline <img> is used)

// BackgroundRoutes removed (never used)

export default function App() {
  const [skillsOpen, setSkillsOpen] = useState(false)
  const [impressumOpen, setImpressumOpen] = useState(false)
  const [content, setContent] = useState<{ profile: any; contact: any; skills?: string[] } | null>(null)
  const reduce = useReducedMotion()

  useEffect(() => {
    import('./content.json').then(m => setContent(m.default as any))
  }, [])
  return (
    <div className="relative h-full w-full overflow-visible md:overflow-hidden">
      <BackgroundCapsules active={!skillsOpen} />

      {/* Centered header actions (fixed) */}
      <div className="fixed top-5 left-1/2 -translate-x-1/2 z-30 flex items-center gap-3">
        <ResumeButton />
        <ProjectButton />
      </div>

      <div className="md:absolute md:inset-0 flex items-center justify-center p-6 min-h-screen md:min-h-0">
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 items-stretch max-w-[1100px] w-full"
          initial={reduce ? undefined : 'hide'}
          animate={reduce ? undefined : 'show'}
          variants={{
            show: { transition: { staggerChildren: 0.08 } },
            hide: {}
          }}
        >
          {/* Left column: tall profile card */}
          <div className="flex md:h-[56vh] items-center">
            <InteractiveCard className="flex-1 h-full flex">
              <div className="h-full w-full flex flex-col items-center justify-center gap-4 text-center">
                <motion.div
                  className="relative mx-auto group"
                  whileHover={{ scale: 1.03 }}
                  transition={{ type: 'spring', stiffness: 220, damping: 18 }}
                  onPointerMove={(e) => {
                    const el = e.currentTarget as HTMLElement
                    const rect = el.getBoundingClientRect()
                    const mx = ((e.clientX - rect.left) / rect.width) * 100
                    const my = ((e.clientY - rect.top) / rect.height) * 100
                    el.style.setProperty('--mx', `${mx}%`)
                    el.style.setProperty('--my', `${my}%`)
                  }}
                >
                  <div className="h-40 w-40 md:h-44 md:w-44 rounded-full overflow-hidden ring-2 ring-white/70 shadow-md transition-shadow duration-300">
                    <motion.img
                      src="/avatar.jpeg"
                      alt="Avatar"
                      className="h-full w-full object-cover"
                      whileHover={{ scale: 1.04, y: -2 }}
                      transition={{ type: 'spring', stiffness: 260, damping: 22 }}
                    />
                    {/* sheen */}
                    <div
                      className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                      style={{
                        background:
                          'radial-gradient(160px 110px at var(--mx,50%) var(--my,50%), rgba(255,255,255,0.24), rgba(255,255,255,0) 60%)'
                      }}
                    />
                  </div>
                  {/* soft outer glow on hover */}
                  <div
                    className="pointer-events-none absolute -inset-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{ boxShadow: '0 18px 40px rgba(59,130,246,0.14)' }}
                  />
                  {/* online/offline dot */}
                  <OnlineDot />
                </motion.div>
                <div className="space-y-2 mx-auto max-w-[30ch]">
                  <motion.div
                    className="text-3xl md:text-4xl font-semibold tracking-tight select-none"
                    whileHover={{ y: -1, scale: 1.01 }}
                    transition={{ type: 'spring', stiffness: 240, damping: 20 }}
                    style={{ textShadow: '0 1px 0 rgba(255,255,255,0.6)' }}
                  >
                    {content?.profile?.name ?? '—'}
                  </motion.div>
                  <motion.div
                    className="text-neutral-700/85"
                    whileHover={{ y: -1, opacity: 1 }}
                    transition={{ duration: 0.2, ease: 'easeOut' }}
                    style={{ opacity: 0.95 }}
                  >
                    {content?.profile?.tagline}
                  </motion.div>
                  <motion.div
                    className="text-lg md:text-xl text-neutral-700/85"
                    whileHover={{ y: -1, opacity: 1 }}
                    transition={{ duration: 0.2, ease: 'easeOut' }}
                    style={{ opacity: 0.95 }}
                  >
                    {content ? `${content.profile.age} • ${content.profile.pronouns} • ${content.profile.nationality}` : '—'}
                  </motion.div>
                  <motion.div
                    className="text-sm text-neutral-700/70"
                    whileHover={{ y: -1, opacity: 1 }}
                    transition={{ duration: 0.2, ease: 'easeOut' }}
                    style={{ opacity: 0.95 }}
                  >
                    {content?.profile?.school} — {content?.profile?.graduation}
                  </motion.div>
                </div>
              </div>
            </InteractiveCard>
          </div>

          {/* Right column: stacked contact and skills */}
          <div className="flex flex-col gap-6 md:h-[56vh]">
            <InteractiveCard className="flex-1">
              <ContactBlock content={content?.contact} />
            </InteractiveCard>
            <InteractiveCard className="flex-1" onClick={() => setSkillsOpen(true)}>
              <div className="relative w-full h-full flex items-center justify-center">
                <SkillsBlock items={content?.skills} />
                <SkillCtaAura />
              </div>
            </InteractiveCard>
          </div>
        </motion.div>
      </div>

      <SkillsPanel open={skillsOpen} onClose={() => setSkillsOpen(false)} />
      <ImpressumPanel open={impressumOpen} onClose={() => setImpressumOpen(false)} />

      {/* Bottom-right Impressum button */}
      <button
        onClick={() => setImpressumOpen(true)}
        className="fixed bottom-5 right-5 z-30 rounded-full px-4 py-2 text-sm font-medium text-neutral-900/90"
        style={{
          background: 'linear-gradient(135deg, rgba(255,255,255,0.40), rgba(255,255,255,0.12))',
          border: '1px solid rgba(255,255,255,0.35)',
          backdropFilter: 'blur(10px) saturate(120%)',
          WebkitBackdropFilter: 'blur(10px) saturate(120%)',
          boxShadow: '0 10px 30px rgba(0,0,0,0.10), inset 0 1px 0 rgba(255,255,255,0.35)'
        }}
      >
        Imprint
      </button>

      {/* default cursor restored */}
    </div>
  )
}

// BackgroundCapsules moved to components/BackgroundCapsules

// ContactBlock moved to components/ContactBlock

// GlassCursor removed (not in use)

// SkillsBlock moved to components/SkillsBlock

// AvailabilityBadge removed (not currently used)

// OnlineDot moved to components/OnlineDot

// SkillsPanel moved to components/SkillsPanel

// SkillRow and SkillRowLarge moved to components/SkillsPanel

// Buttons moved to components/Buttons

function SkillCtaAura() {
  return (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
      {/* expanding outline rings */}
      <motion.div
        className="absolute rounded-3xl border border-blue-400/30"
        style={{ width: '86%', height: '72%' }}
        animate={{ opacity: [0.22, 0, 0.22], scale: [1, 1.08, 1] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute rounded-3xl border border-blue-400/20"
        style={{ width: '74%', height: '60%' }}
        animate={{ opacity: [0.18, 0, 0.18], scale: [1, 1.12, 1] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut', delay: 0.15 }}
      />
      {/* gentle glow */}
      <motion.div
        className="absolute rounded-3xl"
        style={{ width: '60%', height: '46%', background: 'radial-gradient(closest-side, rgba(59,130,246,0.14), rgba(59,130,246,0))' }}
        animate={{ opacity: [0.1, 0.2, 0.1] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut', delay: 0.1 }}
      />
      {/* cursor hint: larger cursor icon in card corner */}
      <motion.div
        className="absolute -bottom-2 -right-2 h-10 w-10 rounded-full"
        style={{
          background: 'linear-gradient(135deg, rgba(255,255,255,0.55), rgba(255,255,255,0.18))',
          border: '1px solid rgba(255,255,255,0.4)',
          boxShadow: '0 12px 30px rgba(59,130,246,0.28), inset 0 1px 0 rgba(255,255,255,0.45)'
        }}
        animate={{ opacity: [0.95, 0.55, 0.95], scale: [1, 1.16, 1], y: [0, -2, 0] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
      >
        <div className="h-full w-full flex items-center justify-center text-neutral-900/85 drop-shadow">
          {/* hand pointer icon to avoid duplication with OS cursor */}
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path d="M11 2a1 1 0 0 1 1 1v7h1V5a1 1 0 0 1 2 0v5h1V7a1 1 0 1 1 2 0v7.5a3.5 3.5 0 0 1-3.5 3.5H11l-3.2-4.8A2 2 0 0 1 8.5 11H10V3a1 1 0 0 1 1-1Z"/>
          </svg>
        </div>
      </motion.div>
      {/* outer pulse ring near corner */}
      <motion.div
        className="absolute -bottom-1 -right-1 rounded-full"
        style={{ width: 46, height: 46, border: '1px solid rgba(59,130,246,0.38)' }}
        animate={{ opacity: [0.38, 0, 0.38], scale: [1, 1.22, 1] }}
        transition={{ duration: 1.7, repeat: Infinity, ease: 'easeInOut', delay: 0.18 }}
      />
    </div>
  )
}
// ProjectButton moved to components/Buttons

