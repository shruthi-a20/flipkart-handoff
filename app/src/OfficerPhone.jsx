// The district officer's phone: a human grants limited, expiring authority. AI never does.
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Icon, Hint, PhoneShell, rise } from './ui.jsx'

const EVIDENCE = [
  ['user', 'ID matched to PS4 staff records'],
  ['check', 'Safety quiz passed · 11:42'],
  ['star', 'Procedure verified by Suresh M. · 91%'],
  ['bolt', 'Cascade check: Feeder 3 load OK'],
]

export default function OfficerPhone({ go, hint, auto }) {
  const [granted, setGranted] = useState(false)
  useEffect(() => { if (!auto) return; const t = setTimeout(() => setGranted(true), 2000); return () => clearTimeout(t) }, [auto])
  const grant = () => { if (granted) return; setGranted(true); setTimeout(() => go('restart'), 1300) }
  return (
    <PhoneShell headBg="var(--green)" headInk="#fff" head={<>
      <span className="display" style={{ fontWeight: 800, fontSize: 16 }}>Handoff Authority</span>
      <span className="chip" style={{ background: 'rgba(255,255,255,.2)', color: '#fff' }}>1 request</span>
    </>}>
      <div className="screen-body" style={{ position: 'absolute', inset: 0 }}>
        <motion.div {...rise(0)} className="card" style={{ padding: 12 }}>
          <div className="eyebrow">Request · 11:58</div>
          <div className="row" style={{ gap: 10, marginTop: 8 }}>
            <span style={{ width: 34, height: 34, borderRadius: '50%', background: 'var(--blue)', color: '#fff', display: 'grid', placeItems: 'center', fontWeight: 800, fontSize: 12, fontFamily: 'var(--display)' }}>RK</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 800, fontSize: 13.5 }}>Ravi K. · junior operator</div>
              <div style={{ fontSize: 11.5, color: 'var(--ink-3)' }}>Restart Pump Station 4 · Tier T2</div>
            </div>
          </div>
        </motion.div>
        <motion.div {...rise(0.12)} className="card" style={{ padding: '6px 12px' }}>
          {EVIDENCE.map(([ic, t], i) => (
            <div key={t} className="row" style={{ gap: 9, padding: '6px 0', borderBottom: i < 3 ? '1px solid var(--line-2)' : 0 }}>
              <span style={{ width: 22, height: 22, borderRadius: 7, background: 'var(--green-100)', color: 'var(--green)', display: 'grid', placeItems: 'center' }}><Icon name={ic} size={13} stroke={2.4} /></span>
              <span style={{ fontSize: 12, flex: 1 }}>{t}</span>
            </div>
          ))}
        </motion.div>
        <motion.div {...rise(0.24)} style={{ background: 'var(--blue-50)', borderRadius: 12, padding: '9px 11px' }}>
          <div className="eyebrow" style={{ color: 'var(--blue-700)' }}>Scope of authority</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginTop: 6 }}>
            {['This system only', '24 hours', 'Revocable', 'Every action logged'].map((t) => <span key={t} className="chip blue" style={{ background: '#fff' }}>{t}</span>)}
          </div>
          <div style={{ fontSize: 10.5, color: 'var(--ink-3)', marginTop: 7 }}>Under the Disaster Management Act, 2005</div>
        </motion.div>
        <div style={{ flex: 1 }} />
        <Hint on={hint && !granted} style={{ width: '100%' }}>
          <button className="btn btn-safe" style={{ width: '100%' }} onClick={grant} disabled={granted}><Icon name="shield" size={16} /> {granted ? 'Granted until tomorrow 12:00' : 'Grant 24 h authority'}</button>
        </Hint>
        <button className="btn btn-ghost" style={{ width: '100%', minHeight: 36, fontSize: 13 }}>Decline</button>
      </div>
    </PhoneShell>
  )
}
