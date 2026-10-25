import { motion, AnimatePresence } from 'framer-motion'
import Ward3D from './Ward3D.jsx'

// The story: one 3D ward, a new camera shot per step, and a caption saying what's happening.
export default function Scene({ phase, caption, data = [] }) {
  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', borderRadius: 26, overflow: 'hidden', background: 'linear-gradient(180deg, #F3F7FA 0%, #E6EDF3 60%, #DCE4EB 100%)', boxShadow: 'inset 0 0 0 1px var(--line)' }}>
      <Ward3D phase={phase} />
      <div style={{ position: 'absolute', left: 18, top: 16, zIndex: 30, background: 'rgba(24,52,79,.82)', color: '#fff', borderRadius: 9, padding: '5px 10px', fontSize: 11, fontWeight: 700, fontFamily: 'var(--display)', letterSpacing: '.08em', textTransform: 'uppercase' }}>
        The story
      </div>
      {/* Which existing systems Handoff is reading at this step */}
      <AnimatePresence mode="popLayout">
        {data.length > 0 && (
          <motion.div key={data.join()} initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0, transition: { delay: 0.25 } }} exit={{ opacity: 0 }}
            style={{ position: 'absolute', right: 16, top: 14, zIndex: 30, maxWidth: '72%', display: 'flex', flexWrap: 'wrap', justifyContent: 'flex-end', alignItems: 'center', gap: 5 }}>
            <span style={{ fontSize: 10, fontWeight: 800, fontFamily: 'var(--display)', letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--blue-800)', marginRight: 2 }}>Data from</span>
            {data.map((d, i) => (
              <motion.span key={d} initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1, transition: { delay: 0.35 + i * 0.12 } }}
                style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: 'rgba(255,255,255,.94)', color: 'var(--blue-900)', boxShadow: '0 0 0 1px var(--blue-300), 0 6px 14px -8px rgba(24,52,79,.45)', borderRadius: 8, padding: '4px 9px', fontSize: 11.5, fontWeight: 700, fontFamily: 'var(--display)', whiteSpace: 'nowrap' }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--blue)' }} />{d}
              </motion.span>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, padding: '70px 28px 22px', background: 'linear-gradient(180deg, rgba(24,52,79,0) 0%, rgba(24,52,79,.82) 74%)', pointerEvents: 'none', zIndex: 30 }}>
        <AnimatePresence mode="popLayout">
          <motion.div key={caption} className="display" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0, transition: { delay: 0.15 } }} exit={{ opacity: 0 }}
            style={{ color: '#fff', fontSize: 25, fontWeight: 700, letterSpacing: '-0.01em', lineHeight: 1.2 }}>{caption}</motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
