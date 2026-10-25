/*
 * App shell: the 1600x900 stage, the story state machine and the layout.
 * The 3D scene tells the story on the left; one or two Handoff screens show on the right.
 * Taps call go(phase); flow.js says which screens show and what to tap next.
 */
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { TopBand, BottomBand } from './Background.jsx'
import Scene from './Scene.jsx'
import LakshmiPhone from './LakshmiPhone.jsx'
import RaviPhone from './RaviPhone.jsx'
import ExpertPhone from './ExpertPhone.jsx'
import OfficerPhone from './OfficerPhone.jsx'
import Console from './Console.jsx'
import AdminConsole from './AdminConsole.jsx'
import HospitalPhone from './HospitalPhone.jsx'
import PriyaPhone from './PriyaPhone.jsx'
import MeenaPhone from './MeenaPhone.jsx'
import { Icon, HintTarget, Logo } from './ui.jsx'
import Spotlight from './Spotlight.jsx'
import { PHASES, STORY, STAGES, ROLES, CAST, WATER, after } from './flow.js'

const WIDTH = { lakshmi: 300, ravi: 300, suresh: 300, officer: 300, hospital: 300, priya: 300, meena: 300, console: 840, admin: 840 }
const GAP = 24
const ROW_W = 1536

// Autoplay: how long each step stays up before moving on.
const AUTO_MS = { report: 4200, signals: 5600, identify: 5200, rank: 6000, warn: 5200, access: 6800, onsite: 4600, stabilize: 6400, rebuild: 7000, validate: 6000, train: 5200, authorize: 4600, restart: 7600, chlorine: 6800, licence: 5200, dose: 6400, flowing: 4800, backup: 6000, share: 5600, audit: 6400 }

function useFit() {
  const [s, setS] = useState(1)
  useLayoutEffect(() => {
    const f = () => setS(Math.min((window.innerWidth - 40) / 1600, (window.innerHeight - 40) / 900))
    f(); window.addEventListener('resize', f); return () => window.removeEventListener('resize', f)
  }, [])
  return s
}

