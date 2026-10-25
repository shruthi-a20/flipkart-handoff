# Handoff

**When the Snap took half of humanity, the machines kept running but the people who knew how to run them vanished. Handoff rebuilds that lost know-how and puts it in the hands of whoever is still standing there.**

An interactive story for the Flipkart APM 2029 case (Prompt 2: the day after the Snap). A 3D ward in Chennai plays the story in the centre; the real Handoff screens change on the right for whoever is acting at that moment.

## The story: one silent pump, no expert on site

| Step | Time | Stage | What happens | Screens |
| --- | --- | --- | --- | --- |
| 1 | 09:00 | Detect | Lakshmi, a resident, reports the silent pump house (no login) | Lakshmi |
| 2 | 09:01 | Detect | Handoff reads the nameplate and checks the Shared Library | Control room |
| 3 | 09:03 | Triage | Countdown to harm (18 h of water), 40,000 people, dependency map | Control room |
| 4 | 09:04 | Triage | Early warning to residents, the hospital and schools | Lakshmi |
| 5 | 09:12 | Triage | Ravi, the junior operator left alone, verifies himself | Ravi |
| 6 | 09:20 | Triage | Stabilize Card: close valve V2; the tank sensor confirms it's safe | Ravi |
| 7 | 10:05 | Rebuild | AI rebuilds the restart procedure (verified / inferred / unknown) | Ravi |
| 8 | 11:00 | Rebuild | Suresh, at an identical station, fills the gap and verifies it | Suresh |
| 9 | 11:40 | Act | Tier T2: a 90-second clip and one safety question | Ravi |
| 10 | 12:00 | Act | A district officer grants 24 h, task-only authority | Officer + Ravi |
| 11 | 14:00 | Act | Guided restart; Machine Check confirms each step; Cascade check | Ravi |
| 12 | 14:06 | Act | Water flows; residents are told | Ravi + Lakshmi |
| 13 | 14:15 | Strengthen | Procedure shared with 3 identical stations; backup trained | Control room |
| 14 | 17:00 | Strengthen | Case closed: safe before the countdown ran out | Control room |

## Run it

Requires Node 18 or later.

```bash
cd app
npm install
npm run dev        # http://localhost:5173
npm run build      # static build in app/dist
```

**Presenting:**
- Tap the highlighted control at each step (a "Tap here" hand appears after a moment).
- **▶** autoplays the whole story (about 70 seconds).
- **← / →** (or a slide clicker) step back and forward.
- The stage is 16:9 and scales to any screen.

## Files

- `src/flow.js`: the story script (steps, captions, cues, who's on screen)
- `src/Ward3D.jsx`: the 3D ward, characters, effects and camera shots
- `src/LakshmiPhone.jsx`, `RaviPhone.jsx`, `ExpertPhone.jsx`, `OfficerPhone.jsx`: the four phone apps
- `src/Console.jsx`: the district control room console
- `src/App.jsx`: the stage, layout and step navigation

Tech: React 18 · Vite 5 · Framer Motion · three.js with react-three-fiber and drei. No backend.

> All names, places, equipment models and numbers in the story are fictional demo data.
