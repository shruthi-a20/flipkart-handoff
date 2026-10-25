import { motion, AnimatePresence } from 'framer-motion'
import Ward3D from './Ward3D.jsx'

// The story: one 3D ward, a new camera shot per step, and a caption saying what's happening.
export default function Scene({ phase, caption }) {
  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', borderRadius: 26, overflow: 'hidden', background: 'linear-gradient(180deg, #F3F7FA 0%, #E6EDF3 60%, #DCE4EB 100%)', boxShadow: 'inset 0 0 0 1px var(--line)' }}>
      <Ward3D phase={phase} />
      <div style={{ position: 'absolute', left: 18, top: 16, zIndex: 30, background: 'rgba(24,52,79,.82)', color: '#fff', borderRadius: 9, padding: '5px 10px', fontSize: 11, fontWeight: 700, fontFamily: 'var(--display)', letterSpacing: '.08em', textTransform: 'uppercase' }}>
        The story
      </div>
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, padding: '70px 28px 22px', background: 'linear-gradient(180deg, rgba(24,52,79,0) 0%, rgba(24,52,79,.82) 74%)', pointerEvents: 'none', zIndex: 30 }}>
        <AnimatePresence mode="popLayout">
          <motion.div key={caption} className="display" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0, transition: { delay: 0.15 } }} exit={{ opacity: 0 }}
            style={{ color: '#fff', fontSize: 25, fontWeight: 700, letterSpacing: '-0.01em', lineHeight: 1.2 }}>{caption}</motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
