// Dr Farah's phone: a dependent facility learns which of its own systems depend on the failing pump.
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Icon, Hint, PhoneShell, rise } from './ui.jsx'

export default function HospitalPhone({ go, hint, auto }) {
  const [on, setOn] = useState(false)
  useEffect(() => { if (!auto) return; const t = setTimeout(() => setOn(true), 2400); return () => clearTimeout(t) }, [auto])
  const sw = () => { if (on) return; setOn(true); setTimeout(() => go('access'), 1500) }
  return (
    <PhoneShell headBg="var(--blue-700)" headInk="#fff" head={<>
      <span className="display" style={{ fontWeight: 800, fontSize: 16 }}>Handoff Facility</span>
      <span className="chip" style={{ background: 'rgba(255,255,255,.2)', color: '#fff' }}>District Hospital</span>
    </>}>
      <div className="screen-body" style={{ position: 'absolute', inset: 0, gap: 9 }}>
        <motion.div {...rise(0)} className="card" style={{ padding: 12, borderLeft: '4px solid var(--amber)' }}>
          <div className="eyebrow" style={{ color: '#A86C0F' }}>Dependency alert · 09:04</div>
          <div className="display" style={{ fontWeight: 800, fontSize: 15.5, marginTop: 6, lineHeight: 1.25 }}>Your water comes from Pump Station 4. It has no operator.</div>
          <div style={{ fontSize: 11.5, color: 'var(--ink-2)', marginTop: 5, lineHeight: 1.4 }}>Supply may stop in about 18 hours. A restart is being prepared.</div>
        </motion.div>
        <motion.div {...rise(0.1)} className="card" style={{ padding: '6px 12px' }}>
          <div className="eyebrow" style={{ padding: '4px 0 2px' }}>What depends on it</div>
          {[['drop', 'Mains water', 'Pump Station 4', 'bad', 'At risk'], ['bolt', 'Power', 'Feeder 3, shared with the pump', 'warn', 'Watch'], ['hospital', 'Dialysis + ICU', 'need 9 kL a day', 'warn', 'Priority']].map(([ic, t, s, k, c], i) => (
            <div key={t} className="row" style={{ gap: 9, padding: '6px 0', borderBottom: i < 2 ? '1px solid var(--line-2)' : 0 }}>
              <Icon name={ic} size={15} style={{ color: 'var(--blue)' }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 12.5, fontWeight: 700 }}>{t}</div>
                <div style={{ fontSize: 10.5, color: 'var(--ink-3)' }}>{s}</div>
              </div>
              <span className={`chip ${k}`} style={{ padding: '2px 7px' }}>{c}</span>
            </div>
          ))}
        </motion.div>
        <motion.div {...rise(0.2)} className="row" style={{ gap: 8, background: 'var(--blue-50)', borderRadius: 12, padding: '8px 11px', fontSize: 11.5, color: 'var(--blue-800)', lineHeight: 1.35, alignItems: 'flex-start' }}>
          <Icon name="info" size={15} style={{ flex: 'none', marginTop: 1 }} /> You’ll be warned before any restart that loads Feeder 3.
        </motion.div>
        <AnimatePresence>
          {on && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="card" style={{ padding: 11 }}>
              <div className="row" style={{ justifyContent: 'space-between' }}>
                <span className="eyebrow">Reserve tank</span>
                <span className="chip good" style={{ padding: '2px 7px' }}>In use</span>
              </div>
              <div className="row" style={{ gap: 8, marginTop: 7 }}>
                <div className="bar" style={{ flex: 1, height: 8 }}><motion.span initial={{ width: 0 }} animate={{ width: '82%' }} transition={{ duration: 0.9 }} style={{ background: 'var(--blue)' }} /></div>
                <span className="mono" style={{ fontSize: 12, fontWeight: 700, color: 'var(--blue-700)' }}>2.4 days</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div style={{ flex: 1 }} />
        <Hint on={hint && !on} style={{ width: '100%' }}>
          <button className="btn btn-primary" style={{ width: '100%' }} onClick={sw} disabled={on}><Icon name="drop" size={16} /> {on ? 'Running on reserve water' : 'Switch to reserve water'}</button>
        </Hint>
      </div>
    </PhoneShell>
  )
}
