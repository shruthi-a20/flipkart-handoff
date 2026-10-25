import { useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Html, QuadraticBezierLine, Line } from '@react-three/drei'
import * as THREE from 'three'
import { after } from './flow.js'

/* A calm low-poly Chennai ward, the morning after the Snap. Every step is a camera shot of it.
   Road runs along x at z = 0. North side (z < 0): substation, overhead tank, Pump Station 4, its tank.
   South side (z > 0): Lakshmi's house opposite the pump, other homes, the district hospital. */

const C = {
  ground: '#DCE3E8', road: '#66737F', lane: '#F2F5F8', walk: '#C8D1D9', grass: '#BCD0B6',
  concrete: '#E4E8EC', concrete2: '#CBD3DB', steel: '#9FAAB6', steelDark: '#6B7885', blue: '#3C82C4', blueDark: '#2A5F92',
  water: '#6FAEDC', amber: '#E0A23A', red: '#D0524A', green: '#38A673', white: '#FAFBFC', hair: '#2B2A2E',
}
const WALLS = ['#F3F1EC', '#E8EEF3', '#F2EAE1', '#E3ECEF', '#EEE7E2', '#E7EBF1']
const ROOFS = ['#7F94A8', '#6E97C2', '#9AA7B5', '#B48C74']

const PUMP = [0, -9]         // pump house centre
const PANEL = [-2.6, -6.15]   // control cabinet in front of the pump house
const VALVE = [4.6, -6.5]     // outlet valve on the pipe to the tank
const TANK = [8.5, -10]       // ground storage tank
const OHT = [-13, -11]        // overhead tank
const SUB = [-27, -10]        // substation
const LAKSHMI = [-2, 8]       // Lakshmi's house (faces the road)
const LK = [-6.4, 3.9]        // where Lakshmi stands
const HOSPITAL = [25, 10.5]
const FAR = [[-50, -30], [52, -28], [40, 34]]   // identical pump stations elsewhere
const NORTH = [-46, -38, 18, 30, 40, 50]
const SOUTH = [-44, -34, -24, -14, 8, 40, 48]

// Camera shots, one per step: [position], [look-at].
const SHOTS = {
  report: { pos: [-9.6, 3.5, 9.2], look: [0.6, 1.9, -8] },
  identify: { pos: [-6.8, 3.2, -1.6], look: [-1.6, 1.8, -7.2] },
  rank: { pos: [3, 74, 66], look: [2, 0, -2] },
  warn: { pos: [2, 62, 62], look: [2, 0, 0] },
  onsite: { pos: [2.6, 2.3, -3.2], look: [-0.8, 1.6, -6.2] },
  stabilize: { pos: [7.8, 2.5, -3.6], look: [4.4, 1.2, -7.2] },
  rebuild: { pos: [4.5, 7.5, 15], look: [0, 6, -7] },
  validate: { pos: [3.2, 2.6, -2.6], look: [-0.2, 2.0, -6.4] },
  train: { pos: [2.2, 2.2, -3.3], look: [-0.8, 1.7, -6.2] },
  authorize: { pos: [-3.0, 2.6, -2.8], look: [-0.4, 1.9, -6.2] },
  restart: { pos: [-5.6, 2.6, -3.4], look: [-2.2, 1.4, -6.8] },
  flowing: { pos: [-18, 6.5, 7], look: [1, 1.4, -2] },
  share: { pos: [0, 116, 104], look: [0, 0, 2] },
  closed: { pos: [12, 6.5, 9.5], look: [-0.5, 2.2, -7] },
}

// Fraction of the storage tank that's full, per step.
const LEVEL = { report: 0.6, identify: 0.59, rank: 0.58, warn: 0.57, onsite: 0.55, stabilize: 0.53, flowing: 0.7, share: 0.8, closed: 0.86 }
const level = (p) => LEVEL[p] ?? (after(p, 'flowing') ? 0.7 : 0.53)

// Status lamp on the pump's control cabinet.
function lampState(p, t) {
  if (after(p, 'flowing')) return 'green'
  if (after(p, 'stabilize')) return 'amber'
  return 'red'
}

export default function Ward3D({ phase }) {
  return (
    <Canvas shadows dpr={[1, 2]} resize={{ offsetSize: true, scroll: false, debounce: { scroll: 0, resize: 0 } }} camera={{ fov: 40, position: [-7.5, 3.3, 11.5], near: 0.1, far: 400 }} gl={{ antialias: true, alpha: true }}
      style={{ position: 'absolute', inset: 0 }}>
      <fog attach="fog" args={['#E6EDF3', 90, 260]} />
      <hemisphereLight args={['#F4F8FC', '#AEBBC8', 1.0]} />
      <directionalLight position={[-24, 34, 22]} intensity={1.45} color="#FFF7EC" castShadow
        shadow-mapSize={[2048, 2048]} shadow-camera-left={-70} shadow-camera-right={70} shadow-camera-top={40} shadow-camera-bottom={-40} shadow-bias={-0.0004} />
      <World phase={phase} />
    </Canvas>
  )
}

function World({ phase }) {
  const start = useRef(0)
  const clock = useThree((s) => s.clock)
  useEffect(() => { start.current = clock.getElapsedTime() }, [phase, clock])
  const since = () => clock.getElapsedTime() - start.current
  return (
    <>
      <Ground />
      {NORTH.map((x, i) => <House key={'n' + x} x={x} z={-8} face={0} i={i} />)}
      {SOUTH.map((x, i) => <House key={'s' + x} x={x} z={8} face={Math.PI} i={i + 2} />)}
      <House x={LAKSHMI[0]} z={LAKSHMI[1]} face={Math.PI} i={4} gate />
      <PumpHouse phase={phase} since={since} />
      <StorageTank phase={phase} />
      <OverheadTank />
      <Substation />
      <PowerLine phase={phase} since={since} />
      <Hospital />
      {FAR.map((f, i) => <MiniStation key={i} at={f} lit={after(phase, 'share')} />)}
      <Trees />
      <Cast phase={phase} since={since} />
      <Effects phase={phase} since={since} />
      <CameraRig phase={phase} />
    </>
  )
}

/* ---------------- scenery ---------------- */

