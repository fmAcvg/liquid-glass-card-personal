import React from 'react'

export default function SkillsBlock({ items }: { items?: string[] }) {
  const labels = items ?? []
  return (
    <div className="h-full w-full flex items-center justify-center">
      <div className="max-w-[32rem] w-full flex flex-wrap items-center justify-center gap-2 md:gap-3">
        {labels.map((label, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm md:text-base font-medium transition-all duration-200"
            style={{
              border: '1px solid rgba(var(--accent-rgb),0.28)',
              background:
                'linear-gradient(135deg, rgba(var(--accent-rgb),0.08), rgba(var(--accent-rgb),0.02))',
              boxShadow: '0 6px 18px rgba(var(--accent-rgb),0.18)'
            }}
          >
            <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: 'var(--accent)' }} />
            <span style={{ color: 'var(--text-primary)' }}>{label}</span>
          </span>
        ))}
      </div>
    </div>
  )
}


