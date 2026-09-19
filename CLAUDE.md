# Tamamat — Project Instructions

Live online teaching platform for independent teachers running small-group
video classes (capped at 8 students). Cloudflare RealtimeKit (RTK) for
WebRTC/media, Directus for backend/CMS. All three services on Railway.

## Repo map

| Local dir    | GitHub repo             | Railway service | Public URL                    |
|--------------|--------------------------|------------------|--------------------------------|
| `SiteNextly` | `MEET-TAMAMAT/SiteNextly`| SiteNextly       | https://dev.tamamat.com       |
| `ADMIN`      | `MEET-TAMAMAT/admin`     | admin            | https://app.tamamat.com       |
| `DIRECTUS`   | `MEET-TAMAMAT/directus`  | directus         | https://admin.tamamat.com     |

- ADMIN: React + Vite + TypeScript (TailAdmin template). Most active dev happens here.
- SiteNextly: Next.js, student-facing.
- Both ADMIN and SiteNextly share the production Directus backend at `https://admin.tamamat.com`.

## Testing — hard rule

**All RTK/connection/ICE/reconnect behavior must be tested on Railway
staging, never localhost.** Local conditions do not reproduce real
network/WebRTC behavior. Staging: `sitenextly-staging.up.railway.app` /
`admin-staging-5c87.up.railway.app`, both tracking the `wip` branch and
sharing production Directus.

Do not propose "let's test this locally" for anything touching RTK,
signaling, or reconnect logic — push to staging first.

## Branch state

- `wip` branch was created from `backup/wip-20260831` (kept as a dated fallback).
- `stable-e9e9680` tags the last known-good production deploy.
- Before merging `wip` → `main`, these must be reverted/removed first:
  - Revert `removeConsole: false` in `next.config.mjs`
  - Remove the `useTeacherProducerDiagnostics` hook from `StudentRoom.tsx`

## RTK / WebRTC — things already learned the hard way

- `leaveRoom()` must be called before creating a new client on reconnect —
  otherwise you get zombie WebSockets.
- Don't put `participantCount` in a `teacher-hello` broadcast's dependency
  array — it causes rapid-fire calls that hit RTK's 5/sec rate limit (`ERR0013`).
- RTK's public `participantJoined`/`participantLeft` listeners may not fire
  during genuine disconnects — don't rely on them alone for reconnect diagnostics.
- The "WebSocket is already in CLOSING or CLOSED state" / `ERR1200` error
  storm after a teacher reconnect is a confirmed `EventEmitter` listener
  leak inside the RTK SDK itself (not app code) — see project notes for the
  full writeup. No app-level fix exists yet; mitigated with a forced
  `window.location.reload()` after a timeout. Reported to Cloudflare.
- Teacher's `c.self.customParticipantId` can read back `undefined` right
  after join — don't trust the live read-back for anything persisted to
  `localStorage`; pre-seed the CID from the value already passed into the
  join/rejoin API call instead.
- `client.self.setDevice()` synchronously calls `disableTrack()`
  internally before its async `getUserMedia` call resolves — confirmed
  by reading the actual RTK SDK bundle
  (`node_modules/@cloudflare/realtimekit/dist/index.cjs.js`,
  `AudioMediaHandler.setDevice`/`VideoMediaHandler.setDevice`). Any
  `setDevice()` call made after a component has already rendered will
  cause a visible, brief "disabled" flash in any UI bound to that
  track's enabled state. `enableAudio()`/`enableVideo()` alone do NOT
  have this synchronous-disable behavior, so they're safe to call
  unconditionally — `setDevice()` is the one that needs to run behind a
  loading overlay or otherwise hidden from the user.
- A React `useRef` does not survive a page reload/remount — using one
  to mean "have I already done this expensive one-time thing" silently
  breaks on any reload, since the ref resets to its default.
  `sessionStorage`/`localStorage` can work around this, but the better
  fix, when possible, is to check whether the "one-time" work is
  actually redundant with something else that already runs
  unconditionally elsewhere — removing the redundant call beats
  remembering not to repeat it.

## Infra gotchas

- Railway always sets `NODE_ENV=production` regardless of environment name.
  This breaks CORS unless you update it in three places: Directus
  `CORS_ORIGIN`, SiteNextly API routes, and `next.config.mjs` headers.
- `removeConsole: process.env.NODE_ENV === 'production'` in `next.config.mjs`
  strips console logs from staging builds — disable temporarily for any
  diagnostic session, and confirm it's reverted before merging.
- Never trust a process-exit event as ground truth for service state —
  confirm via the actual TCP port instead.

## Monitoring

- Sentry: `organizationSlug: tamamat`, project `javascript-nextjs`.
  - SiteNextly is instrumented; ADMIN partially; DIRECTUS not yet.
  - Use `search_issues` (org-wide listing) and `search_events` with
    `dataset=errors` + explicit timestamp ranges to correlate errors
    against a specific test window.
- Railway MCP IDs:
  - Project: `ee0c9c93-246f-49b6-8c61-3fba63c4b56d`
  - ADMIN service: `a43c5224-1d6a-46a0-b62e-3db7ecf2eb0b`
  - SiteNextly service: `a21e05d3-081e-42b2-b53a-0bf6e387af09`
  - Directus service: `422fb512-c173-43e6-8f88-a2a473f6aec8`
  - Environment: `877171b5-6428-4e08-a3e0-60b2909e0fff`

## How Andy works — apply this to every response

- He reviews every diff before it's applied; nothing gets committed without
  a diff-review step.
- Bugs get diagnosed from logs/observed behavior before touching code;
  reproduce in a test harness before proposing a fix.
- Wants direct, results-oriented answers. Skip circular investigation and
  theories that don't lead to an actionable next step — always end with a
  concrete next step, not just analysis.
- For code changes, prefer checkpoint-style prompts (self-contained,
  tested file contents) over piecemeal instructions.

## Currently open (check before assuming these are fixed)

- Moto G5 Plus overheating (40–47°C within 3–5 min). Leading suspect:
  always-on `getStats()` connection-score polling. Untried levers: codec
  preference (H.264 over VP8), `degradationPreference` via
  `RTCRtpSender.setParameters()`, SVC vs. classic simulcast, canvas
  processing pipelines.
- Mic/border desync (`JAVASCRIPT-NEXTJS-5`): `RTK audioEnabled=true` but
  `selfMuteOverride=true` on rejoin.
