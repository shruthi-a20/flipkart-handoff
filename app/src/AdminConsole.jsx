// Karthik's admin console at Chennai Metrowater. Two moments in the story:
// 'access': admin rights reach him by succession; he connects systems read-only and sets who can see what.
// 'audit': every action and approval is logged, and every permission has an end date.
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Icon, Hint, Logo, rise } from './ui.jsx'

export default function AdminConsole({ phase, go, hint }) {
  const audit = phase === 'audit'
  return (
    <div style={{ width: '100%', height: '100%', background: 'var(--panel)', borderRadius: 24, overflow: 'hidden', display: 'flex', flexDirection: 'column', boxShadow: 'inset 0 0 0 1px var(--line)' }}>
      <div style={{ height: 52, flex: 'none', display: 'flex', alignItems: 'center', gap: 12, padding: '0 18px', background: '#2C3A47', color: '#fff' }}>
        <Logo size={26} mono />
        <span className="display" style={{ fontWeight: 700, fontSize: 14 }}>Handoff Admin · Chennai Metrowater</span>
        <span style={{ flex: 1 }} />
        <span className="chip" style={{ background: 'rgba(255,255,255,.14)', color: '#fff' }}><Icon name="user" size={12} /> Karthik S. · Org admin</span>
        <span className="mono" style={{ fontSize: 11.5, opacity: 0.7 }}>{audit ? 'Audit · Case W34-017' : 'Access & data'}</span>
      </div>
      <div style={{ flex: 1, minHeight: 0, position: 'relative', background: '#fff' }}>
        {audit ? <Audit /> : <Access />}
      </div>
      <Bar audit={audit} go={go} hint={hint} />
    </div>
  )
}

/* ---------------- access ---------------- */

const SYSTEMS = [
  ['bell', 'SCADA', 'alarms, pump and tank telemetry'],
  ['grid', 'SAP PM', 'work orders, logbook scans'],
  ['users', 'HRMS', 'staff records, to verify inheritors'],
  ['doc', 'Document store', 'manuals and drawings'],
]

// Who can see what. Roles belong to positions, not to named people.
const COLS = ['Case', 'Live sensors', 'Procedures', 'Staff identity', 'Audit log']
const MATRIX = [
  ['Reporter', 'Lakshmi', ['own report', 0, 0, 0, 0]],
  ['Inheritor', 'Ravi', ['own case', 'own site', 'assigned', 'self', 0]],
  ['Knowledge holder', 'Suresh', ['assigned', 0, 'edit · verify', 0, 0]],
  ['Coordinator', 'Control room', ['district', 'district', 'read', 'masked', 'read']],
  ['Authority holder', 'Anitha R.', ['district', 'read', 'read', 'verify', 'full']],
  ['Org admin', 'Karthik', ['own org', 'own org', 'own org', 'own org', 'full']],
]

