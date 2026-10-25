// Ravi's phone: the junior operator left alone inherits the pump. Each phase maps to one screen.
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Icon, Hint, PhoneShell, Logo, ConfChip, Spark, screen, rise } from './ui.jsx'
import { SITE } from './flow.js'

const VIEW = { onsite: 'onsite', stabilize: 'stabilize', rebuild: 'rebuild', train: 'train', authorize: 'waiting', restart: 'restart', flowing: 'running' }

// Run fn after ms (used by autoplay to press the in-screen steps).
function useLater(fn, ms, on) {
  useEffect(() => { if (!on) return; const t = setTimeout(fn, ms); return () => clearTimeout(t) }, [on])
}

export default function RaviPhone({ phase, go, hint, auto }) {
  const view = VIEW[phase] || 'onsite'
  return (
    <PhoneShell head={<Head phase={phase} />}>
      <AnimatePresence>
        <motion.div key={view} {...screen} className="screen-body" style={{ position: 'absolute', inset: 0 }}>
          {view === 'onsite' && <OnSite go={go} hint={hint} auto={auto} />}
          {view === 'stabilize' && <Stabilize go={go} hint={hint} auto={auto} />}
          {view === 'rebuild' && <Rebuild go={go} hint={hint} auto={auto} />}
          {view === 'train' && <Train go={go} hint={hint} auto={auto} />}
          {view === 'waiting' && <Waiting />}
          {view === 'restart' && <Restart go={go} hint={hint} />}
          {view === 'running' && <Running go={go} hint={hint} />}
        </motion.div>
      </AnimatePresence>
    </PhoneShell>
  )
}

function Head({ phase }) {
  const authorized = ['restart', 'flowing'].includes(phase)
  return (
    <>
      <span className="row" style={{ gap: 8 }}><Logo size={24} /><span className="display" style={{ fontWeight: 800, fontSize: 16, color: 'var(--blue-900)' }}>Handoff</span></span>
      {authorized ? <span className="chip good"><Icon name="shield" size={12} /> Authorized · 24 h</span> : <span className="chip blue">{SITE.name}</span>}
    </>
  )
}

function OnSite({ go, hint, auto }) {
  const [state, setState] = useState('idle')
  const verify = () => { if (state !== 'idle') return; setState('checking'); setTimeout(() => setState('done'), 900); setTimeout(() => go('stabilize'), 2000) }
  useLater(verify, 1600, auto)
  return (
    <>
      <div className="card" style={{ padding: 12 }}>
        <div className="row" style={{ gap: 10 }}>
          <span style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--red-100)', color: 'var(--red)', display: 'grid', placeItems: 'center' }}><Icon name="pump" size={19} /></span>
          <div style={{ flex: 1 }}>
            <div className="display" style={{ fontWeight: 800, fontSize: 15 }}>You’re at {SITE.name}</div>
            <div style={{ fontSize: 11.5, color: 'var(--ink-3)' }}>Case {SITE.caseId} · Priority 1 · no operator</div>
          </div>
        </div>
        <div style={{ fontSize: 12.5, color: 'var(--ink-2)', marginTop: 9, lineHeight: 1.45 }}>This station has lost its senior operators. Handoff will guide you, one safe step at a time.</div>
      </div>
      <div className="card" style={{ padding: 12 }}>
        <div className="row" style={{ justifyContent: 'space-between' }}><span className="eyebrow">Found in Metrowater HRMS</span><span className="chip neutral" style={{ padding: '2px 6px' }}>shared 09:08</span></div>
        <div className="row" style={{ gap: 10, marginTop: 8 }}>
          <span style={{ width: 34, height: 34, borderRadius: '50%', background: 'var(--blue)', color: '#fff', display: 'grid', placeItems: 'center', fontWeight: 800, fontSize: 12, fontFamily: 'var(--display)' }}>RK</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, fontSize: 13.5 }}>Ravi K.</div>
            <div style={{ fontSize: 11.5, color: 'var(--ink-3)' }}>Junior operator · 2 years at PS4</div>
          </div>
        </div>
        <div className="eyebrow" style={{ marginTop: 12 }}>Aadhaar OTP sent to +91 98•••• 4410</div>
        <div className="row" style={{ gap: 8, marginTop: 7 }}>
          {['4', '8', '2', '1'].map((d, i) => (
            <motion.span key={i} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0, transition: { delay: 0.5 + i * 0.15 } }}
              className="mono" style={{ flex: 1, height: 40, borderRadius: 10, display: 'grid', placeItems: 'center', fontSize: 18, fontWeight: 700, background: 'var(--panel)', boxShadow: 'inset 0 0 0 1.5px var(--line)' }}>{d}</motion.span>
          ))}
        </div>
      </div>
      <AnimatePresence>
        {state === 'done' && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="row" style={{ gap: 8, background: 'var(--green-100)', color: '#1E6E4A', borderRadius: 12, padding: '10px 12px', fontSize: 13, fontWeight: 700 }}>
            <Icon name="shield" size={16} /> Verified as PS4 staff. Loading your Stabilize Card…
          </motion.div>
        )}
      </AnimatePresence>
      <div style={{ flex: 1 }} />
      <Hint on={hint && state === 'idle'} style={{ width: '100%' }}>
        <button className="btn btn-primary" style={{ width: '100%' }} onClick={verify} disabled={state !== 'idle'}>{state === 'checking' ? 'Checking with Aadhaar…' : 'Verify with Aadhaar OTP'}</button>
      </Hint>
    </>
  )
}

