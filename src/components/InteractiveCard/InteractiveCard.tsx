import React from 'react'
import { motion, useReducedMotion, useMotionValue, useSpring } from 'framer-motion'
import './InteractiveCard.css'

export type CardProps = {
  title?: string
  children: React.ReactNode
  onClick?: () => void
  className?: string
}

export default function InteractiveCard({ children, onClick, className }: CardProps) {
  const reduce = useReducedMotion()
  const rx = useSpring(useMotionValue(0), { stiffness: 200, damping: 18, mass: 0.5 })
  const ry = useSpring(useMotionValue(0), { stiffness: 200, damping: 18, mass: 0.5 })

  function onPointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (reduce) return
    const rect = e.currentTarget.getBoundingClientRect()
    const px = (e.clientX - rect.left) / rect.width - 0.5
    const py = (e.clientY - rect.top) / rect.height - 0.5
    rx.set(py * -6)
    ry.set(px * 6)
    const hx = ((px + 0.5) * 100).toFixed(2)
    const hy = ((py + 0.5) * 100).toFixed(2)
    e.currentTarget.style.setProperty('--glx', `${hx}%`)
    e.currentTarget.style.setProperty('--gly', `${hy}%`)
    e.currentTarget.style.setProperty('--mx', `${hx}%`)
    e.currentTarget.style.setProperty('--my', `${hy}%`)
    e.currentTarget.style.setProperty('box-shadow', `0 24px 60px rgba(0,0,0,0.18), 0 0 60px rgba(59,130,246,0.08)`)
  }

  function onEnter(e: React.PointerEvent<HTMLDivElement>) {
    const r = e.currentTarget.getBoundingClientRect()
    const center = { x: r.left + r.width / 2, y: r.top + r.height / 2 }
    const evt = new CustomEvent('cardHover', { detail: { x: center.x, y: center.y, active: true } })
    window.dispatchEvent(evt)
  }

  function onLeave() {
    rx.set(0)
    ry.set(0)
    ;(document.activeElement as HTMLElement | null)?.blur?.()
    const evt = new CustomEvent('cardHover', { detail: { active: false } })
    window.dispatchEvent(evt)
  }

  return (
    <motion.div
      className={`group relative glass rounded-3xl p-5 md:p-6 lg:p-6 w-full h-full flex flex-col items-center justify-center text-neutral-900/90 will-change-transform transition-all duration-200 hover:brightness-[1.03] ${onClick ? 'cursor-pointer' : ''} ${className ?? ''}`}
      style={{ rotateX: rx as unknown as number, rotateY: ry as unknown as number }}
      onPointerMove={onPointerMove}
      onPointerLeave={onLeave}
      onPointerEnter={onEnter}
      onClick={onClick}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.997 }}
      transition={{ type: 'spring', stiffness: 260, damping: 22 }}
    >
      {/* subtle green-grey glow that follows pointer */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-0"
        style={{
          background:
            'radial-gradient(220px 160px at var(--mx,50%) var(--my,50%), rgba(125, 153, 138, 0.12), rgba(125,153,138,0) 65%)'
        }}
      />
      <div className="text-base leading-relaxed relative z-10">{children}</div>
    </motion.div>
  )
}


