import { motion } from 'framer-motion'
import { STAGES } from './flow.js'

// Soft contour lines behind the header, like a calm map. Purely decorative.
function Contours({ h }) {
  const lines = Array.from({ length: 9 }, (_, i) => i)
  return (
    <svg width="1600" height={h} style={{ position: 'absolute', inset: 0, overflow: 'hidden' }} aria-hidden="true">
      {lines.map((i) => (
        <path key={i} fill="none" stroke="#E2EEF9" strokeWidth="1.4"
          d={`M-20 ${10 + i * 12} C 260 ${-10 + i * 14}, 520 ${40 + i * 10}, 820 ${14 + i * 12} S 1360 ${-6 + i * 13}, 1640 ${24 + i * 11}`} />
      ))}
    </svg>
  )
}

function StageStrip({ h = 4, style }) {
  return (
    <div style={{ display: 'flex', height: h, ...style }}>
      {Object.values(STAGES).map((s) => <span key={s.label} style={{ flex: 1, background: s.color, opacity: 0.85 }} />)}
    </div>
  )
}

export function TopBand({ children }) {
  return (
    <div style={{ position: 'absolute', left: 0, right: 0, top: 0, height: 92, background: '#FBFCFD', zIndex: 2 }}>
      <Contours h={92} />
      <StageStrip style={{ position: 'absolute', left: 0, right: 0, bottom: 0 }} />
      {children}
    </div>
  )
}

export function BottomBand({ children }) {
  return (
    <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.8, ease: 'easeOut' }}
      style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 128, zIndex: 3, background: '#FBFCFD', borderTop: '1px solid var(--line)' }}>
      <div style={{ position: 'absolute', left: 32, right: 32, top: 0, bottom: 0, display: 'flex', alignItems: 'center', gap: 20 }}>
        {children}
      </div>
    </motion.div>
  )
}