function Access() {
  const [n, setN] = useState(0)
  useEffect(() => { const ts = SYSTEMS.map((_, i) => setTimeout(() => setN(i + 1), 500 + i * 450)); return () => ts.forEach(clearTimeout) }, [])
  return (
    <div style={{ position: 'absolute', inset: 0, padding: '14px 18px', display: 'flex', flexDirection: 'column', gap: 11 }}>
      <motion.div {...rise(0)} className="row" style={{ gap: 12, background: 'var(--amber-100)', borderRadius: 14, padding: '9px 13px' }}>
        <span style={{ width: 32, height: 32, borderRadius: 10, background: '#fff', color: '#A86C0F', display: 'grid', placeItems: 'center', flex: 'none' }}><Icon name="lock" size={17} /></span>
        <div style={{ flex: 1, fontSize: 12, color: '#6E4A0E', lineHeight: 1.4 }}>
          <b>Admin rights passed to you by succession.</b> The Chief Engineer, Metrowater’s admin, vanished. Next in the order of succession: IT manager.
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4, flex: 'none' }}>
          <span className="chip good" style={{ padding: '2px 7px' }}>✓ Succession order</span>
          <span className="chip good" style={{ padding: '2px 7px' }}>✓ District · A. R.</span>
        </div>
      </motion.div>
      <div style={{ display: 'flex', gap: 14, flex: 1, minHeight: 0 }}>
        <div style={{ width: 268, flex: 'none', display: 'flex', flexDirection: 'column', gap: 6 }}>
          <div className="row" style={{ justifyContent: 'space-between' }}>
            <span className="eyebrow">Connect to Handoff</span>
            <span style={{ fontSize: 10.5, color: 'var(--ink-3)' }}>read-only</span>
          </div>
          {SYSTEMS.map(([ic, t, s], i) => {
            const on = n > i
            return (
              <div key={t} className="row" style={{ gap: 9, padding: '8px 10px', borderRadius: 12, background: on ? 'var(--blue-50)' : '#fff', boxShadow: `inset 0 0 0 1px ${on ? 'var(--blue-300)' : 'var(--line)'}`, transition: 'all .3s' }}>
                <Icon name={ic} size={15} style={{ color: on ? 'var(--blue)' : 'var(--ink-3)' }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12.5, fontWeight: 700 }}>{t}</div>
                  <div style={{ fontSize: 10.5, color: 'var(--ink-3)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{s}</div>
                </div>
                <span style={{ width: 34, height: 20, borderRadius: 10, background: on ? 'var(--blue)' : '#D3DBE3', position: 'relative', transition: 'background .3s', flex: 'none' }}>
                  <span style={{ position: 'absolute', top: 2, left: on ? 16 : 2, width: 16, height: 16, borderRadius: '50%', background: '#fff', transition: 'left .3s' }} />
                </span>
              </div>
            )
          })}
          <div className="row" style={{ gap: 9, padding: '7px 10px', borderRadius: 12, background: 'var(--panel)', fontSize: 11, color: 'var(--ink-2)' }}>
            <Icon name="wifi" size={14} style={{ color: 'var(--ink-3)' }} /> JJM IoT sensors: already shared by the state
          </div>
          <div style={{ flex: 1 }} />
          <div style={{ background: 'var(--panel)', borderRadius: 12, padding: '8px 10px', fontSize: 11, color: 'var(--ink-2)', lineHeight: 1.45 }}>
            <b>Never shared:</b> billing, customer data, write access to any machine.
          </div>
        </div>
        <div style={{ flex: 1, minWidth: 0, borderRadius: 14, boxShadow: 'inset 0 0 0 1px var(--line)', padding: '9px 12px', display: 'flex', flexDirection: 'column' }}>
          <div className="row" style={{ justifyContent: 'space-between', marginBottom: 6 }}>
            <span className="eyebrow">Who can see what</span>
            <span style={{ fontSize: 10.5, color: 'var(--ink-3)' }}>roles belong to positions, not people</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '104px repeat(5, 1fr)', gap: 3, fontSize: 10.5 }}>
            <span />
            {COLS.map((c) => <span key={c} style={{ fontWeight: 700, color: 'var(--ink-3)', textAlign: 'center', fontSize: 10, lineHeight: 1.15, paddingBottom: 3 }}>{c}</span>)}
            {MATRIX.map(([r, who, cells], ri) => (
              <Row key={r} r={r} who={who} cells={cells} d={0.2 + ri * 0.08} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function Row({ r, who, cells, d }) {
  return (
    <>
      <motion.div {...rise(d)} style={{ padding: '4px 0', lineHeight: 1.15 }}>
        <div style={{ fontWeight: 800, fontSize: 11, color: 'var(--ink)' }}>{r}</div>
        <div style={{ fontSize: 9.5, color: 'var(--ink-3)' }}>{who}</div>
      </motion.div>
      {cells.map((c, i) => (
        <motion.span key={i} {...rise(d + 0.03 * i)} style={{ display: 'grid', placeItems: 'center', borderRadius: 7, fontWeight: 700, fontSize: 10, textAlign: 'center', padding: '0 2px', background: c === 'full' ? 'var(--green-100)' : c ? 'var(--blue-50)' : 'transparent', color: c === 'full' ? '#1E6E4A' : c ? 'var(--blue-700)' : '#B8C2CC', boxShadow: c ? 'none' : 'inset 0 0 0 1px var(--line-2)' }}>
          {c || '—'}
        </motion.span>
      ))}
    </>
  )
}

/* ---------------- audit ---------------- */

const LOG = [
  ['09:00', 'Lakshmi', 'Reported silent pump', 'no login'],
  ['09:08', 'Karthik', 'Shared 4 systems, read-only', 'District · A. R.'],
  ['09:20', 'Ravi', 'Closed outlet V2 · T1', 'Machine Check'],
  ['11:00', 'Suresh', 'Verified restart procedure', 'Expert sign-off'],
  ['12:00', 'Anitha R.', 'Granted Ravi T2, 24 h', 'DM Act order'],
  ['14:00', 'Ravi', 'Restarted pump · 4 checks', 'Machine Check'],
  ['14:20', 'Anitha R.', 'Emergency licence to Priya', '+ Karthik'],
  ['14:58', 'Priya', 'Chlorinated · 0.5 mg/L', 'State lab'],
  ['16:40', 'Ravi', 'Signed off Meena as backup', 'Machine Check'],
]

const PERMS = [
  ['Ravi K.', 'T2 · restart PS4', 'tomorrow 12:00', 'warn'],
  ['Priya N.', 'T4 licence · chlorination', 'today 22:00', 'warn'],
  ['Suresh M.', 'Expert view of 1 procedure', 'with the case', 'neutral'],
  ['Metrowater data', 'SCADA, SAP PM, HRMS, docs', 'with the order', 'neutral'],
]

function Audit() {
  return (
    <div style={{ position: 'absolute', inset: 0, padding: '14px 18px', display: 'flex', gap: 14 }}>
      <div style={{ flex: 1.15, minWidth: 0, borderRadius: 14, boxShadow: 'inset 0 0 0 1px var(--line)', padding: '9px 12px' }}>
        <div className="row" style={{ justifyContent: 'space-between', marginBottom: 4 }}>
          <span className="eyebrow">Audit log · who did what, who approved</span>
          <span className="chip neutral" style={{ padding: '2px 6px' }}>tamper-evident</span>
        </div>
        {LOG.map(([t, who, what, by], i) => (
          <motion.div key={t + what} {...rise(0.05 + i * 0.06)} className="row" style={{ gap: 9, padding: '5.5px 0', borderBottom: i < LOG.length - 1 ? '1px solid var(--line-2)' : 0 }}>
            <span className="mono" style={{ fontSize: 10.5, color: 'var(--ink-3)', width: 34 }}>{t}</span>
            <span style={{ fontSize: 11.5, fontWeight: 800, width: 64 }}>{who}</span>
            <span style={{ fontSize: 11.5, flex: 1, minWidth: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{what}</span>
            <span className="chip good" style={{ padding: '2px 6px', fontSize: 9.5 }}>{by}</span>
          </motion.div>
        ))}
      </div>
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{ borderRadius: 14, boxShadow: 'inset 0 0 0 1px var(--line)', padding: '9px 12px' }}>
          <div className="row" style={{ justifyContent: 'space-between', marginBottom: 2 }}>
            <span className="eyebrow">Active permissions</span>
            <span style={{ fontSize: 10.5, color: 'var(--ink-3)' }}>all expire on their own</span>
          </div>
          {PERMS.map(([who, what, until, k], i) => (
            <motion.div key={who} {...rise(0.2 + i * 0.08)} className="row" style={{ gap: 8, padding: '6px 0', borderBottom: i < PERMS.length - 1 ? '1px solid var(--line-2)' : 0 }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 12, fontWeight: 800 }}>{who}</div>
                <div style={{ fontSize: 10.5, color: 'var(--ink-3)' }}>{what}</div>
              </div>
              <span className={`chip ${k}`} style={{ padding: '2px 7px' }}><Icon name="clock" size={11} /> {until}</span>
              <span style={{ fontSize: 10.5, fontWeight: 700, color: 'var(--red)', cursor: 'pointer' }}>Revoke</span>
            </motion.div>
          ))}
        </div>
        <motion.div {...rise(0.5)} style={{ background: 'var(--panel)', borderRadius: 14, padding: '10px 12px' }}>
          <div className="eyebrow">Custody record · Pump Station 4</div>
          <div className="row" style={{ gap: 8, marginTop: 7 }}>
            {[['RK', 'Ravi K.', 'temporary custodian', 'var(--blue-700)'], ['MS', 'Meena S.', 'backup', '#2E8A83']].map(([ini, n, s, c]) => (
              <div key={n} className="row" style={{ gap: 7, flex: 1, background: '#fff', borderRadius: 10, padding: '6px 8px' }}>
                <span style={{ width: 24, height: 24, borderRadius: '50%', background: c, color: '#fff', display: 'grid', placeItems: 'center', fontSize: 9.5, fontWeight: 800, fontFamily: 'var(--display)' }}>{ini}</span>
                <div><div style={{ fontSize: 11.5, fontWeight: 800 }}>{n}</div><div style={{ fontSize: 10, color: 'var(--ink-3)' }}>{s}</div></div>
              </div>
            ))}
          </div>
          <div style={{ fontSize: 11, color: 'var(--ink-2)', marginTop: 7, lineHeight: 1.4 }}>Custody, not ownership: it ends if the original operators return.</div>
        </motion.div>
      </div>
    </div>
  )
}

/* ---------------- action bar ---------------- */

function Bar({ audit, go, hint }) {
  const [ready, setReady] = useState(audit)
  const [done, setDone] = useState(false)
  useEffect(() => { if (audit) return; const t = setTimeout(() => setReady(true), 2400); return () => clearTimeout(t) }, [audit])
  const click = () => { if (done) return; setDone(true); setTimeout(() => go(audit ? 'closed' : 'onsite'), audit ? 300 : 1100) }
  return (
    <div style={{ height: 64, flex: 'none', display: 'flex', alignItems: 'center', gap: 12, padding: '0 18px', borderTop: '1px solid var(--line)', background: '#fff' }}>
      <Icon name="info" size={16} style={{ color: 'var(--ink-3)' }} />
      <span style={{ fontSize: 12.5, color: 'var(--ink-2)', flex: 1 }}>{audit ? 'Authority, licences and data access end on their own. Nothing here is permanent.' : 'Access lasts only while the emergency order is in force. Every view is logged.'}</span>
      <Hint on={hint && ready && !done}>
        <button className={`btn ${audit ? 'btn-safe' : 'btn-primary'}`} disabled={!ready || done} onClick={click}>
          <Icon name={audit ? 'check' : 'shield'} size={16} /> {audit ? 'Close case' : done ? 'Access approved' : 'Approve read-only access'}
        </button>
      </Hint>
    </div>
  )
}
