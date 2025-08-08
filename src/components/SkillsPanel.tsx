import React, { useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'

type Skill = { name: string; level: number }

function SkillRowLarge({ skill, delay = 0 }: { skill: Skill; delay?: number }) {
  const pct = Math.max(0, Math.min(10, skill.level)) / 10
  return (
    <div className="flex items-center gap-5">
      <motion.div
        className="w-48 shrink-0 text-base sm:text-lg"
        style={{ color: '#0b0c0f', textShadow: '0 1px 1px rgba(255,255,255,0.5)' }}
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut', delay }}
      >
        {skill.name}
      </motion.div>
      <div className="relative h-3 sm:h-3.5 rounded-full bg-neutral-300/60 flex-1 overflow-hidden">
        <motion.div
          className="absolute inset-0 origin-left transform-gpu rounded-full will-change-transform"
          style={{ background: 'linear-gradient(90deg, rgba(191,219,254,0.98), rgba(96,165,250,0.98), rgba(59,130,246,0.98))' }}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: pct }}
          transition={{ duration: 0.6, ease: 'easeInOut', delay: delay + 0.18 }}
        />
      </div>
    </div>
  )
}

export default function SkillsPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const reduce = useReducedMotion()
  const [skills, setSkills] = useState<Skill[]>([])
  const [targetH, setTargetH] = useState<number>(420)

  useEffect(() => {
    if (!open) return
    const url = new URL('../skills.json', import.meta.url).toString()
    fetch(`${url}?ts=${Date.now()}`)
      .then(r => r.json())
      .then((list: Skill[]) => {
        setSkills(list)
        const vh = Math.max(480, Math.round(window.innerHeight * 0.82))
        const rowH = window.innerWidth < 640 ? 42 : 56
        const extras = 140
        const h = Math.min(vh, extras + list.length * rowH)
        setTargetH(h)
      })
      .catch(() => {})
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


