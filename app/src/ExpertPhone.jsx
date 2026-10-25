// Suresh's phone: an operator at an identical station reviews the rebuilt procedure remotely.
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Icon, Hint, PhoneShell, ConfChip, rise } from './ui.jsx'

const STEPS = [
  ['Confirm outlet V2 is closed', 'verified'],
  ['Open inlet valve V1 half a turn', 'verified'],
  ['Prime the pump; wait ~2 min for pressure', 'inferred'],
  ['Start the motor from the panel', 'verified'],
  ['Max motor temperature', 'unknown'],
  ['Reopen V2 slowly over 5 minutes', 'inferred'],
]

export default function ExpertPhone({ go, hint, auto }) {
  const [filled, setFilled] = useState(false)
  const [approved, setApproved] = useState(false)
  useEffect(() => { if (!auto) return; const a = setTimeout(() => setFilled(true), 1500); const b = setTimeout(() => setApproved(true), 3200); return () => { clearTimeout(a); clearTimeout(b) } }, [auto])
  const approve = () => { setApproved(true); setTimeout(() => go('train'), 1200) }
  const conf = approved ? 91 : filled ? 78 : 62
  return (
    <PhoneShell headBg="var(--violet)" headInk="#fff" head={<>
      <span className="display" style={{ fontWeight: 800, fontSize: 16 }}>Handoff Expert</span>
      <span className="chip" style={{ background: 'rgba(255,255,255,.2)', color: '#fff' }}>Review request</span>
    </>}>
      <div className="screen-body" style={{ position: 'absolute', inset: 0 }}>
        <motion.div {...rise(0)} className="card" style={{ padding: 12 }}>
          <div className="row" style={{ gap: 10 }}>
            <span style={{ width: 34, height: 34, borderRadius: 10, background: 'var(--violet-100)', color: 'var(--violet)', display: 'grid', placeItems: 'center' }}><Icon name="pump" size={18} /></span>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 800, fontSize: 13.5 }}>Pump Station 4 needs your eyes</div>
              <div style={{ fontSize: 11.5, color: 'var(--ink-3)' }}>Same model you run · VT-150 · from Ravi K.</div>
            </div>
          </div>
        </motion.div>
        <div className="card" style={{ padding: '7px 12px' }}>
          {STEPS.map(([t, c], i) => {
            const cc = approved && c === 'inferred' ? 'verified' : i === 4 && filled ? 'verified' : c
            return (
              <div key={t} className="row" style={{ gap: 8, padding: '5px 0', borderBottom: i < 5 ? '1px solid var(--line-2)' : 0 }}>
                <span className="mono" style={{ fontSize: 10.5, color: 'var(--ink-3)', width: 12 }}>{i + 1}</span>
                <span style={{ fontSize: 12, flex: 1 }}>{t}{i === 4 && (filled ? <b>: 70 °C</b> : ': ?')}</span>
                {i === 4 && !filled ? (
                  <Hint on={hint} radius={8}><button className="btn btn-line" style={{ minHeight: 26, padding: '0 8px', fontSize: 11.5, borderRadius: 8 }} onClick={() => setFilled(true)}><Icon name="pen" size={12} /> Add 70 °C</button></Hint>
                ) : <ConfChip c={cc} />}
              </div>
            )
          })}
        </div>
        <div className="card" style={{ padding: 11 }}>
          <div className="row" style={{ gap: 8 }}>
            <span style={{ fontSize: 11.5, color: 'var(--ink-3)' }}>Confidence</span>
            <div className="bar" style={{ flex: 1 }}><motion.span animate={{ width: `${conf}%`, background: conf > 85 ? '#2E9A6A' : '#D69A2D' }} style={{ display: 'block' }} /></div>
            <span className="mono" style={{ fontSize: 12, fontWeight: 700, color: conf > 85 ? 'var(--green)' : '#A86C0F' }}>{conf}%</span>
          </div>
          <div style={{ fontSize: 11.5, color: 'var(--ink-2)', marginTop: 7, lineHeight: 1.4 }}>
            {approved ? 'Approved. Steps 3 and 6 match how you run your station.' : 'Approving also confirms the inferred steps 3 and 6.'}
          </div>
        </div>
        <div style={{ flex: 1 }} />
        <Hint on={hint && filled && !approved} style={{ width: '100%' }}>
          <button className="btn" style={{ width: '100%', background: 'var(--violet)', color: '#fff' }} disabled={!filled || approved} onClick={approve}>
            <Icon name="check" size={16} stroke={2.6} /> {approved ? 'Approved' : 'Approve procedure'}
          </button>
        </Hint>
      </div>
    </PhoneShell>
  )
}
