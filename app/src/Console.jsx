// District emergency operations console: Priority Board on the left, the open case on the right,
// and the one primary action bottom-right.
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Icon, Hint, Logo, rise } from './ui.jsx'
import { SITE, after } from './flow.js'

export default function Console({ phase, go, hint }) {
  return (
    <div style={{ width: '100%', height: '100%', background: 'var(--panel)', borderRadius: 24, overflow: 'hidden', display: 'flex', flexDirection: 'column', boxShadow: 'inset 0 0 0 1px var(--line)' }}>
      <div style={{ height: 52, flex: 'none', display: 'flex', alignItems: 'center', gap: 12, padding: '0 18px', background: 'var(--blue-900)', color: '#fff' }}>
        <Logo size={26} mono />
        <span className="display" style={{ fontWeight: 700, fontSize: 14 }}>District Emergency Operations · Chennai</span>
        <span style={{ flex: 1 }} />
        <span className="row" style={{ gap: 6, fontSize: 11.5, opacity: 0.8 }}><motion.span className="dot" animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1.4, repeat: Infinity }} style={{ background: '#7FD3A8' }} /> Live</span>
        <span className="mono" style={{ fontSize: 11.5, opacity: 0.75 }}>23 open cases · 8 essential functions</span>
      </div>
      <div style={{ flex: 1, display: 'flex', minHeight: 0 }}>
        <Board phase={phase} />
        <div style={{ flex: 1, minWidth: 0, background: '#fff', position: 'relative' }}>
          <AnimatePresence mode="wait">
            <motion.div key={phase} initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} transition={{ duration: 0.25 }}
              style={{ position: 'absolute', inset: 0, padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
              {phase === 'signals' && <Signals />}
              {phase === 'identify' && <Identify />}
              {phase === 'chlorine' && <Chlorine />}
              {phase === 'rank' && <Rank />}
              {phase === 'share' && <Share />}
              {phase === 'closed' && <Closed />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
      <ActionBar phase={phase} go={go} hint={hint} />
    </div>
  )
}

/* ---------------- left: Priority Board ---------------- */

function Board({ phase }) {
  const ps4 = {
    signals: ['New', 'blue'], identify: ['Assessing…', 'neutral'], rank: ['17h 57m', 'bad'], chlorine: ['Held', 'warn'], share: ['Running', 'good'], closed: ['Resolved', 'good'],
  }[phase]
  const rows = [
    ['drop', 'Pump Station 4', 'Ward 34 · water', ps4, true],
    ['bolt', 'Substation W12', 'Ward 12 · power · 9,500', ['22h 10m', 'warn']],
    ['grid', 'Cold store, Koyambedu', 'Food · 1,200 t stock', ['31h', 'warn']],
    ['wifi', 'Telecom tower T-88', 'Telecom · 3 wards', ['40h', 'neutral']],
    ['users', 'Elderly resident alone', 'Ward 9 · care', ['Safe', 'good']],
  ]
  return (
    <div style={{ width: 300, flex: 'none', borderRight: '1px solid var(--line)', padding: '14px 12px', display: 'flex', flexDirection: 'column', gap: 6 }}>
      <div className="row" style={{ justifyContent: 'space-between', padding: '0 4px 4px' }}>
        <span className="eyebrow">Priority board</span>
        <span style={{ fontSize: 10.5, color: 'var(--ink-3)' }}>by time to harm</span>
      </div>
      {rows.map(([ic, t, s, st, me], i) => (
        <motion.div key={t} {...rise(i * 0.05)} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 10px', borderRadius: 12, background: me ? '#fff' : 'transparent', boxShadow: me ? `inset 0 0 0 1.5px ${st[1] === 'good' ? 'var(--green)' : 'var(--blue)'}, 0 6px 16px -12px rgba(24,52,79,.5)` : 'none' }}>
          <span className="mono" style={{ fontSize: 10.5, color: 'var(--ink-3)', width: 12 }}>{i + 1}</span>
          <span style={{ width: 28, height: 28, borderRadius: 8, background: me ? 'var(--blue-100)' : '#EDF1F5', color: me ? 'var(--blue-700)' : 'var(--ink-2)', display: 'grid', placeItems: 'center' }}><Icon name={ic} size={15} /></span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 12.5, fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{t}{me && ['signals', 'identify'].includes(phase) && <span className="chip blue" style={{ marginLeft: 6, padding: '1px 6px', fontSize: 9 }}>NEW</span>}</div>
            <div style={{ fontSize: 10.5, color: 'var(--ink-3)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{s}</div>
          </div>
          <span className={`chip ${st[1]}`} style={{ padding: '3px 7px' }}>{st[0]}</span>
        </motion.div>
      ))}
      <div style={{ flex: 1 }} />
      <div style={{ background: 'var(--blue-50)', borderRadius: 12, padding: '9px 11px', fontSize: 11.5, color: 'var(--blue-800)', lineHeight: 1.4 }}>
        Rank = time to harm × people affected × systems that depend on it.
      </div>
    </div>
  )
}

/* ---------------- right: the open case ---------------- */

function CaseHead({ status, tone }) {
  return (
    <div className="row" style={{ gap: 10 }}>
      <div style={{ flex: 1 }}>
        <div className="mono" style={{ fontSize: 11, color: 'var(--ink-3)' }}>Case {SITE.caseId} · {SITE.ward}</div>
        <div className="display" style={{ fontWeight: 800, fontSize: 19, letterSpacing: '-0.01em' }}>{SITE.name}</div>
      </div>
      <span className={`chip ${tone}`}>{status}</span>
    </div>
  )
}

function Identify() {
  const [n, setN] = useState(0)
  useEffect(() => { const ts = [500, 1300, 2100].map((ms, i) => setTimeout(() => setN(i + 1), ms)); return () => ts.forEach(clearTimeout) }, [])
  const lines = [
    ['pump', 'Equipment', 'VT-150 vertical turbine pump · read from nameplate'],
    ['users', 'Reported by', 'Resident · 09:00 · 2 photos + GPS'],
    ['library', 'Shared Library', '2 similar pumps elsewhere · 0 verified procedures'],
  ]
  return (
    <>
      <CaseHead status="New report" tone="blue" />
      <div className="row" style={{ gap: 14, alignItems: 'stretch' }}>
        <div style={{ position: 'relative', width: 220, height: 150, borderRadius: 14, overflow: 'hidden', background: 'linear-gradient(180deg,#DCE8F2,#C9D6E1)', flex: 'none' }}>
          <svg viewBox="0 0 220 150" width="100%" height="100%">
            <rect x="0" y="118" width="220" height="32" fill="#B4C0CB" />
            <rect x="30" y="44" width="120" height="76" fill="#EEF1F4" stroke="#C3CCD5" />
            <rect x="56" y="52" width="68" height="12" rx="2" fill="#20486E" />
            <text x="90" y="60.5" fontSize="6.6" fontWeight="800" fill="#fff" textAnchor="middle" fontFamily="Plus Jakarta Sans">PUMP STATION 4</text>
            <rect x="80" y="80" width="20" height="40" fill="#2A5F92" />
            <rect x="160" y="82" width="26" height="38" fill="#D6DCE2" />
            <circle cx="173" cy="78" r="4" fill="#D0524A" />
            <rect x="163" y="104" width="20" height="8" fill="#B9C2CB" />
          </svg>
          <motion.div animate={{ opacity: [1, 0.5, 1] }} transition={{ duration: 1, repeat: Infinity }} style={{ position: 'absolute', left: 154, top: 96, width: 36, height: 24, border: '2.5px solid #F0A73A', borderRadius: 5 }} />
          <motion.div initial={{ top: 0 }} animate={{ top: [0, 146, 0] }} transition={{ duration: 2.4, repeat: Infinity }} style={{ position: 'absolute', left: 0, right: 0, height: 3, background: 'rgba(60,130,196,.75)' }} />
          <span className="chip neutral" style={{ position: 'absolute', left: 8, top: 8, background: 'rgba(255,255,255,.9)' }}><Icon name="camera" size={12} /> Lakshmi’s photo</span>
        </div>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
          {lines.map(([ic, l, v], i) => (
            <div key={l} className="row" style={{ gap: 10, padding: '9px 11px', borderRadius: 12, background: n > i ? 'var(--panel)' : '#fff', boxShadow: 'inset 0 0 0 1px var(--line)', opacity: n > i ? 1 : 0.5, transition: 'all .3s' }}>
              <Icon name={ic} size={16} style={{ color: n > i ? 'var(--blue)' : 'var(--ink-3)' }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 10.5, color: 'var(--ink-3)' }}>{l}</div>
                <div style={{ fontSize: 12.5, fontWeight: 700 }}>{n > i ? v : 'Reading…'}</div>
              </div>
              {n > i && <Icon name="check" size={14} stroke={3} style={{ color: 'var(--green)' }} />}
            </div>
          ))}
        </div>
      </div>
      <AnimatePresence>
        {n >= 3 && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} style={{ background: 'var(--amber-100)', borderRadius: 12, padding: '10px 12px', fontSize: 12.5, color: '#6E4A0E', lineHeight: 1.45 }}>
            <b>No verified procedure exists for this pump.</b> Handoff will make it safe first, then rebuild how to run it from what the operators left behind.
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

const SIGNALS = [
  ['users', 'Resident report', 'Lakshmi · 2 photos + GPS · 09:00', 'Handoff app'],
  ['wifi', 'Water flow at zero', 'PS4 outlet main · 0 m³/h since 07:41', 'Jal Jeevan Mission IoT'],
  ['bolt', 'Pump power dropped', 'PS4 load 0 kW since 07:40 · Feeder 3', 'Discom smart meter'],
]

function Signals() {
  const [n, setN] = useState(0)
  useEffect(() => { const ts = [400, 1200, 2000, 2800].map((ms, i) => setTimeout(() => setN(i + 1), ms)); return () => ts.forEach(clearTimeout) }, [])
  return (
    <>
      <CaseHead status={n > 3 ? 'Case opened' : 'Merging signals'} tone="blue" />
      <div className="eyebrow">Independent signals, same place</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {SIGNALS.map(([ic, t, s, src], i) => (
          <motion.div key={t} initial={{ opacity: 0, x: 16 }} animate={{ opacity: n > i ? 1 : 0.25, x: n > i ? 0 : 16 }} className="row" style={{ gap: 11, padding: '10px 12px', borderRadius: 12, background: 'var(--panel)', boxShadow: 'inset 0 0 0 1px var(--line)' }}>
            <span style={{ width: 30, height: 30, borderRadius: 9, background: '#fff', color: 'var(--blue)', display: 'grid', placeItems: 'center' }}><Icon name={ic} size={16} /></span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 800 }}>{t}</div>
              <div style={{ fontSize: 11.5, color: 'var(--ink-3)' }}>{s}</div>
            </div>
            <span className="chip neutral" style={{ background: '#fff', boxShadow: 'inset 0 0 0 1px var(--blue-300)', color: 'var(--blue-800)' }}>{src}</span>
          </motion.div>
        ))}
      </div>
      <AnimatePresence>
        {n > 3 && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="row" style={{ gap: 12, background: 'var(--red-100)', borderRadius: 12, padding: '11px 13px', alignItems: 'flex-start' }}>
            <Icon name="warn" size={18} style={{ color: '#A3332C', flex: 'none', marginTop: 1 }} />
            <div style={{ fontSize: 12.5, color: '#7E2A24', lineHeight: 1.45 }}>
              <b>Silence + zero flow + no load = nobody is running it.</b> The pump didn’t break; its operators are gone. One case, not three tickets.
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="row" style={{ gap: 8, fontSize: 11, color: 'var(--ink-3)', marginTop: 'auto' }}>
        <Icon name="lock" size={13} /> Read under the national emergency order · no personal data
      </div>
    </>
  )
}

const CANDIDATES = [
  ['PN', 'Priya N.', 'Retired water analyst, TWAD Board · 31 yrs', '2.1 km', 'Licence lapsed 2024', 'Best match', true],
  ['AV', 'Arun V.', 'Lab chemist, private hospital', '6.8 km', 'Not water-certified', 'Fallback'],
  ['SL', 'State water lab, Guindy', '1 chemist on duty', '11 km', 'Remote only', 'Supervisor'],
]

function Chlorine() {
  const [n, setN] = useState(0)
  useEffect(() => { const ts = [600, 1300, 1900, 2500].map((ms, i) => setTimeout(() => setN(i + 1), ms)); return () => ts.forEach(clearTimeout) }, [])
  return (
    <>
      <CaseHead status="Pump running · supply held" tone="warn" />
      <div className="row" style={{ gap: 10, alignItems: 'stretch' }}>
        <div style={{ flex: 1, background: 'var(--red-100)', borderRadius: 14, padding: '9px 13px' }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#A3332C' }}>Residual chlorine · tank outlet</div>
          <div className="mono" style={{ fontSize: 21, fontWeight: 700, color: '#A3332C' }}>0.0 mg/L</div>
          <div style={{ fontSize: 10.5, color: '#A3332C', opacity: 0.8 }}>needs 0.2 or more before release</div>
        </div>
        <div style={{ flex: 1.35, background: 'var(--violet-100)', borderRadius: 14, padding: '9px 13px' }}>
          <div className="row" style={{ gap: 6 }}><span className="chip violet" style={{ background: '#fff' }}>TIER T4 · LICENSED</span></div>
          <div style={{ fontSize: 12.5, fontWeight: 800, marginTop: 5 }}>Chlorine dosing needs a licensed chemist</div>
          <div style={{ fontSize: 11, color: '#4C4592' }}>Ward 34 had two. Both vanished in the Snap.</div>
        </div>
      </div>
      <div style={{ borderRadius: 14, boxShadow: 'inset 0 0 0 1px var(--line)', padding: '9px 13px' }}>
        <div className="row" style={{ justifyContent: 'space-between', marginBottom: 4 }}>
          <span className="eyebrow">Finding licensed people nearby</span>
          <span className="row" style={{ gap: 4 }}>{['e-Shram', 'DigiLocker', 'IDRN'].map((t) => <span key={t} className="chip blue" style={{ padding: '2px 6px', fontSize: 9.5 }}>{t}</span>)}</span>
        </div>
        {CANDIDATES.map(([ini, nm, s, km, lic, tag, best], i) => (
          <motion.div key={nm} initial={{ opacity: 0, y: 6 }} animate={{ opacity: n > i ? 1 : 0, y: n > i ? 0 : 6 }} className="row" style={{ gap: 10, padding: '7px 8px', margin: '2px -8px', borderRadius: 10, background: best ? 'var(--blue-50)' : 'transparent', boxShadow: best ? 'inset 0 0 0 1.5px var(--blue)' : 'none' }}>
            <span style={{ width: 28, height: 28, borderRadius: '50%', background: best ? '#8A5BA8' : '#D3DBE3', color: best ? '#fff' : 'var(--ink-2)', display: 'grid', placeItems: 'center', fontSize: 10, fontWeight: 800, fontFamily: 'var(--display)', flex: 'none' }}>{ini}</span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 12.5, fontWeight: 800 }}>{nm} <span style={{ fontWeight: 500, color: 'var(--ink-3)', fontSize: 11 }}>· {km}</span></div>
              <div style={{ fontSize: 11, color: 'var(--ink-3)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{s}</div>
            </div>
            <span className={`chip ${best ? 'warn' : 'neutral'}`} style={{ padding: '2px 7px' }}>{lic}</span>
            <span className={`chip ${best ? 'good' : 'neutral'}`} style={{ padding: '2px 7px' }}>{tag}</span>
          </motion.div>
        ))}
      </div>
      <AnimatePresence>
        {n > 3 && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} style={{ background: 'var(--amber-100)', borderRadius: 12, padding: '9px 12px', fontSize: 12, color: '#6E4A0E', lineHeight: 1.45 }}>
            <b>Priya accepted at 14:14.</b> Her licence lapsed, so she needs a temporary emergency licence: two approvers, this task only, supervised by the state lab.
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

function Countdown() {
  const [s, setS] = useState(17 * 3600 + 57 * 60)
  useEffect(() => { const t = setInterval(() => setS((v) => v - 1), 1000); return () => clearInterval(t) }, [])
  const hh = Math.floor(s / 3600), mm = Math.floor((s % 3600) / 60), ss = s % 60
  return <span className="mono">{hh}h {String(mm).padStart(2, '0')}m {String(ss).padStart(2, '0')}s</span>
}

function Rank() {
  return (
    <>
      <CaseHead status="Priority 1 of 23" tone="bad" />
      <div className="row" style={{ gap: 10, alignItems: 'stretch' }}>
        <div style={{ flex: 1.3, background: 'var(--red-100)', borderRadius: 14, padding: '11px 14px' }}>
          <div className="row" style={{ gap: 6, fontSize: 11.5, fontWeight: 700, color: '#A3332C' }}><Icon name="clock" size={14} /> Countdown to harm</div>
          <div style={{ fontSize: 22, fontWeight: 700, color: '#A3332C', marginTop: 2, whiteSpace: 'nowrap' }}><Countdown /></div>
          <div style={{ fontSize: 11, color: '#A3332C', opacity: 0.8 }}>until stored water runs out</div>
        </div>
        <Stat label="People affected" v="40,000" />
        <Stat label="Systems that depend on it" v="3" sub="Hospital · 2 schools" />
      </div>
      <div style={{ borderRadius: 14, boxShadow: 'inset 0 0 0 1px var(--line)', padding: '10px 14px 6px' }}>
        <div className="row" style={{ justifyContent: 'space-between' }}>
          <span className="eyebrow">Dependency map</span>
          <span style={{ fontSize: 10.5, color: 'var(--ink-3)' }}>PM Gati Shakti layers + NDEM facilities</span>
        </div>
        <DepMap />
      </div>
      <div>
        <div className="eyebrow" style={{ marginBottom: 6 }}>Handoff’s plan</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8 }}>
          {[['1', 'Make it safe', 'Anyone on site · now', 'warn'], ['2', 'Warn everyone', 'Homes, hospital, schools', 'blue'], ['3', 'Rebuild the restart', 'From what was left behind', 'violet']].map(([n, t, s, k]) => (
            <div key={n} className="row" style={{ gap: 9, background: 'var(--panel)', borderRadius: 12, padding: '8px 10px', alignItems: 'flex-start' }}>
              <span className={`chip ${k}`} style={{ padding: '2px 7px' }}>{n}</span>
              <div><div style={{ fontSize: 12.5, fontWeight: 700 }}>{t}</div><div style={{ fontSize: 11, color: 'var(--ink-3)' }}>{s}</div></div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

function Stat({ label, v, sub }) {
  return (
    <div style={{ flex: 1, background: 'var(--panel)', borderRadius: 14, padding: '11px 14px' }}>
      <div style={{ fontSize: 11.5, color: 'var(--ink-3)', fontWeight: 600 }}>{label}</div>
      <div className="mono" style={{ fontSize: 24, fontWeight: 700, color: 'var(--ink)', marginTop: 2 }}>{v}</div>
      {sub && <div style={{ fontSize: 11, color: 'var(--ink-3)' }}>{sub}</div>}
    </div>
  )
}

function DepMap() {
  const N = {
    feeder: [70, 70, 'Feeder 3', 'bolt', '#D69A2D'],
    pump: [250, 70, 'Pump Station 4', 'pump', '#CC4C44'],
    hosp: [440, 26, 'District Hospital', 'hospital', '#3C82C4'],
    school: [440, 72, '2 schools', 'users', '#3C82C4'],
    homes: [440, 118, '40,000 homes', 'drop', '#3C82C4'],
  }
  const edges = [['feeder', 'pump'], ['pump', 'hosp'], ['pump', 'school'], ['pump', 'homes'], ['feeder', 'hosp']]
  return (
    <svg viewBox="0 0 520 146" width="100%" style={{ display: 'block', marginTop: 2 }}>
      {edges.map(([a, b], i) => {
        const A = N[a], B = N[b]
        const hidden = a === 'feeder' && b === 'hosp'
        const d = hidden ? `M${A[0] + 46} ${A[1] - 14} C 200 -10, 330 0, ${B[0] - 66} ${B[1]}` : `M${A[0] + 56} ${A[1]} C ${(A[0] + B[0]) / 2} ${A[1]}, ${(A[0] + B[0]) / 2} ${B[1]}, ${B[0] - 66} ${B[1]}`
        return <motion.path key={i} d={d} fill="none" stroke={hidden ? '#D69A2D' : '#9CC4E6'} strokeWidth={hidden ? 2 : 2.4} strokeDasharray={hidden ? '5 4' : '0'} initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.2 + i * 0.15, duration: 0.6 }} />
      })}
      {Object.entries(N).map(([k, [x, y, l, , c]]) => (
        <g key={k}>
          <rect x={x - 64} y={y - 14} width="128" height="28" rx="9" fill="#fff" stroke={c} strokeWidth={k === 'pump' ? 2.2 : 1.4} />
          <circle cx={x - 50} cy={y} r="5" fill={c} />
          <text x={x - 40} y={y + 4} fontSize="11.5" fontWeight="700" fill="#1C2B3A" fontFamily="Inter">{l}</text>
        </g>
      ))}
      <text x="8" y="112" fontSize="10.5" fill="#A86C0F" fontFamily="Inter" fontWeight="600">- - - link nobody wrote down:</text><text x="8" y="126" fontSize="10.5" fill="#A86C0F" fontFamily="Inter" fontWeight="600">the hospital is on Feeder 3 too</text>
    </svg>
  )
}

function Share() {
  const stations = [['Ward 12 · PS2', 'No operator · case opened with fix', 'bad'], ['Ward 51 · PS1', 'Suresh M. on duty', 'good'], ['Tambaram · PS3', '1 operator · backup next', 'warn']]
  return (
    <>
      <CaseHead status="Safe supply · 15:10" tone="good" />
      <div className="row" style={{ gap: 10, background: 'var(--green-100)', borderRadius: 14, padding: '10px 14px' }}>
        <Icon name="star" size={18} style={{ color: 'var(--green)' }} />
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 800, fontSize: 13.5, color: '#1E6E4A' }}>Restart procedure verified · 98% confidence</div>
          <div style={{ fontSize: 11.5, color: '#2C6B4E' }}>Expert-reviewed, then confirmed by a real run: every Machine Check passed.</div>
        </div>
      </div>
      <div style={{ borderRadius: 14, boxShadow: 'inset 0 0 0 1px var(--line)', padding: '10px 14px' }}>
        <div className="row" style={{ justifyContent: 'space-between' }}>
          <span className="eyebrow">Shared Library · same VT-150 pump</span>
          <span style={{ fontSize: 10.5, color: 'var(--ink-3)' }}>skips the rebuild at each site</span>
        </div>
        {stations.map(([n, s, t], i) => (
          <motion.div key={n} {...rise(0.1 + i * 0.1)} className="row" style={{ gap: 10, padding: '8px 0', borderBottom: i < 2 ? '1px solid var(--line-2)' : 0 }}>
            <span style={{ width: 26, height: 26, borderRadius: 8, background: 'var(--blue-100)', color: 'var(--blue-700)', display: 'grid', placeItems: 'center' }}><Icon name="pump" size={14} /></span>
            <span style={{ fontSize: 12.5, fontWeight: 700, flex: 1 }}>{n}</span>
            <span className={`chip ${t}`}>{s}</span>
            <span style={{ width: 20, height: 20, borderRadius: 6, background: 'var(--blue)', color: '#fff', display: 'grid', placeItems: 'center' }}><Icon name="check" size={12} stroke={3} /></span>
          </motion.div>
        ))}
      </div>
      <div className="row" style={{ gap: 10, alignItems: 'stretch' }}>
        <div style={{ flex: 1, background: 'var(--panel)', borderRadius: 14, padding: '10px 13px' }}>
          <div className="eyebrow">Rule of Two</div>
          <div style={{ fontSize: 12.5, fontWeight: 700, marginTop: 4 }}>Backup: Meena S.</div>
          <div style={{ fontSize: 11.5, color: 'var(--ink-3)' }}>Signed off by Ravi · 16:40</div>
        </div>
        <div style={{ flex: 1, background: 'var(--panel)', borderRadius: 14, padding: '10px 13px' }}>
          <div className="eyebrow">Also in the library</div>
          <div style={{ fontSize: 12.5, fontWeight: 700, marginTop: 4 }}>Chlorinator dosing · T4</div>
          <div style={{ fontSize: 11.5, color: 'var(--ink-3)' }}>Verified by Priya N. · 0.5 mg/L</div>
        </div>
      </div>
    </>
  )
}

function Closed() {
  const tl = [['09:00', 'Reported'], ['09:20', 'Made safe'], ['11:00', 'Verified'], ['14:00', 'Restarted'], ['15:10', 'Safe water'], ['16:40', 'Backup']]
  const people = [['LK', '#C27C5A', 'Reported'], ['FA', '#3C82C4', 'Prepared'], ['KS', '#4A5A6A', 'Shared data'], ['RK', '#2A5F92', 'Ran it'], ['SM', '#6C63B5', 'Verified'], ['AR', '#2E9A6A', 'Authorized'], ['PN', '#8A5BA8', 'Chlorinated'], ['MS', '#2E8A83', 'Backup']]
  return (
    <>
      <CaseHead status="Case closed" tone="good" />
      <div style={{ borderRadius: 14, boxShadow: 'inset 0 0 0 1px var(--line)', padding: '12px 16px 10px' }}>
        <div style={{ position: 'relative', display: 'flex', justifyContent: 'space-between' }}>
          <div style={{ position: 'absolute', left: 12, right: 12, top: 8, height: 3, background: 'var(--green-100)' }} />
          <motion.div initial={{ width: 0 }} animate={{ width: 'calc(100% - 24px)' }} transition={{ duration: 1.4 }} style={{ position: 'absolute', left: 12, top: 8, height: 3, background: 'var(--green)' }} />
          {tl.map(([t, l], i) => (
            <motion.div key={t} initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { delay: 0.2 + i * 0.2 } }} style={{ position: 'relative', textAlign: 'center', width: 70 }}>
              <span style={{ display: 'block', width: 19, height: 19, margin: '0 auto', borderRadius: '50%', background: 'var(--green)', border: '3px solid #fff', boxShadow: '0 0 0 1.5px var(--green)' }} />
              <div className="mono" style={{ fontSize: 10.5, color: 'var(--ink-3)', marginTop: 5 }}>{t}</div>
              <div style={{ fontSize: 11.5, fontWeight: 700 }}>{l}</div>
            </motion.div>
          ))}
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        {[
          ['shield', 'Made safe before harm', '20 min after the report', '17h 40m of water to spare'],
          ['check', 'First-time success', 'Both rebuilt procedures worked', 'Every Machine Check passed'],
          ['library', 'Knowledge reused', '3 identical stations', 'Ward 12 restarts tonight'],
          ['users', 'Single-person risk', 'None left at PS4', 'Ravi + Meena trained'],
        ].map(([ic, l, v, s], i) => (
          <motion.div key={l} {...rise(0.3 + i * 0.1)} style={{ background: 'var(--panel)', borderRadius: 14, padding: '9px 12px', display: 'flex', gap: 10 }}>
            <span style={{ width: 28, height: 28, borderRadius: 9, background: 'var(--green-100)', color: 'var(--green)', display: 'grid', placeItems: 'center', flex: 'none' }}><Icon name={ic} size={15} /></span>
            <div>
              <div style={{ fontSize: 10.5, color: 'var(--ink-3)', fontWeight: 600 }}>{l}</div>
              <div style={{ fontSize: 13, fontWeight: 800, marginTop: 1 }}>{v}</div>
              <div style={{ fontSize: 11, color: 'var(--ink-2)' }}>{s}</div>
            </div>
          </motion.div>
        ))}
      </div>
      <motion.div {...rise(0.8)} style={{ borderRadius: 14, boxShadow: 'inset 0 0 0 1px var(--line)', padding: '9px 12px' }}>
        <div className="eyebrow" style={{ marginBottom: 7 }}>Nine people, one pump · plus this control room</div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          {people.map(([ini, c, l]) => (
            <div key={ini} style={{ textAlign: 'center', width: 58 }}>
              <span style={{ width: 28, height: 28, margin: '0 auto', borderRadius: '50%', background: c, color: '#fff', display: 'grid', placeItems: 'center', fontSize: 10, fontWeight: 800, fontFamily: 'var(--display)' }}>{ini}</span>
              <div style={{ fontSize: 10, color: 'var(--ink-2)', marginTop: 3, fontWeight: 600, whiteSpace: 'nowrap' }}>{l}</div>
            </div>
          ))}
        </div>
      </motion.div>
    </>
  )
}

/* ---------------- action bar ---------------- */

function ActionBar({ phase, go, hint }) {
  const delay = { signals: 3000, identify: 2500, chlorine: 2700 }[phase]
  const [ready, setReady] = useState(!delay)
  useEffect(() => { if (!delay) { setReady(true); return } setReady(false); const t = setTimeout(() => setReady(true), delay); return () => clearTimeout(t) }, [phase])
  const A = {
    signals: ['Identify equipment', 'identify', 'btn-primary', 'camera'],
    identify: ['Assess risk', 'rank', 'btn-primary', 'gauge'],
    rank: ['Send early warning', 'warn', 'btn-warn', 'bell'],
    chlorine: ['Request emergency licence', 'licence', 'btn-primary', 'shield'],
    share: ['Share with 3 stations', 'audit', 'btn-safe', 'send'],
  }[phase]
  const note = {
    signals: 'Signals that point at the same place become one case.',
    identify: 'Handoff reads the photo, then checks the Shared Library.',
    rank: 'Cell Broadcast via NDMA SACHET, plus direct alerts to the hospital and schools.',
    chlorine: 'Water is released only when the chlorine sensor reads safe.',
    share: 'Each station gets the verified steps, the training clip and the safety quiz.',
    closed: 'One pump, no expert on site, no harm done.',
  }[phase]
  return (
    <div style={{ height: 64, flex: 'none', display: 'flex', alignItems: 'center', gap: 12, padding: '0 18px', borderTop: '1px solid var(--line)', background: '#fff' }}>
      <Icon name="info" size={16} style={{ color: 'var(--ink-3)' }} />
      <span style={{ fontSize: 12.5, color: 'var(--ink-2)', flex: 1 }}>{note}</span>
      {A && (
        <Hint on={hint && ready}>
          <button className={`btn ${A[2]}`} disabled={!ready} onClick={() => go(A[1])}><Icon name={A[3]} size={16} /> {A[0]}</button>
        </Hint>
      )}
      {!A && <span className="chip good" style={{ fontSize: 12, padding: '7px 12px' }}><Icon name="check" size={13} stroke={3} /> Story complete</span>}
    </div>
  )
}