function Ground() {
  const dashes = useMemo(() => Array.from({ length: 70 }, (_, i) => -100 + i * 3), [])
  return (
    <group>
      <mesh rotation-x={-Math.PI / 2} receiveShadow><planeGeometry args={[500, 260]} /><meshStandardMaterial color={C.ground} /></mesh>
      <mesh rotation-x={-Math.PI / 2} position={[0, 0.01, 0]} receiveShadow><planeGeometry args={[360, 7]} /><meshStandardMaterial color={C.road} /></mesh>
      {[-4.3, 4.3].map((z) => <mesh key={z} rotation-x={-Math.PI / 2} position={[0, 0.02, z]} receiveShadow><planeGeometry args={[360, 1.6]} /><meshStandardMaterial color={C.walk} /></mesh>)}
      {dashes.map((x) => <mesh key={x} rotation-x={-Math.PI / 2} position={[x, 0.03, 0]}><planeGeometry args={[1.4, 0.18]} /><meshBasicMaterial color={C.lane} /></mesh>)}
      {/* pump station compound */}
      <mesh rotation-x={-Math.PI / 2} position={[2.5, 0.015, -10]} receiveShadow><planeGeometry args={[19, 11]} /><meshStandardMaterial color="#D3DAE0" /></mesh>
      {[[-58, 18], [12, -22], [44, 22], [-22, 20], [-46, -22]].map(([x, z], i) => (
        <mesh key={i} rotation-x={-Math.PI / 2} position={[x, 0.016, z]} receiveShadow><circleGeometry args={[9, 28]} /><meshStandardMaterial color={C.grass} /></mesh>
      ))}
      {/* compound fence */}
      {Array.from({ length: 20 }, (_, i) => -6.5 + i * 0.9).filter((x) => x < 1.2 || x > 4.6).map((x) => (
        <mesh key={x} position={[x, 0.45, -4.7]} castShadow><boxGeometry args={[0.07, 0.9, 0.07]} /><meshStandardMaterial color={C.steel} /></mesh>
      ))}
      <mesh position={[-2.65, 0.82, -4.7]}><boxGeometry args={[7.8, 0.05, 0.05]} /><meshStandardMaterial color={C.steel} /></mesh>
      <mesh position={[8.3, 0.82, -4.7]}><boxGeometry args={[7.4, 0.05, 0.05]} /><meshStandardMaterial color={C.steel} /></mesh>
    </group>
  )
}

function House({ x, z, face, i, gate }) {
  const wall = WALLS[i % WALLS.length], roof = ROOFS[i % ROOFS.length]
  return (
    <group position={[x, 0, z]} rotation-y={face}>
      <mesh position={[0, 1.6, 0]} castShadow receiveShadow><boxGeometry args={[4.6, 3.2, 4]} /><meshStandardMaterial color={wall} flatShading /></mesh>
      <mesh position={[0, 3.28, 0]} castShadow><boxGeometry args={[4.9, 0.16, 4.3]} /><meshStandardMaterial color={roof} /></mesh>
      <mesh position={[0, 3.62, -0.6]} castShadow><cylinderGeometry args={[0.55, 0.55, 0.7, 14]} /><meshStandardMaterial color="#3E4A57" /></mesh>
      <mesh position={[0, 0.9, 2.01]}><boxGeometry args={[0.95, 1.8, 0.06]} /><meshStandardMaterial color={i % 2 ? '#5D7A96' : '#7C6A5E'} /></mesh>
      {[-1.5, 1.5].map((wx) => (
        <group key={wx} position={[wx, 1.95, 2.01]}>
          <mesh><boxGeometry args={[0.95, 0.85, 0.06]} /><meshStandardMaterial color="#FFFFFF" /></mesh>
          <mesh position={[0, 0, 0.03]}><boxGeometry args={[0.78, 0.68, 0.04]} /><meshStandardMaterial color="#BFD6E6" emissive="#BFD6E6" emissiveIntensity={0.15} /></mesh>
        </group>
      ))}
      <mesh position={[0, 0.08, 2.4]} receiveShadow><boxGeometry args={[1.5, 0.16, 0.8]} /><meshStandardMaterial color="#D9DEE3" /></mesh>
      {gate && (
        <group position={[0, 0, 3.1]}>
          {[-1.2, 1.2].map((gx) => <mesh key={gx} position={[gx, 0.6, 0]} castShadow><boxGeometry args={[0.18, 1.2, 0.18]} /><meshStandardMaterial color={C.blueDark} /></mesh>)}
          {[-1.9, 1.9].map((gx) => <mesh key={'w' + gx} position={[gx, 0.22, 0]} castShadow><boxGeometry args={[1.3, 0.44, 0.1]} /><meshStandardMaterial color={C.blueDark} /></mesh>)}
          <group position={[1.75, 0, -0.5]}>
            <mesh position={[0, 0.22, 0]} castShadow><cylinderGeometry args={[0.22, 0.17, 0.44, 10]} /><meshStandardMaterial color="#B57A55" /></mesh>
            <mesh position={[0, 0.65, 0]} castShadow><icosahedronGeometry args={[0.36, 0]} /><meshStandardMaterial color="#7FA36A" flatShading /></mesh>
          </group>
        </group>
      )}
    </group>
  )
}

// Text drawn to a canvas, so labels on buildings stay crisp and always fit.
function SignText({ position, w, h, text, bg = '#20486E', fg = '#FFFFFF', rotation }) {
  const tex = useMemo(() => {
    const cv = document.createElement('canvas'); cv.width = 1024; cv.height = Math.round(1024 * h / w)
    const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8
    const draw = () => {
      const g = cv.getContext('2d'), H = cv.height
      g.fillStyle = bg; g.fillRect(0, 0, cv.width, H)
      let size = H * 0.56
      g.font = `800 ${size}px "Plus Jakarta Sans", sans-serif`
      while (g.measureText(text).width > cv.width * 0.9 && size > 10) { size -= 2; g.font = `800 ${size}px "Plus Jakarta Sans", sans-serif` }
      g.fillStyle = fg; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(text, cv.width / 2, H / 2 + size * 0.04)
      t.needsUpdate = true
    }
    draw()
    document.fonts?.load('800 60px "Plus Jakarta Sans"').then(draw).catch(() => {})
    return t
  }, [w, h, text, bg, fg])
  return <mesh position={position} rotation={rotation}><planeGeometry args={[w, h]} /><meshBasicMaterial map={tex} toneMapped={false} /></mesh>
}

