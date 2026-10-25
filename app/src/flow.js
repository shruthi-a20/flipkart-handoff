// The story script. Each phase says which screens show, what the audience should notice,
// which Indian systems Handoff is reading at that moment, and what the presenter taps next.
// App.jsx reads this; the screens and 3D scene key off `phase`.

// The five stages of Handoff, in the order the story meets them.
export const STAGES = {
  detect: { label: 'Detect', color: '#7E8B98' },
  triage: { label: 'Triage', color: '#D69A2D' },
  rebuild: { label: 'Rebuild', color: '#6C63B5' },
  act: { label: 'Act', color: '#3C82C4' },
  strengthen: { label: 'Strengthen', color: '#2E9A6A' },
}

// Nine people, one screen each. `role` is the kind of Handoff user they are.
export const ROLES = {
  lakshmi: { name: 'Lakshmi', who: 'resident, Ward 34', role: 'Reporter', initials: 'LK', color: '#C27C5A' },
  console: { name: 'Control room', who: 'district emergency ops', role: 'Coordinator', initials: null, color: '#20486E' },
  hospital: { name: 'Dr Farah', who: 'hospital duty manager', role: 'Dependent site', initials: 'FA', color: '#3C82C4' },
  admin: { name: 'Karthik', who: 'Metrowater IT manager', role: 'Org admin', initials: 'KS', color: '#4A5A6A' },
  ravi: { name: 'Ravi', who: 'junior operator', role: 'Inheritor', initials: 'RK', color: '#2A5F92' },
  suresh: { name: 'Suresh', who: 'operator, Ward 51', role: 'Knowledge holder', initials: 'SM', color: '#6C63B5' },
  officer: { name: 'Anitha R.', who: 'district officer', role: 'Authority holder', initials: 'AR', color: '#2E9A6A' },
  priya: { name: 'Priya', who: 'retired water chemist', role: 'Licensed volunteer', initials: 'PN', color: '#8A5BA8' },
  meena: { name: 'Meena', who: 'second operator', role: 'Backup', initials: 'MS', color: '#2E8A83' },
}
export const CAST = ['lakshmi', 'console', 'hospital', 'admin', 'ravi', 'suresh', 'officer', 'priya', 'meena']

export const SITE = {
  name: 'Pump Station 4',
  ward: 'Ward 34, Chennai',
  model: 'VT-150 vertical turbine pump',
  caseId: 'W34-017',
  people: '40,000',
}

// Hours of stored water left, per phase. Stabilizing at 09:20 stops the drain.
export const WATER = {
  report: '18h 00m', signals: '17h 59m', identify: '17h 58m', rank: '17h 57m', warn: '17h 56m', access: '17h 52m', onsite: '17h 48m', stabilize: '17h 40m',
}

