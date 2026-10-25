// Shared UI bits: icons, the Hint wrapper (registers the next tap target), animation presets.
import { createContext, useContext, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// The one control the presenter should tap next. App draws the spotlight around it.
export const HintTarget = createContext(() => {})

const P = { fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' }
const paths = {
  check: <path d="M5 12l4.5 4.5L19 7" />,
  x: <path d="M6 6l12 12M18 6L6 18" />,
  pin: <><path d="M12 21s-7-6.3-7-11a7 7 0 0 1 14 0c0 4.7-7 11-7 11z" /><circle cx="12" cy="10" r="2.5" /></>,
  back: <path d="M15 6l-6 6 6 6" />,
  next: <path d="M9 6l6 6-6 6" />,
  restart: <><path d="M3 12a9 9 0 1 0 3-6.7" /><path d="M3 4v5h5" /></>,
  hand: <><path d="M8 13V5.5a1.5 1.5 0 0 1 3 0V12" /><path d="M11 11.5V4a1.5 1.5 0 0 1 3 0v7.5" /><path d="M14 11.5V6a1.5 1.5 0 0 1 3 0v8" /><path d="M17 10.5a1.5 1.5 0 0 1 3 0V15a6 6 0 0 1-6 6h-2a6 6 0 0 1-5-2.7L4.2 14a1.6 1.6 0 0 1 2.6-1.8L8 13.5" /></>,
  clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
  phone: <><rect x="6" y="2" width="12" height="20" rx="2.5" /><path d="M11 18h2" /></>,
  user: <><circle cx="12" cy="8" r="4" /><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6" /></>,
  users: <><circle cx="9" cy="8" r="3.5" /><path d="M2.5 20c1-3.5 3.6-5.5 6.5-5.5s5.5 2 6.5 5.5" /><path d="M16 4.6a3.5 3.5 0 0 1 0 6.8M18.5 14.8c1.6.9 2.7 2.6 3.2 5.2" /></>,
  console: <><rect x="3" y="3" width="18" height="18" rx="3" /><path d="M3 9h18M9 21V9" /></>,
  play: <path d="M7 4.5v15l13-7.5z" fill="currentColor" stroke="none" />,
  pause: <><rect x="6" y="5" width="4" height="14" rx="1" fill="currentColor" stroke="none" /><rect x="14" y="5" width="4" height="14" rx="1" fill="currentColor" stroke="none" /></>,
  info: <><circle cx="12" cy="12" r="9" /><path d="M12 11v5M12 8v.01" /></>,
  bell: <><path d="M6 16V11a6 6 0 0 1 12 0v5l1.5 2h-15z" /><path d="M10 20.5a2 2 0 0 0 4 0" /></>,
  camera: <><path d="M4 8h3l1.5-2.5h7L17 8h3v11H4z" /><circle cx="12" cy="13" r="3.5" /></>,
  drop: <path d="M12 3s6 6.8 6 11a6 6 0 0 1-12 0c0-4.2 6-11 6-11z" />,
  shield: <><path d="M12 3l7 3v5c0 4.6-3.1 8-7 9.5C8.1 19 5 15.6 5 11V6z" /><path d="M9 12l2.2 2.2L15 10" /></>,
  lock: <><rect x="5" y="10.5" width="14" height="10" rx="2" /><path d="M8 10.5V8a4 4 0 0 1 8 0v2.5" /></>,
  doc: <><path d="M6 2.5h8l4 4v15H6z" /><path d="M14 2.5v4h4M9 12h6M9 16h6" /></>,
  book: <><path d="M3 5c3-1.2 6-1.2 9 1 3-2.2 6-2.2 9-1v14c-3-1.2-6-1.2-9 1-3-2.2-6-2.2-9-1z" /><path d="M12 6v14" /></>,
  gauge: <><path d="M3.5 17a8.5 8.5 0 1 1 17 0" /><path d="M12 17l4-5" /></>,
  bolt: <path d="M13 2L4 14h7l-1 8 9-12h-7z" />,
  warn: <><path d="M12 3l9.5 17h-19z" /><path d="M12 10v4.5M12 17.5v.01" /></>,
  nodes: <><circle cx="6" cy="6" r="2.6" /><circle cx="18" cy="8" r="2.6" /><circle cx="10" cy="18" r="2.6" /><path d="M8.5 6.6l7 1M7 8.5l2.3 7M16.6 10.3l-4.6 6" /></>,
  hospital: <><rect x="4" y="4" width="16" height="17" rx="2" /><path d="M12 8v6M9 11h6" /></>,
  valve: <><circle cx="12" cy="8" r="5" /><path d="M12 3v10M7 8h10M12 13v4M5 21h14v-4H5z" /></>,
  pump: <><rect x="4" y="9" width="10" height="9" rx="2" /><path d="M14 12h4l2-3M9 9V5h4" /><circle cx="9" cy="13.5" r="2" /></>,
  library: <><path d="M4 4h4v16H4zM10 4h4v16h-4z" /><path d="M16.5 5l3.5 1-3.5 14-3.4-1" /></>,
  send: <path d="M3 11l18-8-8 18-2-8z" />,
  grid: <><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /></>,
  video: <><rect x="3" y="6" width="12" height="12" rx="2" /><path d="M15 10.5l6-3.5v10l-6-3.5" /></>,
  pen: <><path d="M4 20l4.5-1 10-10-3.5-3.5-10 10z" /><path d="M13.5 7l3.5 3.5" /></>,
  wifi: <><path d="M2.5 9a14 14 0 0 1 19 0M5.5 12.5a9.5 9.5 0 0 1 13 0M8.6 15.8a5 5 0 0 1 6.8 0" /><circle cx="12" cy="19" r="1" fill="currentColor" /></>,
  waves: <path d="M3 9c2-2 4-2 6 0s4 2 6 0 4-2 6 0M3 15c2-2 4-2 6 0s4 2 6 0 4-2 6 0" />,
  star: <path d="M12 3.5l2.6 5.4 5.9.8-4.3 4.1 1 5.8L12 16.9l-5.2 2.7 1-5.8L3.5 9.7l5.9-.8z" />,
}
export function Icon({ name, size = 18, stroke = 2, style }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" {...P} strokeWidth={stroke} style={style} aria-hidden="true">{paths[name]}</svg>
}

// Presenter coach-mark: a pulsing amber ring around the thing to tap next.
export function Hint({ on, children, style, radius = 14 }) {
  const ref = useRef(null)
  const register = useContext(HintTarget)
  useEffect(() => {
    if (!on) return
    const el = ref.current
    register({ el, radius })
    return () => register((cur) => (cur && cur.el === el ? null : cur))
  }, [on, register, radius])
  return (
    <div ref={ref} className="hint" style={style}>
      {children}
      <AnimatePresence>
        {on && (
          <motion.div className="hint-ring" style={{ borderRadius: radius }}
            initial={{ opacity: 0, scale: 1.15 }}
            animate={{ opacity: [0.95, 0.35, 0.95], scale: [1, 1.035, 1] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }} />
        )}
      </AnimatePresence>
    </div>
  )
}

export const screen = {
  initial: { opacity: 0, x: 40 },
  animate: { opacity: 1, x: 0, transition: { type: 'spring', stiffness: 260, damping: 28, delay: 0.08 } },
  exit: { opacity: 0, x: -40, pointerEvents: 'none', transition: { duration: 0.16 } },
}

export const rise = (d = 0) => ({
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { delay: d, type: 'spring', stiffness: 300, damping: 26 } },
})

// Status chip for each step of a rebuilt procedure.
export const CONF = {
  verified: { label: 'Verified', cls: 'good' },
  inferred: { label: 'Inferred', cls: 'warn' },
  unknown: { label: 'Unknown', cls: 'bad' },
}
export function ConfChip({ c }) {
  const k = CONF[c]
  return <span className={`chip ${k.cls}`} style={{ padding: '2px 7px', fontSize: 9.5 }}>{k.label}</span>
}

// Mini sparkline used by Machine Check readouts.
export function Spark({ pts, color = 'var(--blue)', w = 120, h = 34 }) {
  const max = Math.max(...pts), min = Math.min(...pts), span = max - min || 1
  const d = pts.map((p, i) => `${i ? 'L' : 'M'}${(i / (pts.length - 1)) * w} ${h - 3 - ((p - min) / span) * (h - 6)}`).join(' ')
  return (
    <svg width={w} height={h} style={{ display: 'block', overflow: 'visible' }}>
      <motion.path d={d} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.2, ease: 'easeOut' }} />
    </svg>
  )
}

// Phone frame shared by every handset in the story.
export function PhoneShell({ head, children, headBg = '#fff', headInk = 'var(--ink)' }) {
  return (
    <div className="phone">
      <div className="phone-notch" />
      <div className="phone-screen">
        <div className="app-head" style={{ background: headBg, color: headInk, borderBottom: headBg === '#fff' ? '1px solid var(--line)' : 0 }}>{head}</div>
        <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>{children}</div>
      </div>
    </div>
  )
}

// Handoff app mark: two hands passing a dot along a loop.
export function Logo({ size = 44, mono }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden="true">
      <rect width="48" height="48" rx="13" fill={mono ? '#fff' : 'var(--blue-700)'} />
      <g fill="none" stroke={mono ? 'var(--blue-700)' : '#fff'} strokeWidth="3" strokeLinecap="round">
        <path d="M13 28a11 11 0 0 1 11-11h5" />
        <path d="M35 20a11 11 0 0 1-11 11h-5" />
        <path d="M26 13.5l3.5 3.5-3.5 3.5M22 27.5L18.5 31l3.5 3.5" />
      </g>
      <circle cx="24" cy="24" r="2.6" fill={mono ? 'var(--blue)' : '#9CC4E6'} />
    </svg>
  )
}
