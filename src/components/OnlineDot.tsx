import React, { useEffect, useState } from 'react'
import { DISCORD_USER_ID } from '../config'

export default function OnlineDot() {
  const [online, setOnline] = useState<boolean | null>(null)
  useEffect(() => {
    if (!DISCORD_USER_ID) { setOnline(false); return }
    const endpoint = `https://api.lanyard.rest/v1/users/${DISCORD_USER_ID}`
    fetch(endpoint)
      .then(r => r.json())
      .then(d => setOnline(Boolean(d?.data?.discord_status && d.data.discord_status !== 'offline')))
      .catch(() => setOnline(false))
  }, [])
  const color = online ? 'bg-emerald-500' : 'bg-neutral-400'
  return <span className={`absolute -bottom-1 -right-1 h-3.5 w-3.5 rounded-full ring-2 ring-white/80 ${color}`} />
}


