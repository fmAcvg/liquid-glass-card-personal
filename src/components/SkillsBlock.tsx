import React from 'react'

export default function SkillsBlock({ items }: { items?: string[] }) {
  const labels = items ?? []
  return (
    <div className="h-full w-full flex items-center justify-center">
      <div className="max-w-[32rem] w-full flex flex-wrap items-center justify-center gap-2 md:gap-3">
        {labels.map((label, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm md:text-base font-medium border border-blue-400/30 bg-gradient-to-br from-blue-50/60 to-blue-100/20 hover:from-blue-100/80 hover:to-blue-200/30 hover:shadow-[0_6px_18px_rgba(59,130,246,0.18)] transition-all duration-200"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-blue-500/80" />
            <span className="text-neutral-900/90">{label}</span>
          </span>
        ))}
      </div>
    </div>
  )
}


