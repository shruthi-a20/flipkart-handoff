// Lakshmi's phone: a resident reports the silent pump, gets an early warning, then hears it's fixed.
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Icon, Hint, PhoneShell, Logo, screen, rise } from './ui.jsx'
import { SITE } from './flow.js'

const VIEW = { report: 'report', identify: 'report', warn: 'warn', flowing: 'restored' }

export default function LakshmiPhone({ phase, go, hint }) {
  const view = VIEW[phase] || 'report'
  return (
    <PhoneShell head={<Head view={view} />}>
      <AnimatePresence>
        <motion.div key={view} {...screen} className="screen-body" style={{ position: 'absolute', inset: 0 }}>
          {view === 'report' && <Report go={go} hint={hint} />}
          {view === 'warn' && <Warn hint={hint} />}
          {view === 'restored' && <Restored />}
        </motion.div>
      </AnimatePresence>
    </PhoneShell>
  )
}

function Head({ view }) {
  return (
    <>
      <span className="row" style={{ gap: 8 }}><Logo size={24} /><span className="display" style={{ fontWeight: 800, fontSize: 16, color: 'var(--blue-900)' }}>Handoff</span></span>
      <span className={`chip ${view === 'warn' ? 'warn' : view === 'restored' ? 'good' : 'blue'}`}>{view === 'warn' ? 'Alert' : view === 'restored' ? 'Resolved' : 'Report'}</span>
    </>
  )
}

// A small drawing of the photo Lakshmi took: the pump house and its nameplate.
function PumpPhoto({ scan }) {
  return (
    <div style={{ position: 'relative', height: 108, borderRadius: 12, overflow: 'hidden', background: 'linear-gradient(180deg,#DCE8F2,#C9D6E1)' }}>
      <svg viewBox="0 0 240 108" width="100%" height="100%" preserveAspectRatio="xMidYMid slice">
        <rect x="0" y="86" width="240" height="22" fill="#B4C0CB" />
        <rect x="40" y="30" width="120" height="58" fill="#EEF1F4" stroke="#C3CCD5" />
        <rect x="36" y="25" width="128" height="7" fill="#CBD3DB" />
        <rect x="66" y="35" width="68" height="10" rx="2" fill="#20486E" />
        <text x="100" y="42.5" fontSize="6.4" fontWeight="800" fill="#fff" textAnchor="middle" fontFamily="Plus Jakarta Sans">PUMP STATION 4</text>
        <rect x="90" y="56" width="20" height="32" fill="#2A5F92" />
        <rect x="176" y="40" width="44" height="48" rx="3" fill="#D7E3EC" stroke="#9FAAB6" />
        <rect x="18" y="64" width="16" height="24" fill="#D6DCE2" />
        <circle cx="26" cy="61" r="3.2" fill="#D0524A" />
        <rect x="19" y="70" width="14" height="6" fill="#B9C2CB" />
      </svg>
      {scan && <motion.div initial={{ top: 0 }} animate={{ top: [0, 96, 0] }} transition={{ duration: 2.2, repeat: Infinity }} style={{ position: 'absolute', left: 0, right: 0, height: 3, background: 'rgba(60,130,196,.7)' }} />}
      <span className="chip neutral" style={{ position: 'absolute', left: 8, bottom: 8, background: 'rgba(255,255,255,.9)' }}><Icon name="camera" size={12} /> 2 photos</span>
    </div>
  )
}

function Report({ go, hint }) {
  return (
    <>
      <div>
        <div className="display" style={{ fontWeight: 800, fontSize: 18, letterSpacing: '-0.01em' }}>Report a silent system</div>
        <div style={{ fontSize: 12, color: 'var(--ink-3)', marginTop: 2 }}>No login needed · takes 30 seconds</div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
        {[['drop', 'Water', true], ['bolt', 'Power'], ['hospital', 'Health'], ['users', 'Person alone']].map(([ic, l, on]) => (
          <div key={l} className="row" style={{ gap: 7, padding: '8px 10px', borderRadius: 10, fontSize: 12.5, fontWeight: 600, background: on ? 'var(--blue-100)' : '#fff', color: on ? 'var(--blue-700)' : 'var(--ink-2)', boxShadow: `inset 0 0 0 1.5px ${on ? 'var(--blue)' : 'var(--line)'}` }}>
            <Icon name={ic} size={15} />{l}{on && <Icon name="check" size={13} stroke={3} style={{ marginLeft: 'auto' }} />}
          </div>
        ))}
      </div>
      <PumpPhoto />
      <div className="card" style={{ padding: 11, display: 'flex', flexDirection: 'column', gap: 6 }}>
        <div className="row" style={{ gap: 7, fontSize: 12, color: 'var(--ink-2)' }}><Icon name="pin" size={14} style={{ color: 'var(--blue)' }} />{SITE.name} Rd · {SITE.ward} <span className="chip neutral" style={{ marginLeft: 'auto', padding: '2px 6px' }}>GPS</span></div>
        <div style={{ fontSize: 12.5, color: 'var(--ink)', lineHeight: 1.4, background: 'var(--panel)', borderRadius: 8, padding: '7px 9px' }}>“Pump house silent since dawn. Red light blinking, nobody inside.”</div>
      </div>
      <div style={{ flex: 1 }} />
      <Hint on={hint} style={{ width: '100%' }}>
        <button className="btn btn-primary" style={{ width: '100%' }} onClick={() => go('signals')}><Icon name="send" size={16} /> Send report</button>
      </Hint>
    </>
  )
}