function Stabilize({ go, hint, auto }) {
  const [done, setDone] = useState(false)
  const [confirmed, setConfirmed] = useState(false)
  const finish = () => { if (done) return; setDone(true); setTimeout(() => setConfirmed(true), 1600) }
  useLater(finish, 1200, auto)
  return (
    <>
      <div className="row" style={{ justifyContent: 'space-between', background: 'var(--amber-100)', borderRadius: 12, padding: '8px 11px' }}>
        <span className="row" style={{ gap: 6, fontSize: 12, fontWeight: 700, color: '#8A5A0E' }}><Icon name="clock" size={15} /> Water left</span>
        <span className="mono" style={{ fontWeight: 700, fontSize: 15, color: confirmed ? 'var(--green)' : '#8A5A0E' }}>{confirmed ? 'Holding' : '17h 40m'}</span>
      </div>
      <div>
        <span className="chip warn">STABILIZE · T1 · anyone can do this</span>
        <div className="display" style={{ fontWeight: 800, fontSize: 17, marginTop: 7 }}>Make the station safe</div>
        <div style={{ fontSize: 12, color: 'var(--ink-3)', marginTop: 1 }}>Safe, reversible steps. Nothing is restarted.</div>
      </div>
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <StepRow n={1} done={done} title="Close outlet valve V2" sub="Red wheel on the pipe to the tank. Turn clockwise until it stops.">
          {!done && <Hint on={hint} radius={10}><button className="btn btn-primary" style={{ minHeight: 32, padding: '0 12px', fontSize: 12.5 }} onClick={finish}>Done</button></Hint>}
        </StepRow>
        <StepRow n={2} done={confirmed} title="Check the tank level stops falling" sub={confirmed ? 'Confirmed by the tank’s level sensor' : done ? 'Machine Check is reading the sensor…' : 'Handoff checks this for you'} />
        <StepRow n={3} done title="Don’t touch the electrical panel" sub="Restarting needs a higher tier" last />
      </div>
      <AnimatePresence>
        {done && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="card" style={{ padding: 11, display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ flex: 1 }}>
              <div className="eyebrow">Machine Check · tank level</div>
              <div style={{ fontSize: 12.5, fontWeight: 700, color: confirmed ? 'var(--green)' : 'var(--ink-2)', marginTop: 2 }}>{confirmed ? '53% · steady' : 'Reading…'}</div>
            </div>
            <Spark pts={[62, 60, 58, 56, 54, 53, 53, 53, 53]} color={confirmed ? 'var(--green)' : 'var(--amber)'} w={96} h={30} />
          </motion.div>
        )}
      </AnimatePresence>
      <div style={{ flex: 1 }} />
      <Hint on={hint && confirmed} style={{ width: '100%' }}>
        <button className="btn btn-safe" style={{ width: '100%' }} disabled={!confirmed} onClick={() => go('rebuild')}><Icon name="shield" size={16} /> Mark system safe</button>
      </Hint>
    </>
  )
}

