// The district officer's phone: a human grants limited, expiring authority. AI never does.
// Two requests in the story: Ravi's Tier T2 restart, and Priya's Tier T4 emergency licence.
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Icon, Hint, PhoneShell, rise } from './ui.jsx'

const REQ = {
  authorize: {
    time: '11:58', initials: 'RK', color: 'var(--blue)', name: 'Ravi K. · junior operator', task: 'Restart Pump Station 4 · Tier T2',
    evidence: [
      ['user', 'Aadhaar eKYC + Metrowater staff record'],
      ['check', 'Safety quiz passed · 11:42'],
      ['star', 'Procedure verified by Suresh M. · 91%'],
      ['bolt', 'Cascade check: Feeder 3 load OK'],
    ],
    approvers: null,
    scope: ['This system only', '24 hours', 'Revocable', 'Every action logged'],
    button: 'Grant 24 h authority', done: 'Granted until tomorrow 12:00', next: 'restart', chip: '1 request',
  },
  licence: {
    time: '14:18', initials: 'PN', color: '#8A5BA8', name: 'Priya N. · retired water chemist', task: 'Emergency licence · Tier T4 chlorination',
    evidence: [
      ['doc', 'DigiLocker: analyst licence, lapsed 2024'],
      ['users', 'e-Shram: water treatment · Aadhaar ✓'],
      ['video', 'Supervised live by the state lab'],
    ],
    approvers: [['KS', 'Karthik S. · Metrowater', '14:16'], ['AR', 'You · district', null]],
    scope: ['Chlorination at PS4 only', 'Until 22:00 today', 'Supervised', 'Logged'],
    button: 'Grant emergency licence', done: 'Licence issued until 22:00', next: 'dose', chip: 'Tier T4',
  },
}

export default function OfficerPhone({ phase, go, hint, auto }) {
  const r = REQ[phase] || REQ.authorize
  const [granted, setGranted] = useState(false)
  useEffect(() => { if (!auto) return; const t = setTimeout(() => setGranted(true), 2000); return () => clearTimeout(t) }, [auto])
  const grant = () => { if (granted) return; setGranted(true); setTimeout(() => go(r.next), 1300) }
  return (
    <PhoneShell headBg="var(--green)" headInk="#fff" head={<>
      <span className="display" style={{ fontWeight: 800, fontSize: 16 }}>Handoff Authority</span>
      <span className="chip" style={{ background: 'rgba(255,255,255,.2)', color: '#fff' }}>{r.chip}</span>
    </>}>
      <div className="screen-body" style={{ position: 'absolute', inset: 0, gap: 8 }}>
        <motion.div {...rise(0)} className="card" style={{ padding: 11 }}>
          <div className="eyebrow">Request · {r.time}</div>
          <div className="row" style={{ gap: 10, marginTop: 7 }}>
            <span style={{ width: 32, height: 32, borderRadius: '50%', background: r.color, color: '#fff', display: 'grid', placeItems: 'center', fontWeight: 800, fontSize: 12, fontFamily: 'var(--display)', flex: 'none' }}>{r.initials}</span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 800, fontSize: 13 }}>{r.name}</div>
              <div style={{ fontSize: 11.5, color: 'var(--ink-3)' }}>{r.task}</div>
            </div>
          </div>
        </motion.div>
        <motion.div {...rise(0.1)} className="card" style={{ padding: '4px 11px' }}>
          {r.evidence.map(([ic, t], i) => (
            <div key={t} className="row" style={{ gap: 8, padding: '5px 0', borderBottom: i < r.evidence.length - 1 ? '1px solid var(--line-2)' : 0 }}>
              <span style={{ width: 21, height: 21, flex: 'none', borderRadius: 7, background: 'var(--green-100)', color: 'var(--green)', display: 'grid', placeItems: 'center' }}><Icon name={ic} size={12} stroke={2.4} /></span>
              <span style={{ fontSize: 11.5, flex: 1, lineHeight: 1.3 }}>{t}</span>
            </div>
          ))}
        </motion.div>
        {r.approvers && (
          <motion.div {...rise(0.18)} className="card" style={{ padding: '7px 11px' }}>
            <div className="eyebrow">Two approvers needed</div>
            {r.approvers.map(([ini, n, t], i) => {
              const ok = t || granted
              return (
                <div key={n} className="row" style={{ gap: 8, marginTop: 6 }}>
                  <span className="mono" style={{ fontSize: 10.5, color: 'var(--ink-3)', width: 10 }}>{i + 1}</span>
                  <span style={{ fontSize: 12, flex: 1, fontWeight: 600 }}>{n}</span>
                  <span className={`chip ${ok ? 'good' : 'warn'}`} style={{ padding: '2px 7px' }}>{ok ? `✓ ${t || 'now'}` : 'Pending'}</span>
                </div>
              )
            })}
          </motion.div>
        )}
        <motion.div {...rise(0.24)} style={{ background: 'var(--blue-50)', borderRadius: 12, padding: '8px 10px' }}>
          <div className="eyebrow" style={{ color: 'var(--blue-700)' }}>Scope of authority</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginTop: 6 }}>
            {r.scope.map((t) => <span key={t} className="chip blue" style={{ background: '#fff' }}>{t}</span>)}
          </div>
          <div style={{ fontSize: 10.5, color: 'var(--ink-3)', marginTop: 6 }}>Under the Disaster Management Act, 2005</div>
        </motion.div>
        <div style={{ flex: 1 }} />
        <Hint on={hint && !granted} style={{ width: '100%' }}>
          <button className="btn btn-safe" style={{ width: '100%' }} onClick={grant} disabled={granted}><Icon name="shield" size={16} /> {granted ? r.done : r.button}</button>
        </Hint>
        {!r.approvers && <button className="btn btn-ghost" style={{ width: '100%', minHeight: 36, fontSize: 13 }}>Decline</button>}
      </div>
    </PhoneShell>
  )
}
