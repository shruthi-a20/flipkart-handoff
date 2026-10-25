// Priya's phone: a retired water chemist found through e-Shram and DigiLocker takes a licensed (T4) task.
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Icon, Hint, PhoneShell, Logo, Spark, screen, rise } from './ui.jsx'

export default function PriyaPhone({ phase, go, hint, auto }) {
  const view = phase === 'dose' ? 'dose' : 'request'
  return (
    <PhoneShell head={<>
      <span className="row" style={{ gap: 8 }}><Logo size={24} /><span className="display" style={{ fontWeight: 800, fontSize: 16, color: 'var(--blue-900)' }}>Handoff</span></span>
      {view === 'dose' ? <span className="chip good"><Icon name="shield" size={12} /> Licensed · 22:00</span> : <span className="chip violet">Volunteer</span>}
    </>}>
      <AnimatePresence>
        <motion.div key={view} {...screen} className="screen-body" style={{ position: 'absolute', inset: 0, gap: 9 }}>
          {view === 'request' ? <Request /> : <Dose go={go} hint={hint} auto={auto} />}
        </motion.div>
      </AnimatePresence>
    </PhoneShell>
  )
}

function Request() {
  return (
    <>
      <motion.div {...rise(0)} className="card" style={{ padding: 12, borderLeft: '4px solid #8A5BA8' }}>
        <div className="eyebrow" style={{ color: '#6E4690' }}>Your skills are needed · 14:12</div>
        <div className="display" style={{ fontWeight: 800, fontSize: 15.5, marginTop: 6, lineHeight: 1.25 }}>Ward 34 needs a water chemist to chlorinate its supply</div>
        <div style={{ fontSize: 11.5, color: 'var(--ink-2)', marginTop: 5, lineHeight: 1.4 }}>40,000 people · about 40 minutes · Pump Station 4, 2.1 km away</div>
      </motion.div>
      <motion.div {...rise(0.1)} className="card" style={{ padding: '8px 12px' }}>
        <div className="eyebrow">Why you</div>
        {[['users', 'e-Shram', 'water treatment, 31 years'], ['doc', 'DigiLocker', 'TWAD water analyst licence'], ['user', 'Aadhaar', 'identity matched']].map(([ic, s, t]) => (
          <div key={s} className="row" style={{ gap: 8, marginTop: 6 }}>
            <Icon name={ic} size={14} style={{ color: '#8A5BA8' }} />
            <span style={{ fontSize: 12, flex: 1 }}><b>{s}</b> · {t}</span>
          </div>
        ))}
      </motion.div>
      <motion.div {...rise(0.2)} className="row" style={{ gap: 8, background: 'var(--green-100)', color: '#1E6E4A', borderRadius: 12, padding: '9px 11px', fontSize: 12.5, fontWeight: 700 }}>
        <Icon name="check" size={15} stroke={3} /> You accepted · 14:14
      </motion.div>
      <motion.div {...rise(0.3)} className="card" style={{ padding: 12, textAlign: 'center' }}>
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1.6, repeat: Infinity, ease: 'linear' }} style={{ width: 34, height: 34, margin: '0 auto', borderRadius: '50%', border: '4px solid var(--violet-100)', borderTopColor: '#8A5BA8' }} />
        <div style={{ fontSize: 12.5, fontWeight: 800, marginTop: 9 }}>Your licence lapsed in 2024</div>
        <div style={{ fontSize: 11.5, color: 'var(--ink-3)', marginTop: 3, lineHeight: 1.4 }}>Waiting for a temporary emergency licence. It needs two approvers.</div>
      </motion.div>
    </>
  )
}

const CL = [0.0, 0.0, 0.05, 0.12, 0.2, 0.31, 0.42, 0.5]

function Dose({ go, hint, auto }) {
  const [k, setK] = useState(0)
  useEffect(() => { const ts = CL.map((_, i) => setTimeout(() => setK(i), 400 + i * 480)); return () => ts.forEach(clearTimeout) }, [])
  const v = CL[k], safe = v >= 0.2
  const steps = [
    ['Check the leak sensor', 'chlorine gas 0 ppm', true],
    ['Set dose to 2.0 mg/L', 'from dosing logs · confirmed by you', true],
    ['Wait for residual ≥ 0.2 mg/L', 'at the tank outlet', safe],
  ]
  return (
    <>
      <div>
        <span className="chip violet">T4 · LICENSED · SUPERVISED</span>
        <div className="display" style={{ fontWeight: 800, fontSize: 16.5, marginTop: 7 }}>Chlorinate before release</div>
      </div>
      <div className="card" style={{ padding: '4px 12px' }}>
        {steps.map(([t, s, d], i) => (
          <div key={t} className="row" style={{ gap: 9, padding: '7px 0', borderBottom: i < 2 ? '1px solid var(--line-2)' : 0, alignItems: 'flex-start' }}>
            <span style={{ width: 20, height: 20, flex: 'none', borderRadius: '50%', display: 'grid', placeItems: 'center', background: d ? 'var(--green)' : 'var(--blue-100)', color: d ? '#fff' : 'var(--blue-700)', fontSize: 10, fontWeight: 800, marginTop: 1 }}>{d ? <Icon name="check" size={11} stroke={3.4} /> : i + 1}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12.5, fontWeight: 700 }}>{t}</div>
              <div style={{ fontSize: 10.5, color: 'var(--ink-3)' }}>{s}</div>
            </div>
          </div>
        ))}
      </div>
      <div className="card" style={{ padding: 12 }}>
        <div className="row" style={{ justifyContent: 'space-between' }}>
          <span className="eyebrow">Machine Check · residual chlorine</span>
        </div>
        <div className="row" style={{ gap: 10, marginTop: 6, alignItems: 'flex-end' }}>
          <span className="mono" style={{ fontSize: 26, fontWeight: 700, color: safe ? 'var(--green)' : '#A86C0F', lineHeight: 1 }}>{v.toFixed(2)}</span>
          <span style={{ fontSize: 11.5, color: 'var(--ink-3)', paddingBottom: 2 }}>mg/L</span>
          <span style={{ flex: 1 }} />
          <Spark pts={CL.slice(0, Math.max(2, k + 1))} color={safe ? 'var(--green)' : 'var(--amber)'} w={92} h={30} />
        </div>
        <div style={{ fontSize: 11, color: safe ? '#1E6E4A' : 'var(--ink-3)', marginTop: 6, fontWeight: safe ? 700 : 500 }}>{safe ? 'Safe range 0.2–1.0 mg/L reached' : 'Supply to homes stays held until 0.2'}</div>
      </div>
      <div className="row" style={{ gap: 8, fontSize: 11, color: 'var(--ink-2)', background: 'var(--blue-50)', borderRadius: 12, padding: '8px 10px' }}>
        <Icon name="video" size={14} style={{ color: 'var(--blue)' }} /> State water lab watching on video
      </div>
      <div style={{ flex: 1 }} />
      <Hint on={hint && safe} style={{ width: '100%' }}>
        <button className="btn btn-safe" style={{ width: '100%' }} disabled={!safe} onClick={() => go('flowing')}><Icon name="drop" size={16} /> Release supply to homes</button>
      </Hint>
    </>
  )
}