function PumpHouse({ phase, since }) {
  const lamp = useRef(), glow = useRef(), wheel = useRef(), rotor = useRef()
  const mats = useMemo(() => ({ red: new THREE.Color(C.red), amber: new THREE.Color(C.amber), green: new THREE.Color(C.green) }), [])
  useFrame((s, dt) => {
    const t = s.clock.getElapsedTime()
    const st = lampState(phase, since())
    const col = mats[st]
    if (lamp.current) {
      lamp.current.material.color.copy(col); lamp.current.material.emissive.copy(col)
      lamp.current.material.emissiveIntensity = st === 'red' ? 0.6 + Math.abs(Math.sin(t * 4)) * 1.4 : 1.2
    }
    if (glow.current) { glow.current.material.color.copy(col); glow.current.material.opacity = st === 'red' ? 0.18 + Math.abs(Math.sin(t * 4)) * 0.25 : 0.22 }
    // The outlet valve turns shut while Ravi stabilizes, then stays shut.
    if (wheel.current) {
      const goal = phase === 'stabilize' ? Math.min(1, since() / 2.4) * Math.PI * 3 : after(phase, 'stabilize') ? Math.PI * 3 : 0
      wheel.current.rotation.z = THREE.MathUtils.damp(wheel.current.rotation.z, goal, 3, dt)
    }
    const running = after(phase, 'flowing')
    if (rotor.current && running) rotor.current.rotation.y += dt * 9
  })
  return (
    <group>
      <group position={[PUMP[0], 0, PUMP[1]]}>
        <mesh position={[0, 2.25, 0]} castShadow receiveShadow><boxGeometry args={[7.2, 4.5, 5]} /><meshStandardMaterial color={C.concrete} flatShading /></mesh>
        <mesh position={[0, 4.6, 0]} castShadow><boxGeometry args={[7.6, 0.3, 5.4]} /><meshStandardMaterial color={C.concrete2} /></mesh>
        <mesh position={[0, 1.2, 2.51]}><boxGeometry args={[1.6, 2.4, 0.06]} /><meshStandardMaterial color={C.blueDark} /></mesh>
        <mesh position={[0.62, 1.2, 2.56]}><boxGeometry args={[0.08, 0.3, 0.04]} /><meshStandardMaterial color="#D8DEE4" /></mesh>
        {[-2.5, 2.5].map((wx) => (
          <group key={wx} position={[wx, 2.8, 2.51]}>
            <mesh><boxGeometry args={[1.3, 0.8, 0.06]} /><meshStandardMaterial color="#FFFFFF" /></mesh>
            {[-0.32, 0, 0.32].map((lx) => <mesh key={lx} position={[lx, 0, 0.04]}><boxGeometry args={[0.24, 0.6, 0.03]} /><meshStandardMaterial color="#9DB4C8" /></mesh>)}
          </group>
        ))}
        <SignText position={[0, 3.95, 2.53]} w={4.4} h={0.62} text="PUMP STATION 4" />
        {/* roof vent / motor housing visible above */}
        <group ref={rotor} position={[2.4, 5.15, -1]}>
          <mesh castShadow><cylinderGeometry args={[0.6, 0.6, 0.6, 12]} /><meshStandardMaterial color={C.steel} /></mesh>
          {[0, 1, 2].map((k) => <mesh key={k} position={[0, 0.34, 0]} rotation-y={(k * Math.PI) / 3}><boxGeometry args={[1.1, 0.05, 0.14]} /><meshStandardMaterial color={C.steelDark} /></mesh>)}
        </group>
      </group>
      {/* control cabinet with status lamp and a nameplate */}
      <group position={[PANEL[0], 0, PANEL[1]]}>
        <mesh position={[0, 0.85, 0]} castShadow><boxGeometry args={[1.0, 1.7, 0.55]} /><meshStandardMaterial color="#D6DCE2" /></mesh>
        <mesh position={[0, 1.15, 0.28]}><boxGeometry args={[0.7, 0.42, 0.02]} /><meshStandardMaterial color="#2C3A47" emissive="#4E86B8" emissiveIntensity={0.35} /></mesh>
        {[-0.22, 0, 0.22].map((bx, i) => <mesh key={bx} position={[bx, 0.68, 0.29]}><cylinderGeometry args={[0.06, 0.06, 0.04, 12]} /><meshStandardMaterial color={['#5C6B79', '#3C82C4', '#5C6B79'][i]} /></mesh>)}
        <mesh position={[0, 0.38, 0.28]}><boxGeometry args={[0.6, 0.14, 0.02]} /><meshStandardMaterial color="#B9C2CB" /></mesh>
        <mesh ref={lamp} position={[0, 1.86, 0]}><sphereGeometry args={[0.13, 16, 12]} /><meshStandardMaterial color={C.red} emissive={C.red} emissiveIntensity={1} /></mesh>
        <mesh ref={glow} position={[0, 1.86, 0]}><sphereGeometry args={[0.32, 16, 12]} /><meshBasicMaterial color={C.red} transparent opacity={0.3} depthWrite={false} /></mesh>
      </group>
      {/* pipe from the pump house to the storage tank, with the outlet valve */}
      <mesh position={[(PUMP[0] + 3.6 + TANK[0] - 2.6) / 2, 0.9, -7.4]} rotation-z={Math.PI / 2} castShadow><cylinderGeometry args={[0.22, 0.22, TANK[0] - 2.6 - 3.6, 14]} /><meshStandardMaterial color={C.steel} /></mesh>
      <mesh position={[VALVE[0], 0.9, -7.4]} rotation-z={Math.PI / 2}><cylinderGeometry args={[0.34, 0.34, 0.5, 14]} /><meshStandardMaterial color={C.steelDark} /></mesh>
      <mesh position={[VALVE[0], 1.35, -7.4]}><cylinderGeometry args={[0.06, 0.06, 0.6, 8]} /><meshStandardMaterial color={C.steelDark} /></mesh>
      <group ref={wheel} position={[VALVE[0], 1.7, -7.4]} rotation-x={Math.PI / 2}>
        <mesh><torusGeometry args={[0.38, 0.05, 8, 24]} /><meshStandardMaterial color={C.red} /></mesh>
        {[0, 1].map((k) => <mesh key={k} rotation-z={k * Math.PI / 2}><boxGeometry args={[0.76, 0.05, 0.05]} /><meshStandardMaterial color={C.red} /></mesh>)}
      </group>
      {/* outlet main down to the road */}
      <mesh position={[11.6, 0.4, -5.8]} rotation-x={Math.PI / 2} castShadow><cylinderGeometry args={[0.2, 0.2, 6, 12]} /><meshStandardMaterial color={C.steel} /></mesh>
    </group>
  )
}