function StepRow({ n, done, title, sub, children, last }) {
  return (
    <div className="row" style={{ gap: 10, padding: '10px 12px', borderBottom: last ? 0 : '1px solid var(--line-2)', alignItems: 'flex-start' }}>
      <span style={{ width: 22, height: 22, borderRadius: '50%', flex: 'none', display: 'grid', placeItems: 'center', fontSize: 11, fontWeight: 800, background: done ? 'var(--green)' : 'var(--blue-100)', color: done ? '#fff' : 'var(--blue-700)', marginTop: 1 }}>
        {done ? <Icon name="check" size={13} stroke={3} /> : n}
      </span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--ink)' }}>{title}</div>
        <div style={{ fontSize: 11.5, color: 'var(--ink-3)', marginTop: 1, lineHeight: 1.35 }}>{sub}</div>
      </div>
      {children}
    </div>
  )
}

const DRAFT = [
  ['Confirm outlet V2 is closed', 'verified'],
  ['Open inlet valve V1 half a turn', 'verified'],
  ['Prime the pump; wait ~2 min for pressure', 'inferred'],
  ['Start the motor from the panel', 'verified'],
  ['Max motor temperature', 'unknown'],
  ['Reopen V2 slowly over 5 minutes', 'inferred'],
]

function Rebuild({ go, hint, auto }) {
  const [scanned, setScanned] = useState(false)
  useLater(() => setScanned(true), 1800, auto)
  const sources = [['doc', 'Manufacturer manual', 'document store'], ['grid', 'SAP PM', '14 work orders'], ['gauge', 'SCADA history', '90 days']]
  return (
    <>
      <div>
        <span className="chip violet">REBUILDING KNOW-HOW</span>
        <div className="display" style={{ fontWeight: 800, fontSize: 16.5, marginTop: 7 }}>Restart procedure for PS4</div>
      </div>
      <div className="card" style={{ padding: '6px 12px' }}>
        {sources.map(([ic, l, s], i) => (
          <motion.div key={l} {...rise(0.1 + i * 0.12)} className="row" style={{ gap: 9, padding: '6px 0', borderBottom: '1px solid var(--line-2)' }}>
            <Icon name={ic} size={15} style={{ color: 'var(--violet)' }} />
            <span style={{ fontSize: 12.5, fontWeight: 600, flex: 1 }}>{l}<span style={{ color: 'var(--ink-3)', fontWeight: 500 }}> · {s}</span></span>
            <Icon name="check" size={14} stroke={3} style={{ color: 'var(--green)' }} />
          </motion.div>
        ))}
        <div className="row" style={{ gap: 9, padding: '7px 0 4px' }}>
          <Icon name="book" size={15} style={{ color: scanned ? 'var(--violet)' : 'var(--amber)' }} />
          <span style={{ fontSize: 12.5, fontWeight: 600, flex: 1 }}>Station logbook{!scanned && <span style={{ color: '#A86C0F', fontWeight: 600 }}> · missing</span>}{scanned && <span style={{ color: 'var(--ink-3)', fontWeight: 500 }}> · p. 112 scanned</span>}</span>
          {scanned && <Icon name="check" size={14} stroke={3} style={{ color: 'var(--green)' }} />}
        </div>
        {!scanned && (
          <Hint on={hint} radius={10} style={{ margin: '2px 0 6px' }}>
            <button className="btn btn-line" style={{ width: '100%', minHeight: 34, fontSize: 12.5 }} onClick={() => setScanned(true)}><Icon name="camera" size={14} /> Scan logbook page</button>
          </Hint>
        )}
      </div>
      <AnimatePresence>
        {scanned && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="card" style={{ padding: '8px 12px' }}>
            {DRAFT.map(([t, c], i) => (
              <motion.div key={t} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0, transition: { delay: 0.1 + i * 0.1 } }} className="row" style={{ gap: 8, padding: '3.5px 0' }}>
                <span className="mono" style={{ fontSize: 10.5, color: 'var(--ink-3)', width: 12 }}>{i + 1}</span>
                <span style={{ fontSize: 12, flex: 1, color: 'var(--ink)' }}>{t}{c === 'unknown' && ': ?'}</span>
                <ConfChip c={c} />
              </motion.div>
            ))}
            <div className="row" style={{ gap: 8, marginTop: 7 }}>
              <span style={{ fontSize: 11, color: 'var(--ink-3)' }}>Confidence</span>
              <div className="bar" style={{ flex: 1 }}><motion.span initial={{ width: 0 }} animate={{ width: '62%' }} transition={{ delay: 0.8, duration: 0.8 }} style={{ background: 'var(--amber)' }} /></div>
              <span className="mono" style={{ fontSize: 11.5, fontWeight: 700, color: '#A86C0F' }}>62%</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <div style={{ flex: 1 }} />
      <Hint on={hint && scanned} style={{ width: '100%' }}>
        <button className="btn btn-primary" style={{ width: '100%' }} disabled={!scanned} onClick={() => go('validate')}><Icon name="send" size={15} /> Send for expert review</button>
      </Hint>
    </>
  )
}

