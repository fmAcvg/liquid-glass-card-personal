import React, { useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'

type Entry = { label: string; value: string }
type ImpressumData = { title?: string; entries: Entry[] }

export default function ImpressumPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const reduce = useReducedMotion()
  const [data, setData] = useState<ImpressumData>({ title: 'Imprint', entries: [] })
  const [targetH, setTargetH] = useState<number>(420)

  function computeTargetHeight(entries: Entry[]): number {
    const vh = Math.max(480, Math.round(window.innerHeight * 0.82))
    const rowH = window.innerWidth < 640 ? 44 : 54
    const titleH = data.title ? 56 : 0
    const extras = 140 + titleH
    return Math.min(vh, extras + entries.length * rowH)
  }

  useEffect(() => {
    if (!open) return
    ;(async () => {
      try {
        if (import.meta.env.PROD) {
          const mod = await import('../impressum.json')
          const payload = (mod as { default: ImpressumData }).default
          setData(payload)
          setTargetH(computeTargetHeight(payload.entries))
          return
        }
        const devUrl = new URL('../impressum.json', import.meta.url).toString()
        const res = await fetch(`${devUrl}?ts=${Date.now()}`, { cache: 'no-store' })
        const payload = (await res.json()) as ImpressumData
        setData(payload)
        setTargetH(computeTargetHeight(payload.entries))
      } catch {
        try {
          const assetUrl = new URL('../impressum.json', import.meta.url).toString()
          const res = await fetch(assetUrl)
          const payload = (await res.json()) as ImpressumData
          setData(payload)
          setTargetH(computeTargetHeight(payload.entries))
        } catch {
          setData({ title: 'Imprint', entries: [] })
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
        <motion.div className="fixed inset-0 z-40 flex items-center justify-center p-6" initial={{ opacity: 1 }} animate={{ opacity: 1 }} exit={{ opacity: 1 }}>
          <motion.div className="absolute inset-0 bg-black/25" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }} onClick={onClose} />
          <motion.div
            className="glass rounded-3xl w-[92vw] max-w-[900px] p-6 sm:p-8 relative overflow-hidden will-change-transform"
            style={{ height: targetH }}
            initial={{ opacity: 0, scaleX: 0.82, scaleY: 0.92 }}
            animate={{ opacity: 1, scaleX: [0.82, 1], scaleY: [0.92, 0.92, 1] }}
            exit={{ opacity: 0, scaleX: 0.94, scaleY: 0.96 }}
            transition={{ type: 'tween', ease: 'easeInOut', opacity: { duration: 0.2 }, scaleX: { duration: 0.42 }, scaleY: { duration: 0.36, delay: 0.42 } }}
          >
            <button
              onClick={onClose}
              aria-label="Close"
              className="absolute top-3 left-3 h-6 w-6 rounded-full"
              style={{ background: 'radial-gradient(circle at 30% 30%, #ff8a8a, #ff5f57)', boxShadow: '0 2px 6px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.6)' }}
            />
            <div className="h-full w-full pr-2">
              <div className="max-w-[720px] mx-auto h-full flex flex-col justify-center gap-4 sm:gap-5">
                {data.title && (
                  <motion.h2 className="text-xl sm:text-2xl font-semibold text-neutral-900/95 text-center"
                    initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, ease: 'easeOut', delay: 0.5 }}>
                    {data.title}
                  </motion.h2>
                )}
                <div className="flex flex-col gap-3 sm:gap-4">
                  {data.entries.map((e, idx) => (
                    <motion.div key={idx} className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4"
                      initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, ease: 'easeOut', delay: 0.55 + idx * 0.05 }}>
                      <div className="w-full sm:w-56 shrink-0 text-neutral-700/85 font-medium">{e.label}</div>
                      <div className="flex-1 text-neutral-900/95">{e.value}</div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}


