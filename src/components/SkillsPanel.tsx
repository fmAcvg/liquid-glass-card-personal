import React, { useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'

type Skill = { name: string; level: number }

function SkillRowLarge({ skill, delay = 0 }: { skill: Skill; delay?: number }) {
  const pct = Math.max(0, Math.min(10, skill.level)) / 10
  return (
    <div className="group flex items-center gap-5">
      <motion.div
        className="relative w-48 shrink-0 text-base sm:text-lg text-[var(--text-primary)] transition-colors duration-200 group-hover:text-[var(--accent)]"
        style={{ textShadow: '0 1px 1px rgba(255,255,255,0.2)' }}
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut', delay }}
      >
        <span className="relative">
          {skill.name}
          <span
            aria-hidden
            className="absolute left-0 -bottom-1 h-0.5 w-0 rounded-full bg-[var(--accent)] opacity-0 group-hover:w-full group-hover:opacity-100 transition-all duration-300"
            style={{ filter: 'blur(0.2px)' }}
          />
        </span>
      </motion.div>
      <div
        className="group/bar relative h-3 sm:h-3.5 rounded-full flex-1 overflow-hidden transition-shadow duration-300"
        style={{ backgroundColor: 'rgba(var(--accent-rgb),0.15)' }}
        onPointerMove={(e: any) => {
          const el = e.currentTarget as HTMLElement
          const rect = el.getBoundingClientRect()
          const mx = ((e.clientX - rect.left) / rect.width) * 100
          const my = ((e.clientY - rect.top) / rect.height) * 100
          el.style.setProperty('--mx', `${mx}%`)
          el.style.setProperty('--my', `${my}%`)
        }}
      >
        <motion.div
          className="absolute inset-0 origin-left transform-gpu rounded-full will-change-transform"
          style={{ background: 'linear-gradient(90deg, rgba(var(--accent-rgb),0.9), rgba(var(--accent-rgb),0.8), rgba(var(--accent-rgb),0.95))' }}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: pct }}
          transition={{ duration: 0.6, ease: 'easeInOut', delay: delay + 0.18 }}
        />
        {/* hover glow */}
        <div
          aria-hidden
          className="pointer-events-none absolute -inset-1 rounded-full opacity-0 group-hover/bar:opacity-100 transition-opacity duration-200"
          style={{ boxShadow: '0 0 18px rgba(var(--accent-rgb),0.35), 0 4px 12px rgba(var(--accent-rgb),0.25)' }}
        />
        {/* pointer-follow highlight */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-full opacity-0 group-hover/bar:opacity-100 transition-opacity duration-150"
          style={{ background: 'radial-gradient(160px 80px at var(--mx,50%) var(--my,50%), rgba(var(--accent-rgb),0.30), rgba(var(--accent-rgb),0) 60%)' }}
        />
      </div>
    </div>
  )
}

export default function SkillsPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const reduce = useReducedMotion()
  const [skills, setSkills] = useState<Skill[]>([])
  const [targetH, setTargetH] = useState<number>(420)

  function computeTargetHeight(list: Skill[]): number {
    const vh = Math.max(480, Math.round(window.innerHeight * 0.82))
    const rowH = window.innerWidth < 640 ? 42 : 56
    const extras = 140
    return Math.min(vh, extras + list.length * rowH)
  }

  useEffect(() => {
    if (!open) return
    ;(async () => {
      try {
        if (import.meta.env.PROD) {
          // Prefer bundled asset in production
          const mod = await import('../skills.json')
          const list = (mod as { default: Skill[] }).default
          setSkills(list)
          setTargetH(computeTargetHeight(list))
          return
        }
        // Development: fetch fresh with no-store and cache-busting
        const devUrl = new URL('../skills.json', import.meta.url).toString()
        const res = await fetch(`${devUrl}?ts=${Date.now()}`, { cache: 'no-store' })
        const list = (await res.json()) as Skill[]
        setSkills(list)
        setTargetH(computeTargetHeight(list))
      } catch {
        // Fallback the other way around
        try {
          const assetUrl = new URL('../skills.json', import.meta.url).toString()
          const res = await fetch(assetUrl)
          const list = (await res.json()) as Skill[]
          setSkills(list)
          setTargetH(computeTargetHeight(list))
        } catch {
          setSkills([])
        }
      }
    })()
  }, [open])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  return (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-30 flex items-center justify-center p-6" initial={{ opacity: 1 }} animate={{ opacity: 1 }} exit={{ opacity: 1 }}>
          <motion.div className="absolute inset-0 bg-black/25" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }} onClick={onClose} />
          <motion.div
            className="glass rounded-3xl w-[92vw] max-w-[1280px] p-6 sm:p-8 relative overflow-hidden will-change-transform"
            style={{ height: targetH }}
            initial={{ opacity: 0, scaleX: 0.82, scaleY: 0.92 }}
            animate={{ opacity: 1, scaleX: [0.82, 1], scaleY: [0.92, 0.92, 1] }}
            exit={{ opacity: 0, scaleX: 0.94, scaleY: 0.96 }}
            transition={{
              type: 'tween',
              ease: 'easeInOut',
              durations: undefined,
              opacity: { duration: 0.2 },
              scaleX: { duration: 0.42 },
              scaleY: { duration: 0.36, delay: 0.42 }
            }}
          >
            <button
              onClick={onClose}
              aria-label="Close"
              className="absolute top-3 left-3 h-6 w-6 rounded-full"
              style={{
                background: 'radial-gradient(circle at 30% 30%, #ff8a8a, #ff5f57)',
                boxShadow: '0 2px 6px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.6)'
              }}
            />
            <div className="h-full w-full pr-2">
              {(() => {
                const baseDelay = 0.42 + 0.36 + 0.08
                return (
                  <div className="max-w-[900px] mx-auto h-full flex flex-col justify-center gap-5 sm:gap-6">
                    {skills.map((s, idx) => (
                      <SkillRowLarge key={idx} skill={s} delay={baseDelay + idx * 0.08} />
                    ))}
                  </div>
                )
              })()}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}