function Train({ go, hint, auto }) {
  const [pick, setPick] = useState(null)
  const answer = (k) => { if (pick === 'v1') return; setPick(k); if (k === 'v1') setTimeout(() => go('authorize'), 1400) }
  useLater(() => answer('v1'), 2000, auto)
  const tiers = [['T1', 'Stabilize'], ['T2', 'Guided'], ['T3', 'Skilled'], ['T4', 'Licensed']]
  return (
    <>
      <div className="card" style={{ padding: 12 }}>
        <div className="eyebrow">Your task · restart the pump</div>
        <div className="row" style={{ gap: 5, marginTop: 8 }}>
          {tiers.map(([t, l]) => (
            <div key={t} style={{ flex: 1, textAlign: 'center', padding: '6px 0', borderRadius: 9, background: t === 'T2' ? 'var(--blue)' : 'var(--panel)', color: t === 'T2' ? '#fff' : 'var(--ink-3)' }}>
              <div className="mono" style={{ fontSize: 12, fontWeight: 700 }}>{t}</div>
              <div style={{ fontSize: 10, fontWeight: 600 }}>{l}</div>
            </div>
          ))}
        </div>
        <div style={{ fontSize: 12, color: 'var(--ink-2)', marginTop: 8, lineHeight: 1.4 }}>Guided operation: a short clip and one safety question, then a human approves you.</div>
      </div>
      <div className="row" style={{ gap: 10, background: '#2C3A47', borderRadius: 12, padding: 10, color: '#fff' }}>
        <span style={{ width: 44, height: 34, borderRadius: 8, background: 'rgba(255,255,255,.12)', display: 'grid', placeItems: 'center' }}><Icon name="play" size={14} /></span>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 12.5, fontWeight: 700 }}>Safe restart · VT-150</div>
          <div style={{ fontSize: 11, opacity: 0.7 }}>90 s · recorded by Suresh M.</div>
        </div>
        <span className="chip good" style={{ padding: '3px 7px' }}>Watched</span>
      </div>
      <div className="card" style={{ padding: 12 }}>
        <div style={{ fontSize: 13, fontWeight: 700, lineHeight: 1.35 }}>Before starting the pump, which valve must be open?</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 9 }}>
          {[['v2', 'Outlet valve V2'], ['v1', 'Inlet valve V1'], ['none', 'Neither, start it dry']].map(([k, l]) => {
            const cls = pick === k ? (k === 'v1' ? 'on' : 'no') : ''
            const btn = <button className={`option ${cls}`} onClick={() => answer(k)} style={{ minHeight: 38 }}>{l}{pick === k && <Icon name={k === 'v1' ? 'check' : 'x'} size={15} stroke={3} style={{ marginLeft: 'auto' }} />}</button>
            return k === 'v1' ? <Hint key={k} on={hint && pick !== 'v1'} radius={12}>{btn}</Hint> : <div key={k}>{btn}</div>
          })}
        </div>
        {pick && pick !== 'v1' && <div style={{ fontSize: 11.5, color: '#A3332C', marginTop: 7 }}>Not quite. Starting with the outlet open can damage the pump. Try again.</div>}
        {pick === 'v1' && <div style={{ fontSize: 12, color: '#1E6E4A', marginTop: 7, fontWeight: 700 }}>Correct. Requesting authority…</div>}
      </div>
    </>
  )
}