export const PHASES = {
  report: {
    screens: ['lakshmi'], stage: 'detect', clock: '09:00',
    scene: 'The pump house that feeds Ward 34 has gone silent',
    title: 'A resident notices the pump has stopped',
    body: 'Both senior operators vanished in the Snap. Lakshmi lives opposite and reports it in 30 seconds, with no login.',
    data: ['Handoff app · no login'],
    cue: 'Tap “Send report” on Lakshmi’s phone',
  },
  signals: {
    screens: ['console'], stage: 'detect', clock: '09:01',
    scene: 'Her report is not the only sign something is wrong',
    title: 'Three signals, one case',
    body: 'Handoff merges her report with a water-flow sensor reading zero and the pump’s power meter dropping to 0 kW at 07:40.',
    data: ['Jal Jeevan Mission IoT', 'Discom smart meter', 'Resident report'],
    wait: 'Handoff is merging the signals…',
    cue: 'Tap “Identify equipment” in the control room',
  },
  identify: {
    screens: ['console'], stage: 'detect', clock: '09:02',
    scene: 'Handoff reads the pump’s nameplate from her photo',
    title: 'Handoff identifies the exact equipment',
    body: 'It matches the model against the Shared Library: two similar pumps elsewhere, but no verified procedure yet.',
    data: ['Shared Library'],
    wait: 'Handoff is reading the photo…',
    cue: 'Tap “Assess risk” in the control room',
  },
  rank: {
    screens: ['console'], stage: 'triage', clock: '09:03',
    scene: 'What happens if nobody steps in?',
    title: 'Countdown to harm: 18 hours of water left',
    body: 'Infrastructure maps show the hospital shares the pump’s power feeder, a link nobody wrote down. It goes to the top of the board.',
    data: ['PM Gati Shakti', 'NDEM (NRSC)', 'Census ward data'],
    cue: 'Tap “Send early warning” in the control room',
  },
  warn: {
    screens: ['lakshmi', 'hospital'], lead: 'hospital', stage: 'triage', clock: '09:04',
    scene: 'Everyone who depends on the pump is warned at once',
    title: 'Early warning: homes and the hospital get time to prepare',
    body: 'A cell broadcast reaches every phone in the ward. The hospital is told which of its systems depend on this pump.',
    data: ['NDMA SACHET', 'Cell Broadcast'],
    cue: 'Tap “Switch to reserve water” on the hospital’s phone',
  },
  access: {
    screens: ['admin'], stage: 'triage', clock: '09:08',
    scene: 'Metrowater’s records are locked, and the admin vanished',
    title: 'Admin access: positions, not people',
    body: 'Admin rights pass down Metrowater’s order of succession to Karthik, with the district as second approver. He decides who sees what.',
    data: ['Metrowater SCADA', 'SAP PM', 'HRMS', 'Document store'],
    wait: 'Connecting systems, read-only…',
    cue: 'Tap “Approve read-only access” on Karthik’s console',
  },
  onsite: {
    screens: ['ravi'], stage: 'triage', clock: '09:12',
    scene: 'Ravi, the junior operator, is the only one left',
    title: 'Ravi inherits a system he never ran alone',
    body: 'Handoff starts with the person already there. His ID is checked against Aadhaar and the staff records Karthik just opened.',
    data: ['Aadhaar eKYC', 'Metrowater HRMS'],
    cue: 'Tap “Verify with Aadhaar OTP” on Ravi’s phone',
  },
  stabilize: {
    screens: ['ravi'], stage: 'triage', clock: '09:20',
    scene: 'Make it safe first: close the outlet valve',
    title: 'Stabilize first, fix later',
    body: 'A Stabilize Card gives safe, reversible steps anyone can follow (Tier T1). The tank’s own sensor confirms the drain has stopped.',
    data: ['Tank level sensor · SCADA'],
    cue: 'Tap “Done” on step 1, then “Mark system safe”',
  },
  rebuild: {
    screens: ['ravi'], stage: 'rebuild', clock: '10:05',
    scene: 'Rebuilding what the senior operators knew',
    title: 'AI rebuilds the restart procedure',
    body: 'From the manual, 14 work orders, 90 days of sensor history and the logbook. Every step is labelled verified, inferred or unknown.',
    data: ['Manufacturer manual', 'SAP PM work orders', 'SCADA history', 'Logbook scan'],
    cue: 'Tap “Scan logbook page”, then send it for review',
  },
  validate: {
    screens: ['suresh'], stage: 'rebuild', clock: '11:00',
    scene: 'An operator at an identical station checks it remotely',
    title: 'A knowledge holder fills the gap and verifies it',
    body: 'Suresh runs the same VT-150 in Ward 51. He can see only this procedure, adds the missing value and confirms the inferred steps.',
    data: ['Shared Library', 'Metrowater HRMS'],
    cue: 'Tap “Add 70 °C”, then “Approve procedure”',
  },
  train: {
    screens: ['ravi'], stage: 'act', clock: '11:40',
    scene: 'Ravi learns the one thing he must not get wrong',
    title: 'Tier T2: short training before guided operation',
    body: 'Restarting a pump is routine but not trivial, so Ravi watches a 90-second clip and answers one safety question.',
    data: ['Shared Library'],
    cue: 'Pick the right answer on Ravi’s phone',
  },
  authorize: {
    screens: ['officer', 'ravi'], lead: 'officer', stage: 'act', clock: '12:00',
    scene: 'A human grants permission. AI never does',
    title: 'Limited, expiring authority to act',
    body: 'The district officer sees the ID check, quiz and expert sign-off, and grants Ravi 24 hours for this one task.',
    data: ['Disaster Management Act, 2005'],
    cue: 'Tap “Grant 24 h authority” on the officer’s phone',
  },
  restart: {
    screens: ['ravi'], stage: 'act', clock: '14:00',
    scene: 'Step by step, the machine checks the work',
    title: 'Guided restart with Machine Check',
    body: 'Each step unlocks only when the pump’s sensors confirm the last one. A Cascade Warning checks the hospital’s feeder first.',
    data: ['SCADA live', 'Discom feeder load'],
    wait: 'Machine Check is confirming each step…',
    cue: 'Tap “Start pump” on Ravi’s phone',
  },
  chlorine: {
    screens: ['console'], stage: 'act', clock: '14:08',
    scene: 'The pump runs, but the water isn’t safe to drink yet',
    title: 'A Tier T4 task, and no licensed person left',
    body: 'Chlorine is 0.0 mg/L, so supply to homes is held. Dosing needs a licensed chemist; both of the ward’s vanished. Handoff searches.',
    data: ['Chlorine sensor', 'e-Shram', 'DigiLocker', 'IDRN'],
    wait: 'Searching for licensed people nearby…',
    cue: 'Tap “Request emergency licence” in the control room',
  },
  licence: {
    screens: ['priya', 'officer'], lead: 'officer', stage: 'act', clock: '14:20',
    scene: 'Priya, a retired water chemist, says yes',
    title: 'An emergency licence, with two approvers',
    body: 'Her licence lapsed in 2024. Metrowater and the district both approve a temporary one: this task only, until 22:00, supervised.',
    data: ['DigiLocker', 'Aadhaar eKYC'],
    cue: 'Tap “Grant emergency licence” on the officer’s phone',
  },
  dose: {
    screens: ['priya'], stage: 'act', clock: '14:50',
    scene: 'Licensed hands, rebuilt steps, a sensor watching',
    title: 'Chlorinated, and confirmed by the sensor',
    body: 'Priya follows the dosing steps rebuilt from the chlorinator’s logs. Water is released only when chlorine reads above 0.2 mg/L.',
    data: ['Chlorine sensor', 'Dosing log'],
    wait: 'Machine Check is reading the chlorine sensor…',
    cue: 'Tap “Release supply to homes” on Priya’s phone',
  },
  flowing: {
    screens: ['ravi', 'lakshmi'], lead: 'ravi', stage: 'act', clock: '15:10',
    scene: 'Safe water flows to Ward 34 again',
    title: 'Running again, six hours after the report',
    body: 'The countdown never ran out. Residents are told the supply is back and safe.',
    data: ['Jal Jeevan Mission IoT', 'NDMA SACHET'],
    cue: 'Tap “Close task” on Ravi’s phone',
  },
  backup: {
    screens: ['meena'], stage: 'strengthen', clock: '16:30',
    scene: 'Rule of Two: Meena runs it while Ravi watches',
    title: 'A backup, so it never depends on one person again',
    body: 'Meena takes the same clip and quiz, then does a shadow run. Machine Check confirms her steps and Ravi signs her off.',
    data: ['SCADA live', 'Shared Library'],
    wait: 'Machine Check is confirming Meena’s steps…',
    cue: 'Tap “Finish shadow run” on Meena’s phone',
  },
  share: {
    screens: ['console'], stage: 'strengthen', clock: '16:45',
    scene: 'What Ravi learned now reaches every identical pump',
    title: 'Verified once, shared everywhere',
    body: 'The procedure joins the Shared Library. Ward 12’s pump has no operator at all, so its case opens with the fix already attached.',
    data: ['Shared Library', '3 utilities'],
    cue: 'Tap “Share with 3 stations” in the control room',
  },
  audit: {
    screens: ['admin'], stage: 'strengthen', clock: '17:00',
    scene: 'Nothing granted today is permanent',
    title: 'Every action logged, every permission expiring',
    body: 'Karthik sees who did what and who approved it. Authority, licences and data access all end on their own; custody ends if the original operators return.',
    data: ['Handoff audit log'],
    cue: 'Tap “Close case” on Karthik’s console',
  },
  closed: {
    screens: ['console'], stage: 'strengthen', clock: '17:05',
    scene: 'Ward 34 has safe water, and two people who know how',
    title: 'Case closed: safe before the countdown ran out',
    body: 'Nine people, a dozen systems India already runs, one pump. Made safe 20 minutes after the report and never again dependent on one person.',
    data: [],
    cue: 'Story complete. One pump, no expert on site, no harm done.',
  },
}

export const STORY = Object.keys(PHASES)
STORY.forEach((p, i) => { PHASES[p].n = i + 1 })
export const after = (phase, p) => STORY.indexOf(phase) >= STORY.indexOf(p)