function Warn({ hint }) {
  const [ok, setOk] = useState(false)
  return (
    <>
      <motion.div {...rise(0)} className="row" style={{ gap: 7, background: '#2C3A47', color: '#fff', borderRadius: 12, padding: '8px 11px', fontSize: 11.5, fontWeight: 700 }}>
        <Icon name="wifi" size={15} /> Emergency alert · Cell Broadcast
        <span style={{ marginLeft: 'auto', fontSize: 10, opacity: 0.7, fontWeight: 600 }}>NDMA SACHET</span>
      </motion.div>
      <motion.div {...rise(0.08)} className="card" style={{ padding: 12, borderLeft: '4px solid var(--amber)' }}>
        <div className="row" style={{ gap: 8 }}>
          <span style={{ width: 30, height: 30, borderRadius: 9, background: 'var(--amber-100)', color: '#A86C0F', display: 'grid', placeItems: 'center' }}><Icon name="bell" size={17} /></span>
          <div style={{ flex: 1 }}>
            <div className="eyebrow" style={{ color: '#A86C0F' }}>Early warning · {SITE.ward}</div>
            <div style={{ fontSize: 11, color: 'var(--ink-3)' }}>District emergency ops · 09:04</div>
          </div>
        </div>
        <div className="display" style={{ fontWeight: 800, fontSize: 16, marginTop: 9, lineHeight: 1.25 }}>Water supply may stop in about 18 hours</div>
        <div style={{ fontSize: 12, color: 'var(--ink-2)', marginTop: 5, lineHeight: 1.45 }}>Pump Station 4 has no operator. Store drinking water now. Also sent in Tamil, by SMS and by loudspeaker.</div>
      </motion.div>
      <motion.div {...rise(0.18)} className="card" style={{ padding: 12 }}>
        <div className="eyebrow">What to do</div>
        {['Fill containers with drinking water', 'Check on elderly neighbours', 'Avoid motor pumps on your tank'].map((t) => (
          <div key={t} className="row" style={{ gap: 8, fontSize: 12.5, marginTop: 7, color: 'var(--ink)' }}><Icon name="check" size={14} stroke={2.6} style={{ color: 'var(--blue)' }} />{t}</div>
        ))}
      </motion.div>
      <motion.div {...rise(0.3)} className="row" style={{ gap: 8, background: 'var(--blue-50)', borderRadius: 12, padding: '9px 11px', fontSize: 12, color: 'var(--blue-800)' }}>
        <Icon name="info" size={15} /> Your report reached the control room.
      </motion.div>
      <div style={{ flex: 1 }} />
      <Hint on={hint && !ok} style={{ width: '100%' }}>
        <button className="btn btn-primary" style={{ width: '100%' }} onClick={() => setOk(true)}>{ok ? <><Icon name="check" size={15} stroke={3} /> Storing water</> : 'Okay, storing water'}</button>
      </Hint>
    </>
  )
}

function Restored() {
  return (
    <>
      <motion.div {...rise(0)} className="card" style={{ padding: 12, borderLeft: '4px solid var(--green)' }}>
        <div className="row" style={{ gap: 8 }}>
          <span style={{ width: 30, height: 30, borderRadius: 9, background: 'var(--green-100)', color: 'var(--green)', display: 'grid', placeItems: 'center' }}><Icon name="drop" size={17} /></span>
          <div style={{ flex: 1 }}>
            <div className="eyebrow" style={{ color: 'var(--green)' }}>Resolved · {SITE.ward}</div>
            <div style={{ fontSize: 11, color: 'var(--ink-3)' }}>Handoff · 15:10</div>
          </div>
        </div>
        <div className="display" style={{ fontWeight: 800, fontSize: 17, marginTop: 10 }}>Water is back, and safe to drink</div>
        <div style={{ fontSize: 12.5, color: 'var(--ink-2)', marginTop: 5, lineHeight: 1.45 }}>Pump Station 4 is running and the water is chlorinated. Your tap never ran dry: the tank was protected 20 minutes after your report.</div>
      </motion.div>
      <motion.div {...rise(0.2)} className="card" style={{ padding: 12 }}>
        <div className="eyebrow">Your report</div>
        {[['09:00', 'You reported the silent pump'], ['09:20', 'Made safe by the operator on site'], ['14:06', 'Pump restarted'], ['15:10', 'Safe water released']].map(([t, l], i) => (
          <div key={t} className="row" style={{ gap: 9, marginTop: 8 }}>
            <span className="dot" style={{ background: i === 3 ? 'var(--green)' : 'var(--blue)' }} />
            <span className="mono" style={{ fontSize: 11, color: 'var(--ink-3)', width: 36 }}>{t}</span>
            <span style={{ fontSize: 12.5 }}>{l}</span>
          </div>
        ))}
      </motion.div>
      <motion.div {...rise(0.35)} style={{ textAlign: 'center', fontSize: 13, fontWeight: 700, color: 'var(--blue-700)', marginTop: 4 }}>Thank you for reporting, Lakshmi.</motion.div>
    </>
  )
}
