import React, { useEffect, useState } from 'react'
import { motion, useReducedMotion, useSpring } from 'framer-motion'

export default function BackgroundCapsules({ active = true }: { active?: boolean }) {
  const reduce = useReducedMotion()
  const [paths, setPaths] = useState<string[]>([])
  const [hoverPos, setHoverPos] = useState<{ x: number; y: number } | null>(null)
  const [ripples, setRipples] = useState<Array<{ id: number; x: number; y: number }>>([])

  useEffect(() => {
    const width = 1440
    const height = 800
    const numPaths = 5
    function mulberry32(a: number) {
      return function () {
        let t = (a += 0x6D2B79F5)
        t = Math.imul(t ^ (t >>> 15), t | 1)
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296
      }
    }
    function makePath(seed: number, bandY: number) {
      const rand = mulberry32(seed)
      const points: Array<{ x: number; y: number }> = []
      const steps = 6 + Math.floor(rand() * 3)
      const margin = 100
      const stepX = (width + margin * 2) / steps
      let y = bandY + (rand() - 0.5) * 40
      for (let i = 0; i <= steps; i += 1) {
        const x = -margin + i * stepX
        const amp = 50 + rand() * 90
        y += (rand() - 0.5) * amp
        y = Math.min(height - 80, Math.max(80, y))
        points.push({ x: Math.round(x), y: Math.round(y) })
      }
      return points.map((p, idx) => `${idx === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')
    }
    const newPaths: string[] = []
    const used = new Set<string>()
    for (let i = 0; i < numPaths; i++) {
      const band = 140 + i * 120 + (i % 2 === 0 ? 0 : 30)
      let attempt = 0
      while (attempt < 10) {
        const d = makePath(1234 + i * 97 + attempt * 13, band)
        const key = d.replace(/\s+/g, '')
        if (!used.has(key)) { used.add(key); newPaths.push(d); break }
        attempt++
      }
    }
    setPaths(newPaths)
  }, [])

  const gradients = [
    { id: 'capsGrad1', stops: [
      { o: '0%', c: 'rgba(255,255,255,0)' },
      { o: '22%', c: 'rgba(147,197,253,0.9)' },
      { o: '60%', c: 'rgba(59,130,246,0.85)' },
      { o: '88%', c: 'rgba(14,165,233,0.7)' },
      { o: '100%', c: 'rgba(255,255,255,0)' }
    ]},
    { id: 'capsGrad2', stops: [
      { o: '0%', c: 'rgba(255,255,255,0)' },
      { o: '25%', c: 'rgba(191,219,254,0.9)' },
      { o: '55%', c: 'rgba(96,165,250,0.85)' },
      { o: '85%', c: 'rgba(59,130,246,0.9)' },
      { o: '100%', c: 'rgba(255,255,255,0)' }
    ]},
    { id: 'capsGrad3', stops: [
      { o: '0%', c: 'rgba(255,255,255,0)' },
      { o: '30%', c: 'rgba(125,211,252,0.9)' },
      { o: '60%', c: 'rgba(56,189,248,0.85)' },
      { o: '88%', c: 'rgba(37,99,235,0.8)' },
      { o: '100%', c: 'rgba(255,255,255,0)' }
    ]}
  ]
  const widths = [18, 22, 12, 16, 10]
  const durations = [22, 26, 28, 24, 30]

  const mx = useSpring(0, { stiffness: 120, damping: 18 })
  const my = useSpring(0, { stiffness: 120, damping: 18 })
  const vx = useSpring(0, { stiffness: 80, damping: 20 })
  const vy = useSpring(0, { stiffness: 80, damping: 20 })
  const last = React.useRef<{ x: number; y: number; t: number }>({ x: 0, y: 0, t: Date.now() })

  useEffect(() => {
    if (reduce || !active) return
    const onMove = (e: PointerEvent) => {
      const now = Date.now()
      const dt = Math.max(1, now - last.current.t)
      const dx = e.clientX - last.current.x
      const dy = e.clientY - last.current.y
      const speed = Math.min(1, Math.hypot(dx, dy) / dt * 0.2)
      mx.set(e.clientX)
      my.set(e.clientY)
      vx.set(speed)
      vy.set(speed)
      last.current = { x: e.clientX, y: e.clientY, t: now }
    }
    window.addEventListener('pointermove', onMove)
    return () => window.removeEventListener('pointermove', onMove)
  }, [reduce, active])

  useEffect(() => {
    const onCardHover = (e: any) => {
      if (e.detail?.active && typeof e.detail.x === 'number') setHoverPos({ x: e.detail.x, y: e.detail.y })
      else setHoverPos(null)
    }
    window.addEventListener('cardHover', onCardHover)
    return () => window.removeEventListener('cardHover', onCardHover)
  }, [])

  useEffect(() => {
    if (reduce || !active) return
    const onDown = (e: PointerEvent) => {
      const id = Date.now() + Math.random()
      setRipples(r => [...r.slice(-6), { id, x: e.clientX, y: e.clientY }])
      setTimeout(() => setRipples(r => r.filter(rr => rr.id !== id)), 900)
    }
    window.addEventListener('pointerdown', onDown)
    return () => window.removeEventListener('pointerdown', onDown)
  }, [reduce, active])

  return (
    <svg
      className="pointer-events-none absolute inset-0 w-full h-full overflow-hidden"
      viewBox="0 0 1440 800"
      preserveAspectRatio="xMidYMid slice"
      style={{ overflow: 'hidden' }}
    >
      <defs>
        {gradients.map(g => (
          <linearGradient id={g.id} key={g.id} x1="0%" y1="0%" x2="100%" y2="0%">
            {g.stops.map((s, i) => (
              <stop key={i} offset={s.o} stopColor={s.c} />
            ))}
          </linearGradient>
        ))}
        <radialGradient id="haloGrad" r="1" cx="0" cy="0" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="rgba(255,255,255,0.9)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0)" />
        </radialGradient>
        <radialGradient id="haloColor1" r="1" cx="0" cy="0" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="rgba(147,197,253,0.5)" />
          <stop offset="100%" stopColor="rgba(147,197,253,0)" />
        </radialGradient>
        <radialGradient id="haloColor2" r="1" cx="0" cy="0" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="rgba(59,130,246,0.45)" />
          <stop offset="100%" stopColor="rgba(59,130,246,0)" />
        </radialGradient>
      </defs>

      <motion.g
        style={{ x: reduce ? 0 : (mx as unknown as number), y: reduce ? 0 : (my as unknown as number) }}
        transformTemplate={({ x, y }) => `translate(${Number(x)/40 + Number(vx.get())*6}px, ${Number(y)/50 + Number(vy.get())*6}px)`}
        animate={reduce ? undefined : { filter: ['hue-rotate(0deg)', 'hue-rotate(8deg)', 'hue-rotate(0deg)'] }}
        transition={{ duration: 120, repeat: Infinity, ease: 'easeInOut' }}
        style-prop:overflow="hidden"
      >
        {paths.map((d, i) => (
          <g key={i}>
            <path d={d} stroke="rgba(255,255,255,0.12)" strokeWidth={widths[i % widths.length]} fill="none" strokeLinecap="round" />
            <motion.path
              d={d}
              stroke={`url(#${gradients[i % gradients.length].id})`}
              strokeLinecap="round"
              strokeWidth={widths[i % widths.length] + (hoverPos ? 0.6 : 0)}
              fill="none"
              pathLength={1}
              style={{ strokeDasharray: '0.22 0.78', filter: 'blur(0.3px)' }}
              initial={reduce ? undefined : { strokeDashoffset: 0 }}
              animate={reduce ? undefined : { strokeDashoffset: (i % 2 === 0) ? [-0, -1] : [0, 1], opacity: hoverPos ? 0.95 : 0.85 }}
              transition={{ duration: durations[i % durations.length], repeat: Infinity, ease: 'easeInOut' }}
            />
            <motion.path
              d={d}
              stroke={`url(#${gradients[(i + 1) % gradients.length].id})`}
              strokeLinecap="round"
              strokeWidth={widths[i % widths.length] - 4 + (hoverPos ? 0.4 : 0)}
              fill="none"
              pathLength={1}
              style={{ strokeDasharray: '0.16 0.84', mixBlendMode: 'overlay' as any, opacity: hoverPos ? 0.9 : 0.8 }}
              initial={reduce ? undefined : { strokeDashoffset: (i % 2 === 0) ? 0.5 : -0.5 }}
              animate={reduce ? undefined : { strokeDashoffset: (i % 2 === 0) ? [0.5, -0.5] : [-0.5, 0.5] }}
              transition={{ duration: durations[i % durations.length] * 1.2, repeat: Infinity, ease: 'easeInOut' }}
            />
          </g>
        ))}
      </motion.g>

      <motion.circle r={260} fill="url(#haloGrad)" style={{ cx: mx as unknown as number, cy: my as unknown as number, opacity: reduce ? 0 : (active ? 0.06 : 0.02) }} animate={{ r: [250, 265, 250] }} transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }} />
      <motion.circle r={340} fill="url(#haloColor1)" animate={{ cx: [200, 1200, 800, 300], cy: [120, 200, 680, 520], opacity: hoverPos ? [0.12, 0.18, 0.12] : [0.08, 0.1, 0.08] }} transition={{ duration: 90, repeat: Infinity, ease: 'easeInOut' }} />
      <motion.circle r={300} fill="url(#haloColor2)" animate={{ cx: [1200, 200, 480, 1100], cy: [600, 140, 400, 680], opacity: hoverPos ? [0.12, 0.18, 0.12] : [0.08, 0.1, 0.08] }} transition={{ duration: 110, repeat: Infinity, ease: 'easeInOut' }} />

      {!reduce && ripples.map(r => (
        <motion.circle
          key={r.id}
          cx={r.x}
          cy={r.y}
          r={6}
          fill="none"
          stroke="rgba(255,255,255,0.45)"
          strokeWidth={1}
          initial={{ r: 6, opacity: 0.25 }}
          animate={{ r: 140, opacity: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
      ))}
    </svg>
  )
}