function StorageTank({ phase }) {
  const water = useRef()
  useFrame((_, dt) => {
    if (!water.current) return
    const goal = level(phase)
    water.current.scale.y = THREE.MathUtils.damp(water.current.scale.y, goal, 1.4, dt)
    water.current.position.y = 0.2 + (4.4 * water.current.scale.y) / 2
  })
  return (
    <group position={[TANK[0], 0, TANK[1]]}>
      <mesh position={[0, 0.1, 0]} receiveShadow><cylinderGeometry args={[2.9, 2.9, 0.2, 32]} /><meshStandardMaterial color={C.concrete2} /></mesh>
      <mesh ref={water} position={[0, 1.5, 0]} scale={[1, 0.6, 1]}><cylinderGeometry args={[2.45, 2.45, 4.4, 32]} /><meshStandardMaterial color={C.water} emissive="#4B8FC4" emissiveIntensity={0.25} /></mesh>
      <mesh position={[0, 2.4, 0]} castShadow><cylinderGeometry args={[2.6, 2.6, 4.6, 32, 1, true]} /><meshStandardMaterial color="#D7E3EC" transparent opacity={0.42} side={THREE.DoubleSide} depthWrite={false} /></mesh>
      {[0.2, 1.35, 2.5, 3.65, 4.7].map((y) => <mesh key={y} position={[0, y, 0]}><torusGeometry args={[2.62, 0.04, 6, 40]} /><meshStandardMaterial color={C.steel} /></mesh>)}
      <mesh position={[0, 4.75, 0]}><coneGeometry args={[2.75, 0.6, 32]} /><meshStandardMaterial color={C.steel} /></mesh>
    </group>
  )
}

function OverheadTank() {
  return (
    <group position={[OHT[0], 0, OHT[1]]}>
      {[[-1.5, -1.5], [1.5, -1.5], [-1.5, 1.5], [1.5, 1.5]].map(([x, z]) => (
        <mesh key={x + ',' + z} position={[x, 4.5, z]} castShadow><boxGeometry args={[0.35, 9, 0.35]} /><meshStandardMaterial color={C.concrete2} /></mesh>
      ))}
      {[3, 6].map((y) => <mesh key={y} position={[0, y, 0]}><boxGeometry args={[3.4, 0.2, 3.4]} /><meshStandardMaterial color={C.concrete2} /></mesh>)}
      <mesh position={[0, 10.2, 0]} castShadow><cylinderGeometry args={[3.2, 2.2, 2.6, 20]} /><meshStandardMaterial color={C.concrete} flatShading /></mesh>
      <mesh position={[0, 11.65, 0]} castShadow><coneGeometry args={[3.3, 0.6, 20]} /><meshStandardMaterial color={C.concrete2} /></mesh>
      <mesh position={[0, 10.2, 0]}><torusGeometry args={[2.75, 0.08, 6, 30]} /><meshStandardMaterial color={C.blue} /></mesh>
    </group>
  )
}

function Substation() {
  return (
    <group position={[SUB[0], 0, SUB[1]]}>
      <mesh rotation-x={-Math.PI / 2} position={[0, 0.02, 0]} receiveShadow><planeGeometry args={[9, 7]} /><meshStandardMaterial color="#C9D0D7" /></mesh>
      {[-2, 1.6].map((x) => (
        <group key={x} position={[x, 0, 0]}>
          <mesh position={[0, 1.1, 0]} castShadow><boxGeometry args={[2.2, 2.2, 1.6]} /><meshStandardMaterial color="#A9B4BF" /></mesh>
          {[-0.6, 0, 0.6].map((bx) => <mesh key={bx} position={[bx, 2.6, 0]} castShadow><cylinderGeometry args={[0.1, 0.14, 0.8, 8]} /><meshStandardMaterial color="#E9ECEF" /></mesh>)}
          {[-0.75, -0.45, -0.15, 0.15, 0.45, 0.75].map((fz) => <mesh key={fz} position={[1.12, 1.1, fz]}><boxGeometry args={[0.06, 1.8, 0.14]} /><meshStandardMaterial color="#8C98A4" /></mesh>)}
        </group>
      ))}
      {Array.from({ length: 13 }, (_, i) => -4.5 + i * 0.75).map((x) => <mesh key={x} position={[x, 0.7, 3.4]}><boxGeometry args={[0.05, 1.4, 0.05]} /><meshStandardMaterial color={C.steel} /></mesh>)}
      <mesh position={[0, 1.3, 3.4]}><boxGeometry args={[9, 0.04, 0.04]} /><meshStandardMaterial color={C.steel} /></mesh>
      <SignText position={[0, 1.0, 3.45]} w={2.6} h={0.42} text="FEEDER 3" bg="#D69A2D" />
    </group>
  )
}

// Poles along the north pavement: substation → pump station → across to the hospital.
const POLES = [[-22, -4.9], [-12, -4.9], [-6.5, -4.9], [8, -4.9], [18, -4.9], [24, 4.9]]
function PowerLine({ phase, since }) {
  const [tone, setTone] = useState('#59636E')
  useFrame(() => {
    let c = '#59636E'
    if (phase === 'rank') c = '#D69A2D'
    if (phase === 'restart') c = since() < 4.2 ? (Math.floor(since() * 3) % 2 ? '#D69A2D' : '#F0C36B') : '#38A673'
    if (c !== tone) setTone(c)
  })
  const tops = POLES.map(([x, z]) => [x, 6.2, z])
  return (
    <group>
      {POLES.map(([x, z]) => (
        <group key={x} position={[x, 0, z]}>
          <mesh position={[0, 3.2, 0]} castShadow><cylinderGeometry args={[0.1, 0.14, 6.4, 8]} /><meshStandardMaterial color="#8C8F93" /></mesh>
          <mesh position={[0, 6.1, 0]}><boxGeometry args={[0.1, 0.1, 1.4]} /><meshStandardMaterial color="#8C8F93" /></mesh>
        </group>
      ))}
      <Line points={[[SUB[0] + 2, 3, SUB[1] + 1], ...tops]} color={tone} lineWidth={tone === '#59636E' ? 1.4 : 3.2} />
      <Line points={[[-6.5, 6.2, -4.9], [PUMP[0] - 2.5, 4.8, PUMP[1] + 1]]} color={tone} lineWidth={tone === '#59636E' ? 1.4 : 3.2} />
    </group>
  )
}

