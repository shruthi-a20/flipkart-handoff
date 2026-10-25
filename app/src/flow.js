// The story script. Each phase says which screens show, what the audience should notice,
// and what the presenter taps next. App.jsx reads this; the screens and 3D scene key off `phase`.

// The five stages of Handoff, in the order the story meets them.
export const STAGES = {
  detect: { label: 'Detect', color: '#7E8B98' },
  triage: { label: 'Triage', color: '#D69A2D' },
  rebuild: { label: 'Rebuild', color: '#6C63B5' },
  act: { label: 'Act', color: '#3C82C4' },
  strengthen: { label: 'Strengthen', color: '#2E9A6A' },
}

// Who's who. `screens` in each phase picks one or two of these.
export const ROLES = {
  lakshmi: { label: 'Handoff', who: 'Lakshmi, a resident of Ward 34', initials: 'LK', color: '#C27C5A' },
  ravi: { label: 'Handoff', who: 'Ravi, junior operator left on site', initials: 'RK', color: '#3C82C4' },
  console: { label: 'Control room', who: 'District emergency operations, Chennai', initials: null, color: '#20486E' },
  suresh: { label: 'Handoff Expert', who: 'Suresh, operator at an identical station', initials: 'SM', color: '#6C63B5' },
  officer: { label: 'Handoff Authority', who: 'Anitha R., district emergency officer', initials: 'AR', color: '#2E9A6A' },
}

export const SITE = {
  name: 'Pump Station 4',
  ward: 'Ward 34, Chennai',
  model: 'VT-150 vertical turbine pump',
  caseId: 'W34-017',
  people: '40,000',
}

// Hours of stored water left, per phase. Stabilizing at 09:20 stops the drain.
export const WATER = {
  report: '18h 00m', identify: '17h 59m', rank: '17h 57m', warn: '17h 56m', onsite: '17h 48m', stabilize: '17h 40m',
}

export const PHASES = {
  report: {
    screens: ['lakshmi'], stage: 'detect', clock: '09:00',
    scene: 'The pump house that feeds Ward 34 has gone silent',
    title: 'A resident notices the pump has stopped',
    body: 'Both senior operators vanished in the Snap. Lakshmi lives opposite and reports it in 30 seconds, with no login.',
    cue: 'Tap “Send report” on Lakshmi’s phone',
  },
  identify: {
    screens: ['console'], stage: 'detect', clock: '09:01',
    scene: 'Handoff reads the pump’s nameplate from her photo',
    title: 'Handoff identifies the exact equipment',
    body: 'It matches the model against the Shared Library: two similar pumps elsewhere, but no verified procedure yet.',
    wait: 'Handoff is reading the photo…',
    cue: 'Tap “Assess risk” in the control room',
  },
  rank: {
    screens: ['console'], stage: 'triage', clock: '09:03',
    scene: 'What happens if nobody steps in?',
    title: 'Countdown to harm: 18 hours of water left',
    body: '40,000 people and the district hospital depend on this station. It goes to the top of the Priority Board.',
    cue: 'Tap “Warn residents” in the control room',
  },
  warn: {
    screens: ['lakshmi'], stage: 'triage', clock: '09:04',
    scene: 'Everyone who depends on the pump gets an early warning',
    title: 'Early warning: residents get time to prepare',
    body: 'Homes, the hospital and schools are told before harm begins, through the app, SMS and local broadcasts.',
    cue: 'Tap “Okay, storing water” on Lakshmi’s phone',
  },
  onsite: {
    screens: ['ravi'], stage: 'triage', clock: '09:12',
    scene: 'Ravi, the junior operator, is the only one left',
    title: 'Ravi inherits a system he never ran alone',
    body: 'Handoff starts with the person already there. His ID is checked against staff records in seconds.',
    cue: 'Tap “Verify with OTP” on Ravi’s phone',
  },
  stabilize: {
    screens: ['ravi'], stage: 'triage', clock: '09:20',
    scene: 'Make it safe first: close the outlet valve',
    title: 'Stabilize first, fix later',
    body: 'A Stabilize Card gives safe, reversible steps anyone can follow. The tank’s own sensor confirms the drain has stopped.',
    cue: 'Tap “Done” on step 1, then “Mark system safe”',
  },
  rebuild: {
    screens: ['ravi'], stage: 'rebuild', clock: '10:05',
    scene: 'Rebuilding what the senior operators knew',
    title: 'AI rebuilds the restart procedure',
    body: 'From the manual, maintenance records, sensor history and the station logbook. Every step is labelled by how sure it is.',
    cue: 'Tap “Scan logbook page”, then send it for review',
  },
  validate: {
    screens: ['suresh'], stage: 'rebuild', clock: '11:00',
    scene: 'An operator at an identical station checks it remotely',
    title: 'An expert fills the gaps and verifies it',
    body: 'Suresh runs the same VT-150 model in Ward 51. He adds the missing value and confirms the inferred steps.',
    cue: 'Tap “Add 70 °C”, then “Approve procedure”',
  },
  train: {
    screens: ['ravi'], stage: 'act', clock: '11:40',
    scene: 'Ravi learns the one thing he must not get wrong',
    title: 'Tier T2: short training before guided operation',
    body: 'Restarting a pump is routine but not trivial, so Ravi watches a 90-second clip and answers one safety question.',
    cue: 'Pick the right answer on Ravi’s phone',
  },
  authorize: {
    screens: ['officer', 'ravi'], stage: 'act', clock: '12:00',
    scene: 'A human grants permission. AI never does',
    title: 'Limited, expiring authority to act',
    body: 'The district officer sees the ID check, quiz and expert sign-off, and grants Ravi 24 hours for this one task.',
    cue: 'Tap “Grant 24 h authority” on the officer’s phone',
  },
  restart: {
    screens: ['ravi'], stage: 'act', clock: '14:00',
    scene: 'Step by step, the machine checks the work',
    title: 'Guided restart with Machine Check',
    body: 'Each step unlocks only when the pump’s sensors confirm the last one. A Cascade Warning checks the hospital feeder first.',
    wait: 'Machine Check is confirming each step…',
    cue: 'Tap “Start pump” on Ravi’s phone',
  },
  flowing: {
    screens: ['ravi', 'lakshmi'], stage: 'act', clock: '14:06',
    scene: 'Water flows to Ward 34 again',
    title: 'Running again, five hours after the report',
    body: 'The countdown never ran out. Residents are told the supply is back.',
    cue: 'Tap “Close task” on Ravi’s phone',
  },
  share: {
    screens: ['console'], stage: 'strengthen', clock: '14:15',
    scene: 'What Ravi learned now reaches every identical pump',
    title: 'Verified, shared, and backed up',
    body: 'The procedure joins the Shared Library and is offered to three stations with the same pump. A backup operator is trained.',
    cue: 'Tap “Share with 3 stations” in the control room',
  },
  closed: {
    screens: ['console'], stage: 'strengthen', clock: '17:00',
    scene: 'Ward 34 has water, and a second person who knows how',
    title: 'Case closed: safe before the countdown ran out',
    body: 'Made safe 20 minutes after the report. Never again dependent on one person.',
    cue: 'Story complete. One pump, no expert on site, no harm done.',
  },
}

export const STORY = Object.keys(PHASES)
STORY.forEach((p, i) => { PHASES[p].n = i + 1 })
export const after = (phase, p) => STORY.indexOf(phase) >= STORY.indexOf(p)