export default function App() {
  const scale = useFit()
  const [phase, setPhase] = useState('report')
  const [history, setHistory] = useState([])
  const [auto, setAuto] = useState(false)
  const [runId, setRunId] = useState(0)
  const [target, setTarget] = useState(null)
  const stageRef = useRef(null)
  const sceneRef = useRef(null)

  // Ignore taps for a moment after each step, so a double-tap can't skip the next screen.
  const lastGo = useRef(0)
  const go = useCallback((p) => {
    const now = Date.now()
    if (p === phase || now - lastGo.current < 600) return
    lastGo.current = now
    setHistory((h) => [...h, phase]); setPhase(p)
  }, [phase])
  const back = () => { if (!history.length) return; const h = [...history]; const p = h.pop(); setHistory(h); setPhase(p) }
  const restart = () => { setPhase('report'); setHistory([]); setRunId((r) => r + 1) }
  const nextStep = useCallback(() => {
    const i = STORY.indexOf(phase)
    if (i >= 0 && i < STORY.length - 1) go(STORY[i + 1])
  }, [phase, go])

  useEffect(() => {
    if (!auto) return
    if (phase === 'closed') { setAuto(false); return }
    const id = setTimeout(nextStep, AUTO_MS[phase] || 4000)
    return () => clearTimeout(id)
  }, [auto, phase, nextStep])

  useEffect(() => {
    const k = (e) => {
      if (e.key === 'ArrowRight' || e.key === 'PageDown') nextStep()
      if (e.key === 'ArrowLeft' || e.key === 'PageUp') back()
    }
    window.addEventListener('keydown', k); return () => window.removeEventListener('keydown', k)
  })

  const ph = PHASES[phase]
  const screens = ph.screens

  // A device that leaves and comes back gets a fresh key, so it always re-enters live.
  const seen = useRef({ prev: [], count: {} })
  if (seen.current.phase !== phase) {
    screens.forEach((s) => { if (!seen.current.prev.includes(s)) seen.current.count[s] = (seen.current.count[s] || 0) + 1 })
    seen.current = { ...seen.current, prev: screens, phase }
  }

  // In two-screen steps only the screen holding the next tap gets the coach-mark.
  const lead = (s) => !ph.lead || ph.lead === s
  const devW = screens.reduce((w, s) => w + WIDTH[s], 0) + GAP * (screens.length - 1)
  const sceneW = ROW_W - devW - 32
  const shared = { phase, go, auto }

  return (
    <div className="viewport">
      <HintTarget.Provider value={setTarget}>
      <div ref={stageRef} className="stage" style={{ transform: `scale(${scale})` }} key={runId}>
        <TopBand>
          <div style={{ position: 'absolute', left: 32, right: 32, top: 16, height: 56, display: 'flex', alignItems: 'center', gap: 16 }}>
            <Logo size={46} />
            <div>
              <div className="display" style={{ fontSize: 26, fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1, color: 'var(--blue-900)' }}>
                Hand<span style={{ color: 'var(--blue)' }}>off</span>
              </div>
              <div style={{ fontSize: 13, color: 'var(--ink-2)', marginTop: 4 }}>One silent pump, nine people, five stages</div>
            </div>
            <div style={{ flex: 1 }} />
            <CastStrip active={screens} />
            <StagePills current={ph.stage} />
            <div style={{ position: 'relative', background: '#fff', boxShadow: 'inset 0 0 0 1px var(--line)', borderRadius: 14, padding: '6px 16px', minWidth: 170 }}>
              <div className="eyebrow" style={{ fontSize: 9.5 }}>Day after the Snap</div>
              <AnimatePresence mode="popLayout">
                <motion.div key={ph.clock} className="mono" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} style={{ fontSize: 17, fontWeight: 700, color: 'var(--blue-900)' }}>Day 1 · {ph.clock}</motion.div>
              </AnimatePresence>
            </div>
          </div>
        </TopBand>

        <div style={{ position: 'absolute', left: 32, right: 32, top: 108, height: 648, display: 'flex', justifyContent: 'center', gap: 32 }}>
          <motion.div ref={sceneRef} animate={{ width: sceneW }} initial={false} transition={{ type: 'spring', stiffness: 160, damping: 26 }} style={{ minWidth: 0, height: '100%' }}>
            <Scene phase={phase} caption={ph.scene} data={ph.data} />
          </motion.div>
          <div style={{ display: 'flex', gap: GAP, alignItems: 'center', flex: 'none' }}>
            {screens.map((s) => (
              <motion.div key={s + seen.current.count[s]} layout initial={{ opacity: 0, x: 80, scale: 0.94 }} animate={{ opacity: 1, x: 0, scale: 1 }}
                transition={{ type: 'spring', stiffness: 220, damping: 26 }} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <DeviceLabel role={s} />
                <div style={{ borderRadius: s === 'console' ? 24 : 44, boxShadow: '0 0 0 3px #fff, 0 0 0 4.5px var(--blue-300), 0 30px 60px -28px rgba(24,52,79,.55)' }}>
                  {s === 'lakshmi' && <LakshmiPhone {...shared} hint={lead(s)} />}
                  {s === 'ravi' && <RaviPhone {...shared} hint={lead(s)} />}
                  {s === 'suresh' && <ExpertPhone {...shared} hint={lead(s)} />}
                  {s === 'officer' && <OfficerPhone {...shared} hint={lead(s)} />}
                  {s === 'hospital' && <HospitalPhone {...shared} hint={lead(s)} />}
                  {s === 'priya' && <PriyaPhone {...shared} hint={lead(s)} />}
                  {s === 'meena' && <MeenaPhone {...shared} hint={lead(s)} />}
                  {s === 'console' && <div style={{ width: 840, height: 612 }}><Console {...shared} hint={lead(s)} /></div>}
                  {s === 'admin' && <div style={{ width: 840, height: 612 }}><AdminConsole {...shared} hint={lead(s)} /></div>}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <BottomBand>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn btn-ghost" aria-label="Back" style={{ width: 46, padding: 0 }} onClick={back} disabled={!history.length}><Icon name="back" size={20} stroke={2.4} /></button>
            <button className="btn btn-primary" aria-label={auto ? 'Pause autoplay' : 'Autoplay'} style={{ width: 54, padding: 0 }} onClick={() => { if (!auto && phase === 'closed') restart(); setAuto(!auto) }}>
              <Icon name={auto ? 'pause' : 'play'} size={20} />
            </button>
            <button className="btn btn-ghost" aria-label="Restart" style={{ width: 46, padding: 0 }} onClick={restart}><Icon name="restart" size={18} stroke={2.4} /></button>
          </div>
          <div style={{ flex: 1, minWidth: 0, position: 'relative' }}>
            <AnimatePresence mode="popLayout">
              <motion.div key={phase} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.3 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span className="mono" style={{ fontSize: 11.5, color: STAGES[ph.stage].color, fontWeight: 700 }}>STEP {ph.n} / {STORY.length}</span>
                  <span className="display" style={{ fontSize: 20, fontWeight: 700, letterSpacing: '-0.01em', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: 'var(--ink)' }}>{ph.title}</span>
                </div>
                <div style={{ fontSize: 13.5, color: 'var(--ink-2)', marginTop: 3, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{ph.body}</div>
                <div style={{ fontSize: 14, color: '#B9781A', marginTop: 5, display: 'flex', alignItems: 'center', gap: 6, fontWeight: 700 }}>
                  <Icon name="hand" size={15} /> {auto ? 'Autoplaying…' : target ? <><span style={{ opacity: 0.75 }}>Next:</span> {ph.cue}</> : (ph.wait || ph.cue)}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
          <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
            {STORY.map((s, i) => {
              const cur = STORY.indexOf(phase)
              return <motion.span key={s} animate={{ width: i === cur ? 22 : 7, background: i === cur ? STAGES[PHASES[s].stage].color : i < cur ? STAGES[PHASES[s].stage].color : '#D3DBE3', opacity: i < cur ? 0.55 : 1 }} style={{ height: 7, borderRadius: 4 }} />
            })}
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <Counter label="Stored water left" v={waterLabel(phase)} color={after(phase, 'stabilize') ? 'var(--green)' : 'var(--red)'} />
            <Counter label="Stations with the fix" v={after(phase, 'share') ? 4 : after(phase, 'flowing') ? 1 : 0} color="var(--blue)" />
          </div>
        </BottomBand>
        <Spotlight target={target} stageRef={stageRef} sceneRef={sceneRef} scale={scale} idleKey={phase} off={auto} />
      </div>
      </HintTarget.Provider>
    </div>
  )
}

function waterLabel(phase) {
  if (after(phase, 'flowing')) return 'Refilling'
  if (after(phase, 'rebuild')) return 'Holding'
  return WATER[phase]
}

// Small label above each device, so the audience always knows whose screen it is and what kind of user they are.
function DeviceLabel({ role }) {
  const r = ROLES[role]
  return (
    <div style={{ height: 26, display: 'flex', alignItems: 'center', gap: 7, paddingLeft: 6, maxWidth: WIDTH[role], whiteSpace: 'nowrap' }}>
      <Avatar r={r} size={24} />
      <span style={{ fontSize: 13, fontWeight: 800, fontFamily: 'var(--display)', color: 'var(--ink)' }}>{r.name}</span>
      <span style={{ fontSize: 11.5, color: 'var(--ink-3)', overflow: 'hidden', textOverflow: 'ellipsis', minWidth: 0 }}>{r.who}</span>
      <span style={{ marginLeft: 'auto', flex: 'none', fontSize: 9.5, fontWeight: 800, fontFamily: 'var(--display)', letterSpacing: '.06em', textTransform: 'uppercase', color: r.color, background: '#fff', boxShadow: `inset 0 0 0 1.5px ${r.color}`, borderRadius: 6, padding: '3px 6px' }}>{r.role}</span>
    </div>
  )
}

function Avatar({ r, size = 24 }) {
  return (
    <span style={{ width: size, height: size, flex: 'none', borderRadius: '50%', background: r.color, color: '#fff', display: 'grid', placeItems: 'center', fontSize: size * 0.4, fontWeight: 800, fontFamily: 'var(--display)' }}>
      {r.initials || <Icon name="console" size={size * 0.54} />}
    </span>
  )
}

// Everyone who uses Handoff in this story. Whoever is acting right now is lit up.
function CastStrip({ active }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: '#fff', boxShadow: 'inset 0 0 0 1px var(--line)', borderRadius: 14, padding: '5px 12px 5px 14px' }}>
      <div style={{ lineHeight: 1.15 }}>
        <div className="eyebrow" style={{ fontSize: 9.5 }}>Who’s acting</div>
        <div style={{ fontSize: 11, color: 'var(--ink-2)', fontWeight: 600 }}>9 users, 9 roles</div>
      </div>
      <div style={{ display: 'flex', gap: 4 }}>
        {CAST.map((k) => {
          const on = active.includes(k)
          return (
            <motion.span key={k} title={`${ROLES[k].name} · ${ROLES[k].role}`} animate={{ opacity: on ? 1 : 0.32, scale: on ? 1.12 : 1, y: on ? -1 : 0 }} transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              style={{ borderRadius: '50%', boxShadow: on ? `0 0 0 2px #fff, 0 0 0 3.5px ${ROLES[k].color}` : 'none' }}>
              <Avatar r={ROLES[k]} size={28} />
            </motion.span>
          )
        })}
      </div>
    </div>
  )
}

// Which stage of Handoff the current step shows.
function StagePills({ current }) {
  return (
    <div style={{ display: 'flex', gap: 4, background: '#fff', boxShadow: 'inset 0 0 0 1px var(--line)', borderRadius: 14, padding: 4 }}>
      {Object.entries(STAGES).map(([k, f], i) => {
        const on = k === current
        return (
          <motion.span key={k} animate={{ background: on ? f.color : 'rgba(255,255,255,0)', color: on ? '#fff' : '#5B6B7B' }}
            style={{ display: 'flex', alignItems: 'center', gap: 7, borderRadius: 11, padding: '8px 13px', fontSize: 13, fontWeight: 700, fontFamily: 'var(--display)', whiteSpace: 'nowrap' }}>
            <span className="mono" style={{ fontSize: 10.5, opacity: 0.8 }}>{String.fromCharCode(65 + i)}</span>{f.label}
          </motion.span>
        )
      })}
    </div>
  )
}

function Counter({ label, v, color }) {
  return (
    <div style={{ position: 'relative', background: '#fff', boxShadow: 'inset 0 0 0 1px var(--line)', borderRadius: 14, padding: '8px 14px', minWidth: 132 }}>
      <div style={{ fontSize: 11, color: 'var(--ink-3)' }}>{label}</div>
      <AnimatePresence mode="popLayout">
        <motion.div key={v} className="mono" initial={{ y: 14, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -14, opacity: 0 }} style={{ fontSize: 21, fontWeight: 700, color }}>{v}</motion.div>
      </AnimatePresence>
    </div>
  )
}