function Hospital() {
  return (
    <group position={[HOSPITAL[0], 0, HOSPITAL[1]]} rotation-y={Math.PI}>
      <mesh position={[0, 3, 0]} castShadow receiveShadow><boxGeometry args={[11, 6, 7]} /><meshStandardMaterial color={C.white} flatShading /></mesh>
      <mesh position={[0, 6.15, 0]}><boxGeometry args={[11.4, 0.3, 7.4]} /><meshStandardMaterial color="#C6D3DF" /></mesh>
      <mesh position={[0, 2.0, 3.52]}><boxGeometry args={[11.02, 0.35, 0.04]} /><meshStandardMaterial color={C.blue} /></mesh>
      {[-4, -2, 2, 4].map((wx) => [1.2, 4.2].map((wy) => (
        <mesh key={wx + '-' + wy} position={[wx, wy, 3.52]}><boxGeometry args={[1.3, 1.0, 0.05]} /><meshStandardMaterial color="#BCD3E6" emissive="#BCD3E6" emissiveIntensity={0.15} /></mesh>
      )))}
      <mesh position={[0, 1.2, 3.52]}><boxGeometry args={[2.2, 2.4, 0.06]} /><meshStandardMaterial color="#9FB8CF" /></mesh>
      <mesh position={[0, 2.8, 4.2]} castShadow><boxGeometry args={[4, 0.18, 1.6]} /><meshStandardMaterial color="#C6D3DF" /></mesh>
      <SignText position={[0, 5.1, 3.54]} w={5.6} h={0.7} text="DISTRICT HOSPITAL" bg="#2A5F92" />
      <group position={[4.4, 6.9, 0]}>
        <mesh><boxGeometry args={[1.6, 1.6, 0.3]} /><meshStandardMaterial color="#FFFFFF" /></mesh>
        <mesh position={[0, 0, 0.17]}><boxGeometry args={[1.0, 0.3, 0.04]} /><meshStandardMaterial color={C.blue} /></mesh>
        <mesh position={[0, 0, 0.17]}><boxGeometry args={[0.3, 1.0, 0.04]} /><meshStandardMaterial color={C.blue} /></mesh>
      </group>
    </group>
  )
}

// A distant pump station with the same VT-150 pump, shown when the procedure is shared.
function MiniStation({ at, lit }) {
  return (
    <group position={[at[0], 0, at[1]]}>
      <mesh rotation-x={-Math.PI / 2} position={[0, 0.02, 0]}><circleGeometry args={[7, 28]} /><meshStandardMaterial color="#D3DAE0" /></mesh>
      <mesh position={[0, 2, 0]} castShadow><boxGeometry args={[6, 4, 4.4]} /><meshStandardMaterial color={C.concrete} flatShading /></mesh>
      <mesh position={[0, 4.15, 0]}><boxGeometry args={[6.4, 0.3, 4.8]} /><meshStandardMaterial color={lit ? '#9FD3B8' : C.concrete2} /></mesh>
      <mesh position={[5, 2, 0]} castShadow><cylinderGeometry args={[2, 2, 4, 24]} /><meshStandardMaterial color="#D7E3EC" /></mesh>
    </group>
  )
}

function Trees() {
  const spots = useMemo(() => [[-34, -4.8], [-18, -4.9], [14, -5], [34, -4.9], [46, -4.9], [-40, 4.9], [-30, 4.9], [-19, 4.9], [4, 4.9], [12, 4.9], [34, 4.9], [44, 4.9], [-8, -14], [16, -15], [-20, -16], [30, 18], [-14, 15]], [])
  return spots.map(([x, z], i) => (
    <group key={i} position={[x, 0, z]}>
      <mesh position={[0, 0.8, 0]} castShadow><cylinderGeometry args={[0.12, 0.16, 1.6, 6]} /><meshStandardMaterial color="#8C7462" /></mesh>
      <mesh position={[0, 2.1, 0]} castShadow><icosahedronGeometry args={[1.0, 0]} /><meshStandardMaterial color={i % 2 ? '#8FB38A' : '#A3C29B'} flatShading /></mesh>
    </group>
  ))
}

/* ---------------- characters ---------------- */

function Limb({ r = 0.085, len = 0.62, color }) {
  return <mesh position={[0, -len / 2, 0]} castShadow><capsuleGeometry args={[r, len - 2 * r, 4, 8]} /><meshStandardMaterial color={color} /></mesh>
}

