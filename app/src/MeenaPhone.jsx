// Meena's phone: the Rule of Two. A second person is trained so the station never depends on one person again.
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Icon, Hint, PhoneShell, Logo, rise } from './ui.jsx'

const RUN = [['Close outlet V2', 'valve sensor'], ['Open inlet V1 half a turn', '1.2 bar'], ['Prime, wait for pressure', '2.1 bar'], ['Start the motor', '41 °C']]

export default function MeenaPhone({ go, hint }) {
  const [n, setN] = useState(0)
  useEffect(() => { const ts = RUN.map((_, i) => setTimeout(() => setN(i + 1), 700 + i * 800)); return () => ts.forEach(clearTimeout) }, [])
  const done = n >= RUN.length
  return (
    <PhoneShell head={<>
      <span className="row" style={{ gap: 8 }}><Logo size={24} /><span className="display" style={{ fontWeight: 800, fontSize: 16, color: 'var(--blue-900)' }}>Handoff</span></span>
      <span className="chip good">Backup trainee</span>
    </>}>
      <div className="screen-body" style={{ position: 'absolute', inset: 0, gap: 9 }}>
        <motion.div {...rise(0)} className="card" style={{ padding: 12 }}>
          <span className="chip good">RULE OF TWO</span>
          <div className="display" style={{ fontWeight: 800, fontSize: 15.5, marginTop: 7, lineHeight: 1.25 }}>You’re becoming PS4’s second operator</div>
          <div style={{ fontSize: 11.5, color: 'var(--ink-3)', marginTop: 4, lineHeight: 1.4 }}>So the pump never depends on one person again.</div>
        </motion.div>
        <motion.div {...rise(0.1)} className="card" style={{ padding: '6px 12px' }}>
          {[['Clip watched · quiz passed', '16:12']].map(([t, s]) => (
            <div key={t} className="row" style={{ gap: 8, padding: '5px 0', borderBottom: '1px solid var(--line-2)' }}>
              <Icon name="check" size={14} stroke={3} style={{ color: 'var(--green)' }} />
              <span style={{ fontSize: 12, flex: 1, fontWeight: 600 }}>{t}</span>
              <span style={{ fontSize: 10.5, color: 'var(--ink-3)' }}>{s}</span>
            </div>
          ))}
          <div className="row" style={{ gap: 8, padding: '6px 0 3px' }}>
            <Icon name="users" size={14} style={{ color: 'var(--blue)' }} />
            <span style={{ fontSize: 12, flex: 1, fontWeight: 700 }}>Shadow run: you run, Ravi watches</span>
          </div>
        </motion.div>
        <div className="card" style={{ padding: '4px 12px' }}>
          {RUN.map(([t, v], i) => (
            <div key={t} className="row" style={{ gap: 8, padding: '5px 0', borderBottom: i < RUN.length - 1 ? '1px solid var(--line-2)' : 0, opacity: n >= i ? 1 : 0.45 }}>
              <span style={{ width: 18, height: 18, borderRadius: '50%', display: 'grid', placeItems: 'center', background: n > i ? 'var(--green)' : 'var(--blue-100)', color: n > i ? '#fff' : 'var(--blue-700)', fontSize: 10, fontWeight: 800 }}>{n > i ? <Icon name="check" size={11} stroke={3.4} /> : i + 1}</span>
              <span style={{ fontSize: 12, flex: 1 }}>{t}</span>
              <span className="mono" style={{ fontSize: 10.5, color: n > i ? 'var(--green)' : 'var(--ink-3)' }}>{n > i ? `${v} ✓` : '…'}</span>
            </div>
          ))}
        </div>
        <AnimatePresence>
          {done && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="row" style={{ gap: 9, background: 'var(--green-100)', borderRadius: 12, padding: '8px 11px' }}>
              <span style={{ width: 26, height: 26, borderRadius: '50%', background: 'var(--blue-700)', color: '#fff', display: 'grid', placeItems: 'center', fontSize: 10, fontWeight: 800, fontFamily: 'var(--display)' }}>RK</span>
              <span style={{ fontSize: 11.5, color: '#1E6E4A', fontWeight: 700, lineHeight: 1.35 }}>Ravi signed you off · 16:40<br /><span style={{ fontWeight: 500 }}>All 4 Machine Checks passed</span></span>
            </motion.div>
          )}
        </AnimatePresence>
        <div style={{ flex: 1 }} />
        <Hint on={hint && done} style={{ width: '100%' }}>
          <button className="btn btn-safe" style={{ width: '100%' }} disabled={!done} onClick={() => go('share')}><Icon name="check" size={16} stroke={2.6} /> Finish shadow run</button>
        </Hint>
      </div>
    </PhoneShell>
  )
}