function Waiting() {
  return (
    <>
      <div style={{ textAlign: 'center', marginTop: 18 }}>
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1.6, repeat: Infinity, ease: 'linear' }} style={{ width: 46, height: 46, margin: '0 auto', borderRadius: '50%', border: '4px solid var(--blue-100)', borderTopColor: 'var(--blue)' }} />
        <div className="display" style={{ fontWeight: 800, fontSize: 16.5, marginTop: 14 }}>Waiting for authority</div>
        <div style={{ fontSize: 12.5, color: 'var(--ink-3)', marginTop: 4, padding: '0 10px' }}>A district officer reviews your request. AI can guide you, but only a person can approve you.</div>
      </div>
      <div className="card" style={{ padding: 12, marginTop: 6 }}>
        {[['ID matched to staff records'], ['Safety quiz passed · 11:42'], ['Procedure verified by an expert · 91%']].map(([t]) => (
          <div key={t} className="row" style={{ gap: 8, fontSize: 12.5, padding: '5px 0' }}><Icon name="check" size={14} stroke={3} style={{ color: 'var(--green)' }} />{t}</div>
        ))}
      </div>
    </>
  )
}

const CHECKS = [
  ['Outlet V2 closed', 'valve sensor', 'Closed'],
  ['Open inlet V1 half a turn', 'inlet pressure', '1.2 bar'],
  ['Prime, wait for pressure', 'casing pressure', '2.1 bar'],
]

function Restart({ go, hint }) {
  const [n, setN] = useState(0)
  useEffect(() => { const ts = [700, 1700, 2700, 3700].map((ms, i) => setTimeout(() => setN(i + 1), ms)); return () => ts.forEach(clearTimeout) }, [])
  const ready = n >= 4
  return (
    <>
      <div style={{ position: 'relative', height: 132, borderRadius: 14, overflow: 'hidden', background: '#26323E' }}>
        <svg viewBox="0 0 260 132" width="100%" height="100%">
          <rect x="70" y="10" width="120" height="96" rx="6" fill="#D6DCE2" />
          <rect x="90" y="20" width="80" height="30" rx="3" fill="#2C3A47" />
          <text x="130" y="39" fontSize="11" fill="#9CC4E6" textAnchor="middle" fontFamily="JetBrains Mono">{ready ? 'READY' : `CHK ${Math.min(n + 1, 3)}/3`}</text>
          {[100, 130, 160].map((x, i) => <circle key={x} cx={x} cy="68" r="8" fill={i === 1 ? '#3C82C4' : '#5C6B79'} />)}
          <rect x="95" y="84" width="70" height="8" rx="2" fill="#B9C2CB" />
          <circle cx="182" cy="18" r="5" fill={ready ? '#38A673' : '#E0A23A'} />
        </svg>
        <motion.div animate={{ opacity: [1, 0.4, 1] }} transition={{ duration: 1.2, repeat: Infinity }}
          style={{ position: 'absolute', left: 116, top: 50, width: 40, height: 30, borderRadius: 8, border: '2.5px solid #F0A73A' }} />
        <span className="chip" style={{ position: 'absolute', left: 8, top: 8, background: 'rgba(0,0,0,.45)', color: '#fff' }}><Icon name="camera" size={12} /> Live guide</span>
        <span style={{ position: 'absolute', left: 0, right: 0, bottom: 0, padding: '18px 10px 7px', fontSize: 12, fontWeight: 700, color: '#fff', background: 'linear-gradient(180deg, rgba(20,30,40,0), rgba(20,30,40,.9) 55%)' }}>{ready ? 'All checks passed. Press the blue START button.' : 'Follow each step. Sensors confirm it.'}</span>
      </div>
      <div className="card" style={{ padding: '6px 12px' }}>
        {CHECKS.map(([t, s, v], i) => (
          <div key={t} className="row" style={{ gap: 8, padding: '5px 0', borderBottom: '1px solid var(--line-2)', opacity: n >= i ? 1 : 0.45 }}>
            <span style={{ width: 18, height: 18, borderRadius: '50%', display: 'grid', placeItems: 'center', background: n > i ? 'var(--green)' : 'var(--blue-100)', color: n > i ? '#fff' : 'var(--blue-700)', fontSize: 10, fontWeight: 800 }}>{n > i ? <Icon name="check" size={11} stroke={3.4} /> : i + 1}</span>
            <span style={{ fontSize: 12, flex: 1 }}>{t}</span>
            <span className="mono" style={{ fontSize: 10.5, color: n > i ? 'var(--green)' : 'var(--ink-3)' }}>{n > i ? `${v} ✓` : s}</span>
          </div>
        ))}
        <div className="row" style={{ gap: 6, padding: '5px 0 2px', fontSize: 10.5, color: 'var(--ink-3)' }}><Icon name="gauge" size={12} /> Machine Check unlocks each step from live sensors</div>
      </div>
      <AnimatePresence>
        {n >= 3 && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} style={{ background: 'var(--amber-100)', borderRadius: 12, padding: '8px 11px' }}>
            <div className="row" style={{ gap: 6, fontSize: 12, fontWeight: 800, color: '#8A5A0E' }}><Icon name="warn" size={14} /> Cascade check</div>
            <div style={{ fontSize: 11.5, color: '#6E4A0E', marginTop: 3, lineHeight: 1.4 }}>Starting the pump draws 18 kW from Feeder 3, which also powers the hospital. Load after start: 64%. <b>Safe.</b></div>
          </motion.div>
        )}
      </AnimatePresence>
      <div style={{ flex: 1 }} />
      <Hint on={hint && ready} style={{ width: '100%' }}>
        <button className="btn btn-blue" style={{ width: '100%' }} disabled={!ready} onClick={() => go('chlorine')}><Icon name="bolt" size={16} /> Start pump</button>
      </Hint>
    </>
  )
}