function Person({ position, rotation = 0, skin, top, bottom, hair, pose = 'idle', hat, bun, saree }) {
  const root = useRef(), head = useRef(), aL = useRef(), aR = useRef(), phone = useRef()
  useFrame((s) => {
    const t = s.clock.getElapsedTime()
    let body = 0, hy = 0, hx = 0, al = 0.05, ar = 0.05, alz = 0.08, arz = -0.08
    if (pose === 'idle') { body = Math.sin(t * 2) * 0.01 }
    if (pose === 'phone') { ar = -1.9; arz = 0.18; hx = 0.14; body = Math.sin(t * 2) * 0.01 }
    if (pose === 'turn') { al = -1.35 + Math.sin(t * 5) * 0.12; ar = -1.35 - Math.sin(t * 5) * 0.12; alz = 0.22; arz = -0.22; hx = 0.18 }
    if (pose === 'point') { ar = -1.6; arz = -0.4; hy = 0.3 }
    if (pose === 'worried') { al = -2.2; ar = -2.2; alz = 0.7; arz = -0.7; hy = Math.sin(t * 1.5) * 0.25 }
    if (pose === 'happy') { body = Math.abs(Math.sin(t * 5)) * 0.12; al = -2.6; ar = -2.6; alz = 0.4; arz = -0.4 }
    if (pose === 'wave') { ar = -2.6 + Math.sin(t * 6) * 0.25; arz = -0.5 }
    root.current.position.y = body
    head.current.rotation.set(hx, hy, 0)
    aL.current.rotation.set(al, 0, alz); aR.current.rotation.set(ar, 0, arz)
    if (phone.current) phone.current.material.emissiveIntensity = 0.8 + Math.sin(t * 4) * 0.3
  })
  return (
    <group position={position} rotation-y={rotation}>
      <group ref={root}>
        {saree
          ? <mesh position={[0, 0.5, 0]} castShadow><cylinderGeometry args={[0.24, 0.34, 1.0, 12]} /><meshStandardMaterial color={bottom} /></mesh>
          : [-0.13, 0.13].map((x) => <group key={x} position={[x, 0.86, 0]}><Limb r={0.1} len={0.86} color={bottom} /></group>)}
        <mesh position={[0, 1.18, 0]} castShadow><capsuleGeometry args={[0.24, 0.34, 4, 10]} /><meshStandardMaterial color={top} /></mesh>
        {saree && <mesh position={[0.05, 1.22, 0.02]} rotation-z={0.6}><boxGeometry args={[0.16, 0.7, 0.5]} /><meshStandardMaterial color={bottom} /></mesh>}
        <group ref={aL} position={[-0.33, 1.42, 0]}><Limb color={top} /><mesh position={[0, -0.64, 0]}><sphereGeometry args={[0.08, 8, 8]} /><meshStandardMaterial color={skin} /></mesh></group>
        <group ref={aR} position={[0.33, 1.42, 0]}>
          <Limb color={top} /><mesh position={[0, -0.64, 0]}><sphereGeometry args={[0.08, 8, 8]} /><meshStandardMaterial color={skin} /></mesh>
          {pose === 'phone' && <mesh ref={phone} position={[0, -0.66, 0.06]} rotation-x={1.9}><boxGeometry args={[0.13, 0.24, 0.025]} /><meshStandardMaterial color="#222" emissive="#9FD0FF" emissiveIntensity={0.9} /></mesh>}
        </group>
        <group ref={head} position={[0, 1.72, 0]}>
          <mesh castShadow><sphereGeometry args={[0.22, 20, 16]} /><meshStandardMaterial color={skin} roughness={0.7} /></mesh>
          {[-0.075, 0.075].map((ex) => <mesh key={ex} position={[ex, 0.03, 0.2]}><sphereGeometry args={[0.03, 8, 8]} /><meshBasicMaterial color="#1D2228" /></mesh>)}
          <mesh position={[0, -0.085, 0.205]} rotation-z={pose === 'worried' ? 0 : Math.PI}><torusGeometry args={[0.04, 0.012, 6, 12, Math.PI]} /><meshBasicMaterial color="#5A2E32" /></mesh>
          {hat ? (
            <>
              <mesh position={[0, 0.07, 0]} castShadow><sphereGeometry args={[0.245, 16, 12, 0, Math.PI * 2, 0, Math.PI / 2]} /><meshStandardMaterial color={hat} /></mesh>
              <mesh position={[0, 0.07, 0]}><cylinderGeometry args={[0.32, 0.32, 0.03, 18]} /><meshStandardMaterial color={hat} /></mesh>
            </>
          ) : (
            <>
              <mesh position={[0, 0.05, -0.03]}><sphereGeometry args={[0.235, 16, 12, 0, Math.PI * 2, 0, Math.PI / 2.2]} /><meshStandardMaterial color={hair} /></mesh>
              {bun && <mesh position={[0, 0.02, -0.22]}><sphereGeometry args={[0.1, 10, 10]} /><meshStandardMaterial color={hair} /></mesh>}
            </>
          )}
        </group>
      </group>
    </group>
  )
}

const RAVI = { skin: '#B98462', top: '#7FA9D1', bottom: '#2E3D4D', hair: C.hair, hat: '#F2F4F6' }
const LAKSHMI_P = { skin: '#C99273', top: '#E7D3C3', bottom: '#2E8A83', hair: C.hair, bun: true, saree: true }
const MEENA = { skin: '#C08C6A', top: '#9BBBD8', bottom: '#2E3D4D', hair: C.hair, bun: true, hat: '#F2F4F6' }

// Who stands where in each step.
function Cast({ phase: p }) {
  const lakshmiPose = p === 'report' ? 'phone' : p === 'warn' ? 'phone' : p === 'flowing' ? 'happy' : 'idle'
  const lakshmiAt = ['report', 'warn', 'flowing', 'closed', 'rank', 'identify'].includes(p)
  let ravi = null
  if (['onsite'].includes(p)) ravi = { at: [-0.6, 0, -5.8], rot: 0.1, pose: 'worried' }
  if (p === 'stabilize') ravi = { at: [VALVE[0], 0, -6.6], rot: Math.PI, pose: 'turn' }
  if (p === 'rebuild') ravi = { at: [-0.6, 0, -5.8], rot: 0.2, pose: 'phone' }
  if (['validate', 'train', 'authorize'].includes(p)) ravi = { at: [-0.6, 0, -5.8], rot: 0.15, pose: 'phone' }
  if (p === 'restart') ravi = { at: [PANEL[0], 0, -5.45], rot: Math.PI, pose: 'turn' }
  if (p === 'flowing') ravi = { at: [-0.6, 0, -5.6], rot: 0.2, pose: 'happy' }
  if (['share', 'closed'].includes(p)) ravi = { at: [-1.2, 0, -5.6], rot: 0.25, pose: 'wave' }
  return (
    <>
      {lakshmiAt && <Person position={[LK[0], 0, LK[1]]} rotation={Math.PI} {...LAKSHMI_P} pose={lakshmiPose} />}
      {ravi && <Person position={ravi.at} rotation={ravi.rot} {...RAVI} pose={ravi.pose} />}
      {['share', 'closed'].includes(p) && <Person position={[0.4, 0, -5.5]} rotation={-0.2} {...MEENA} pose="idle" />}

      {p === 'report' && <Bubble at={[LK[0], 2.1, LK[1]]} delay={500}>“The pump’s been silent since dawn.”</Bubble>}
      {p === 'onsite' && <Bubble at={[-0.6, 2.5, -5.8]} tone="warn" delay={400}>“Both my seniors are gone. I’ve never run it alone.”</Bubble>}
      {p === 'stabilize' && <Bubble at={[VALVE[0], 2.6, -6.6]} tone="good" delay={2700}>“Valve closed. The level’s holding.”</Bubble>}
      {p === 'train' && <Bubble at={[-0.6, 2.5, -5.8]} delay={400}>“Inlet first, then the pump. Got it.”</Bubble>}
      {p === 'flowing' && <Bubble at={[LK[0], 2.5, LK[1]]} tone="good" delay={900}>“The taps are running!”</Bubble>}
      {p === 'closed' && <Bubble at={[-0.4, 2.6, -5.6]} tone="good" delay={500}>“Now two of us know how.”</Bubble>}
    </>
  )
}

