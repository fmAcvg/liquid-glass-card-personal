import React from 'react'

export default function ContactBlock({ content }: { content?: any }) {
  return (
    <div className="space-y-3">
      <a className="flex items-center justify-between gap-4 group" href={`mailto:${content?.email ?? ''}`}>
        <span className="text-neutral-600">Email</span>
        <span className="font-medium group-hover:underline decoration-neutral-400/50">{content?.email ?? '—'}</span>
      </a>
      <a className="flex items-center justify-between gap-4 group" href={content?.github ?? '#'} target="_blank" rel="noreferrer">
        <span className="text-neutral-600">GitHub</span>
        <span className="font-medium group-hover:underline decoration-neutral-400/50">{content?.github ?? '—'}</span>
      </a>
      <div className="flex items-center justify-between gap-4">
        <span className="text-neutral-600">LinkedIn</span>
        <span className="font-medium">{content?.linkedin ?? '—'}</span>
      </div>
      <div className="flex items-center justify-between gap-4">
        <span className="text-neutral-600">Discord</span>
        <span className="font-medium">{content?.discord ?? '—'}</span>
      </div>
    </div>
  )
}