function Running({ go, hint }) {
  const tiles = [['Flow', '210 m³/h'], ['Chlorine', '0.5 mg/L'], ['Motor', '52 °C / 70']]
  return (
    <>
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} style={{ textAlign: 'center', padding: '6px 0 2px' }}>
        <div style={{ width: 54, height: 54, borderRadius: '50%', margin: '0 auto', background: 'var(--green-100)', color: 'var(--green)', display: 'grid', placeItems: 'center' }}><Icon name="check" size={28} stroke={3} /></div>
        <div className="display" style={{ fontWeight: 800, fontSize: 18, marginTop: 8 }}>Pump running</div>
        <div style={{ fontSize: 12.5, color: 'var(--ink-3)' }}>Safe supply to Ward 34 · 15:10</div>
      </motion.div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 6 }}>
        {tiles.map(([l, v], i) => (
          <motion.div key={l} {...rise(0.15 + i * 0.1)} className="card" style={{ padding: '9px 8px', textAlign: 'center' }}>
            <div style={{ fontSize: 10.5, color: 'var(--ink-3)' }}>{l}</div>
            <div className="mono" style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--green)', marginTop: 2 }}>{v}</div>
          </motion.div>
        ))}
      </div>
      <div className="card" style={{ padding: 11, display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ flex: 1 }}>
          <div className="eyebrow">Tank level</div>
          <div style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--blue-700)' }}>Refilling · 53% → 70%</div>
        </div>
        <Spark pts={[53, 53, 54, 56, 59, 62, 66, 70]} color="var(--blue)" w={96} h={30} />
      </div>
      <div style={{ fontSize: 12, color: 'var(--ink-2)', background: 'var(--blue-50)', borderRadius: 12, padding: '9px 11px', lineHeight: 1.4 }}>
        Your run verified this procedure for every station with the same pump. Next: train a backup.
      </div>
      <div style={{ flex: 1 }} />
      <Hint on={hint} style={{ width: '100%' }}>
        <button className="btn btn-primary" style={{ width: '100%' }} onClick={() => go('backup')}>Close task</button>
      </Hint>
    </>
  )
}