function Bubble({ at, children, tone, delay = 0 }) {
  const [on, setOn] = useState(false)
  useEffect(() => { const t = setTimeout(() => setOn(true), delay); return () => clearTimeout(t) }, [delay])
  const bg = tone === 'warn' ? '#FBF0DA' : tone === 'good' ? '#DFF2E8' : '#FFFFFF'
  const fg = tone === 'warn' ? '#7A4F0C' : tone === 'good' ? '#1E6E4A' : '#1C2B3A'
  return (
    <Html position={at} center zIndexRange={[20, 10]} pointerEvents="none">
      <div style={{ transform: `translateY(-40px) scale(${on ? 1 : 0.5})`, opacity: on ? 1 : 0, transition: 'all .35s cubic-bezier(.2,1.4,.4,1)', background: bg, color: fg, padding: '10px 14px', borderRadius: 16, fontFamily: '"Plus Jakarta Sans", sans-serif', fontWeight: 700, fontSize: 15, whiteSpace: 'nowrap', boxShadow: '0 12px 28px -12px rgba(24,52,79,.5)', position: 'relative' }}>
        {children}
        <span style={{ position: 'absolute', left: '50%', bottom: -6, width: 12, height: 12, background: bg, transform: 'translateX(-50%) rotate(45deg)' }} />
      </div>
    </Html>
  )
}

/* ---------------- overlays ---------------- */

function Tag({ at, children, tone = 'light', delay = 0, size = 14 }) {
  const [on, setOn] = useState(false)
  useEffect(() => { const t = setTimeout(() => setOn(true), delay); return () => clearTimeout(t) }, [delay])
  const S = {
    light: ['#FFFFFF', '#1C2B3A'], red: ['#CC4C44', '#FFFFFF'], amber: ['#D69A2D', '#FFFFFF'], green: ['#2E9A6A', '#FFFFFF'],
    blue: ['#2A5F92', '#FFFFFF'], violet: ['#6C63B5', '#FFFFFF'],
  }[tone]
  return (
    <Html position={at} center zIndexRange={[20, 10]} pointerEvents="none">
      <div style={{ opacity: on ? 1 : 0, transform: `translateY(${on ? 0 : 8}px)`, transition: 'all .4s ease', background: S[0], color: S[1], fontFamily: '"Plus Jakarta Sans", sans-serif', fontWeight: 700, fontSize: size, padding: '6px 11px', borderRadius: 10, whiteSpace: 'nowrap', boxShadow: '0 10px 22px -10px rgba(24,52,79,.55)' }}>{children}</div>
    </Html>
  )
}

function Ring({ at, max = 40, color = C.blue, period = 2.4, y = 0.06 }) {
  const m = useRef()
  useFrame((s) => {
    const k = (s.clock.getElapsedTime() % period) / period
    m.current.scale.setScalar(1 + k * max); m.current.material.opacity = 0.65 * (1 - k)
  })
  return (
    <mesh ref={m} position={[at[0], y, at[1]]} rotation-x={-Math.PI / 2}>
      <ringGeometry args={[0.9, 1, 64]} /><meshBasicMaterial color={color} transparent depthWrite={false} />
    </mesh>
  )
}

// A dependency or sharing arc with a dot travelling along it.
function Arc({ from, to, color = C.blue, h = 10, i = 0, y0 = 4, y1 = 4, width = 3, speed = 0.5 }) {
  const dot = useRef()
  const curve = useMemo(() => new THREE.QuadraticBezierCurve3(new THREE.Vector3(from[0], y0, from[1]), new THREE.Vector3((from[0] + to[0]) / 2, h, (from[1] + to[1]) / 2), new THREE.Vector3(to[0], y1, to[1])), [from, to, h, y0, y1])
  useFrame((s) => { const k = ((s.clock.getElapsedTime() * speed + i * 0.33) % 1); dot.current.position.copy(curve.getPoint(k)) })
  return (
    <>
      <QuadraticBezierLine start={curve.v0} mid={curve.v1} end={curve.v2} color={color} lineWidth={width} dashed dashSize={0.9} gapSize={0.6} />
      <mesh ref={dot}><sphereGeometry args={[0.45, 12, 12]} /><meshBasicMaterial color={color} /></mesh>
    </>
  )
}

// Water pulses running from the tank, down the main, along the road to the homes.
const FLOW_PATH = [[8.5, 0.5, -7.6], [11.6, 0.5, -7.6], [11.6, 0.5, -2.6], [-30, 0.5, -2.6]]
const FLOW_PATH2 = [[11.6, 0.5, -2.6], [11.6, 0.5, 3], [24, 0.5, 3]]
function Flow({ path, n = 26, speed = 0.18 }) {
  const refs = useRef([])
  const curve = useMemo(() => new THREE.CatmullRomCurve3(path.map((p) => new THREE.Vector3(...p)), false, 'catmullrom', 0.01), [path])
  useFrame((s) => {
    const t = s.clock.getElapsedTime()
    refs.current.forEach((m, i) => { if (m) m.position.copy(curve.getPoint(((t * speed) + i / n) % 1)) })
  })
  return Array.from({ length: n }, (_, i) => (
    <mesh key={i} ref={(el) => (refs.current[i] = el)}><sphereGeometry args={[0.26, 10, 10]} /><meshBasicMaterial color="#4E9BD6" transparent opacity={0.9} /></mesh>
  ))
}

// Knowledge sources flying in from around the station and merging above it.
function Sources() {
  const items = [
    ['Manufacturer manual', [-6, 6.5, -4], 0], ['Maintenance records', [6, 7, -4], 500], ['Sensor history', [-4, 8.6, -8], 1000], ['Logbook p. 112', [5, 9, -9], 1600],
  ]
  return (
    <>
      {items.map(([label, at, d]) => <Tag key={label} at={at} tone="violet" delay={d} size={13}>{label}</Tag>)}
      <Tag at={[0, 11.2, -7]} tone="light" delay={2400} size={14}>Restart procedure · 6 steps · 62% confidence</Tag>
    </>
  )
}

