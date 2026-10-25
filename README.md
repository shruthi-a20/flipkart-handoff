# Handoff

**When the Snap took half of humanity, the machines kept running but the people who knew how to run them vanished. Handoff rebuilds that lost know-how and puts it in the hands of whoever is still standing there.**

An interactive story for the Flipkart APM 2029 case (Prompt 2: the day after the Snap). A 3D ward in Chennai plays the story in the centre; the real Handoff screens change on the right for whoever is acting at that moment.

## The story: one silent pump, nine people, 21 steps

Each person below is a different kind of Handoff user and gets their own screen. The scene's top-right corner shows which existing Indian system Handoff is reading at that step.

| Step | Time | Stage | What happens | Screen (role) | Data from |
| --- | --- | --- | --- | --- | --- |
| 1 | 09:00 | Detect | Lakshmi reports the silent pump house, no login | Lakshmi (Reporter) | Handoff app |
| 2 | 09:01 | Detect | Three signals merge into one case | Control room (Coordinator) | Jal Jeevan Mission IoT, discom smart meter |
| 3 | 09:02 | Detect | Nameplate read; Shared Library has no verified procedure | Control room | Shared Library |
| 4 | 09:03 | Triage | Countdown to harm; the hospital shares the pump's feeder | Control room | PM Gati Shakti, NDEM, Census |
| 5 | 09:04 | Triage | Cell broadcast to homes; the hospital switches to reserve water | Lakshmi + Dr Farah (Dependent site) | NDMA SACHET, Cell Broadcast |
| 6 | 09:08 | Triage | Admin rights pass by succession; read-only data access; who sees what | Karthik (Org admin) | SCADA, SAP PM, HRMS, document store |
| 7 | 09:12 | Triage | Ravi, the only one left, is verified | Ravi (Inheritor) | Aadhaar eKYC, HRMS |
| 8 | 09:20 | Triage | Stabilize Card (T1); the tank sensor confirms it's safe | Ravi | SCADA tank level |
| 9 | 10:05 | Rebuild | AI rebuilds the restart procedure (verified, inferred, unknown) | Ravi | Manual, SAP PM, SCADA history, logbook |
| 10 | 11:00 | Rebuild | Suresh fills the gap and verifies it, with scoped access | Suresh (Knowledge holder) | Shared Library |
| 11 | 11:40 | Act | Tier T2 clip and safety question | Ravi | Shared Library |
| 12 | 12:00 | Act | A human grants 24 h, task-only authority | Anitha R. (Authority holder) + Ravi | DM Act, 2005 |
| 13 | 14:00 | Act | Guided restart with Machine Check and Cascade Warning | Ravi | SCADA live, feeder load |
| 14 | 14:08 | Act | Chlorine at 0.0 mg/L: a T4 task with no licensed chemist left | Control room | Chlorine sensor, e-Shram, DigiLocker, IDRN |
| 15 | 14:20 | Act | Emergency licence for Priya, two approvers | Priya (Licensed volunteer) + Anitha R. | DigiLocker, Aadhaar eKYC |
| 16 | 14:50 | Act | Priya doses; water is released only above 0.2 mg/L | Priya | Chlorine sensor, dosing log |
| 17 | 15:10 | Act | Safe water reaches homes | Ravi + Lakshmi | JJM IoT, SACHET |
| 18 | 16:30 | Strengthen | Rule of Two: Meena's shadow run, signed off by Ravi | Meena (Backup) | SCADA live |
| 19 | 16:45 | Strengthen | Procedures shared; Ward 12's case opens with the fix attached | Control room | Shared Library |
| 20 | 17:00 | Strengthen | Audit log, expiring permissions, custody record | Karthik (Org admin) | Handoff audit log |
| 21 | 17:05 | Strengthen | Case closed, with outcomes and everyone involved | Control room | |

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
- **▶** autoplays the whole story (about 2 minutes).
- **← / →** (or a slide clicker) step back and forward.
- The stage is 16:9 and scales to any screen.

## Files

- `src/flow.js`: the story script (steps, captions, cues, who's on screen)
- `src/Ward3D.jsx`: the 3D ward, characters, effects and camera shots
- `src/LakshmiPhone.jsx`, `HospitalPhone.jsx`, `RaviPhone.jsx`, `ExpertPhone.jsx`, `OfficerPhone.jsx`, `PriyaPhone.jsx`, `MeenaPhone.jsx`: the phone apps
- `src/Console.jsx`: the district control room console
- `src/AdminConsole.jsx`: the utility admin console (data access, who sees what, audit)
- `src/App.jsx`: the stage, layout and step navigation

Tech: React 18 · Vite 5 · Framer Motion · three.js with react-three-fiber and drei. No backend.

> All names, places, equipment models and numbers in the story are fictional demo data.