function Effects({ phase: p, since }) {
  return (
    <>
      {['report', 'identify'].includes(p) && <Ring at={[PUMP[0], PUMP[1]]} max={5} color={C.red} period={1.8} y={0.08} />}
      {p === 'report' && <>
        <Tag at={[PUMP[0], 6.6, PUMP[1]]} tone="red">Silent since 07:40 · no operator</Tag>
        <Ring at={LK} max={1.4} color={C.blue} period={1.4} y={2.0} />
      </>}
      {p === 'identify' && <>
        <Tag at={[PANEL[0], 2.9, PANEL[1]]} tone="blue">Nameplate read · VT-150 vertical turbine pump</Tag>
      </>}
      {p === 'rank' && <>
        <Tag at={[TANK[0], 8.4, TANK[1]]} tone="red" size={15}>18 h of water left</Tag>
        <Tag at={[HOSPITAL[0], 10.6, HOSPITAL[1]]} tone="light" size={13}>Hospital</Tag>
        <Tag at={[SUB[0] + 4, 6.6, SUB[1]]} tone="amber" size={13}>Feeder 3</Tag>
        <Arc from={PUMP} to={[HOSPITAL[0], HOSPITAL[1]]} color={C.blue} h={12} />
        <Arc from={PUMP} to={[-24, 8]} color={C.blue} h={10} i={1} y1={3} />
        <Arc from={PUMP} to={[40, 8]} color={C.blue} h={11} i={2} y1={3} />
        <Ring at={PUMP} max={10} color={C.red} />
      </>}
      {p === 'warn' && <>
        <Ring at={PUMP} max={52} color={C.blue} period={3} />
        <Ring at={[PUMP[0] + 0.01, PUMP[1]]} max={52} color={C.blue} period={3.6} />
        {[[-24, 12], [-14, 12], [8, 12], [40, 12], [48, 12]].map(([x, z], i) => <Tag key={x} at={[x, 5.2, z - 4]} tone="amber" delay={300 + i * 250} size={12}>Store water</Tag>)}
        <Tag at={[HOSPITAL[0], 10.6, HOSPITAL[1]]} tone="amber" delay={600}>Hospital alerted · switch to reserve</Tag>
      </>}
      {p === 'stabilize' && <Tag at={[TANK[0], 6.4, TANK[1]]} tone="green" delay={2700}>Outlet V2 closed · level holding</Tag>}
      {p === 'rebuild' && <Sources />}
      {p === 'validate' && <>
        <Arc from={FAR[2]} to={[0, -8]} color={C.blue} h={26} y0={5} y1={5} speed={0.35} />
        <Html position={[1.4, 2.6, -5.4]} center zIndexRange={[20, 10]} pointerEvents="none">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: '#fff', padding: '8px 12px 8px 8px', borderRadius: 14, boxShadow: '0 14px 30px -14px rgba(24,52,79,.6)', fontFamily: '"Plus Jakarta Sans", sans-serif', whiteSpace: 'nowrap', transform: 'translateY(-60px)' }}>
            <span style={{ width: 34, height: 34, borderRadius: 10, background: '#6C63B5', color: '#fff', display: 'grid', placeItems: 'center', fontWeight: 800, fontSize: 13 }}>SM</span>
            <span><b style={{ fontSize: 14, color: '#1C2B3A' }}>Suresh · on video</b><br /><span style={{ fontSize: 12, color: '#7E8B98' }}>Runs the same VT-150 in Ward 51</span></span>
          </div>
        </Html>
      </>}
      {p === 'train' && <Tag at={[-0.6, 3.5, -5.8]} tone="blue" delay={200}>Tier T2 · guided operation</Tag>}
      {p === 'authorize' && <Tag at={[-0.6, 3.5, -5.8]} tone="amber" delay={300}>Waiting for a human to approve</Tag>}
      {p === 'restart' && <>
        <Tag at={[-6.5, 7.4, -4.9]} tone="amber" delay={300}>Cascade check · Feeder 3 load 64% · OK</Tag>
        <RestartTag since={since} />
      </>}
      {['flowing', 'share', 'closed'].includes(p) && <><Flow path={FLOW_PATH} /><Flow path={FLOW_PATH2} n={10} speed={0.3} /></>}
      {p === 'flowing' && <Tag at={[TANK[0], 6.6, TANK[1]]} tone="green">Running · 210 m³/h</Tag>}
      {p === 'share' && FAR.map((f, i) => (
        <group key={i}>
          <Arc from={PUMP} to={f} color={C.green} h={30} i={i} y0={5} y1={5} width={4} speed={0.4} />
          <Tag at={[f[0], 9, f[1]]} tone="green" delay={900 + i * 400}>{['Ward 12', 'Ward 51', 'Tambaram'][i]} ✓</Tag>
        </group>
      ))}
      {p === 'share' && <Tag at={[PUMP[0], 9, PUMP[1]]} tone="blue" size={13}>PS4 procedure</Tag>}
      {p === 'closed' && <Tag at={[PUMP[0], 7, PUMP[1]]} tone="green" size={15}>Safe · running · 2 trained operators</Tag>}
    </>
  )
}

function RestartTag({ since }) {
  const [s, setS] = useState(0)
  useFrame(() => { const v = since() > 4.2 ? 2 : since() > 1.6 ? 1 : 0; if (v !== s) setS(v) })
  const text = ['Machine Check · inlet pressure 1.2 bar ✓', 'Machine Check · motor temp 41 °C ✓', 'All checks passed · ready to start'][s]
  return <Tag at={[PANEL[0], 3.1, PANEL[1]]} tone={s === 2 ? 'green' : 'blue'}>{text}</Tag>
}

/* ---------------- camera ---------------- */

function CameraRig({ phase }) {
  const look = useRef(new THREE.Vector3(0, 2.2, -8))
  const tPos = useMemo(() => new THREE.Vector3(), []), tLook = useMemo(() => new THREE.Vector3(), [])
  useFrame(({ camera }, dt) => {
    const shot = SHOTS[phase]
    tPos.set(...shot.pos); tLook.set(...shot.look)
    const k = 2.2
    camera.position.x = THREE.MathUtils.damp(camera.position.x, tPos.x, k, dt)
    camera.position.y = THREE.MathUtils.damp(camera.position.y, tPos.y, k, dt)
    camera.position.z = THREE.MathUtils.damp(camera.position.z, tPos.z, k, dt)
    look.current.x = THREE.MathUtils.damp(look.current.x, tLook.x, k + 1, dt)
    look.current.y = THREE.MathUtils.damp(look.current.y, tLook.y, k + 1, dt)
    look.current.z = THREE.MathUtils.damp(look.current.z, tLook.z, k + 1, dt)
    camera.lookAt(look.current)
  })
  return null
}
