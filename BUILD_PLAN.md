# BUILD_PLAN — portfolio solar system

Portfolio rethemed from flat constellation to an interactive solar system: sun = "Suprasidh", 4 category planets (Experience, Projects, Education, Skills), 16 item moons. Galaxy backdrop (starfield + nebula) from earlier today stays.

## Build order
1. ✅ Galaxy retheme: one-word name, Space Grotesk, starfield/nebula, halo-banding + label-contrast fixes — DEPLOYED (live at suprxsidh.github.io)
2. ✅ data.js restructure: PLANETS array, orbit params per node, 2 new education moons (DPS South 98.2% Class 12, National Hill View 96.4% Class 10)
3. ✅ scene.js solar system: pivot hierarchy, tilted ecliptic, live orbits, pause-on-focus, moon/edge reveal, sun point light + corona
4. ✅ Panel/main wiring: closePanel(silent), toggle label "Solar system", hint "click a planet"
5. ✅ Verified end-to-end in browser (sun/planet/moon click, bg-click reset, list mode, schools, no console errors)
6. ✅ Tuning pass 1 on feedback: inner-planet colors per category (Mars/Earth/Mercury/Venus), per-moon shade variation within each family, incl widened to 8-18° mixed-sign spread (commit b8119e5, local-only)
7. ✅ Tuning pass 2 on feedback: education+skills moved to inner orbits, experience+projects outer; sun icosahedron detail 1→0 (less spherical, more angular); per-body color-tinted halos + more specular pop so colors read against the nebula bg (commit b3afb9b, local-only)
8. ✅ Tuning pass 3 on feedback: deterministic canvas-painted surface textures per planet type (Mars/Earth/Mercury/Venus) + shared grayscale mottle texture for moons, tinted by each moon's own color (commit 69cf380, local-only)
9. 🔴 BLOCKED — USER REVIEW: user says "nope i dont see this rendered" re: tuning pass 3 (textures). See "Current bug" section below. NOT pushed.
10. ⬜ Possible tuning after review: orbit speeds, moon label sizes, nebula strength

## Current bug: user does not see the textures rendered
Symptom: after tuning pass 3 (commit 69cf380: PLANET_TEXTURES per type +
shared moonTexture, wired as `map`/`bumpMap` on planet/moon materials in
scene.js), agent was told "nope i dont see this rendered". Agent had only
verified via agent-browser screenshots — and only the heavily-zoomed-in
shots clearly showed texture detail (blotches/craters/bands); the
default-camera-distance overview screenshot (`v3_overview.png`, taken
before zooming) barely shows any visible difference from flat color at
that scale. Nothing was verified in the user's own actual browser tab.

Not yet tried / not yet ruled out:
- Confirm which localhost port the user's browser tab is actually on.
  Many stray `python -m http.server` instances are running (8753, 8761,
  8762, 8763, 8770, 8781, 8792) — all serve the live working directory in
  real time (http.server has no caching of its own), so an old port is
  NOT stale content by itself. But Chrome caches the ES module *by URL*
  per the existing hard constraint below — if the user's tab was already
  open on one of the older ports from a previous round, a plain
  refresh (not hard-reload) could still be serving a cached pre-texture
  scene.js from that tab's history. Ask which port/tab they're on, or
  have them hard-reload (Cmd+Shift+R) / open the freshest port (8792)
  in a brand-new tab.
- More likely root cause: the texture effect is real but too subtle at
  the DEFAULT view distance where planets render small on screen — it
  only reads clearly once zoomed in close (confirmed in
  `v3_zoom2.png`/`v3_zoom_skills.png`). If the user is looking at the
  default view and didn't zoom in, "I don't see this" may be literally
  true at that scale, not a caching/render bug. Consider increasing
  blotch/crater size and opacity contrast, or bumpScale, so the effect
  reads at default zoom too — not just on close inspection.
- Lesson for future verification: screenshot the DEFAULT view first and
  confirm the change is visible there before claiming done, don't rely
  only on a zoomed-in shot to prove a texture/detail change landed.

## Hard constraints (do not re-learn)
- Sprite gradient textures (halos, nebula) MUST use steep multi-stop falloff reaching ~0 well inside the radius. Shallow linear tails render as banded gray discs at large sprite scales. Already fixed once; don't regress.
- Star/nebula/dust materials need `fog: false` — FogExp2 swallows them at shell distances.
- `systemGroup.rotation.x` must be POSITIVE (+0.28) to tip the ecliptic disc toward the camera; negative reads edge-on from the elevated camera (0,10,28).
- Space Grotesk has no italic. Display font token is `--display`.
- panel.js `closePanel(silent)`: close-button listener must stay wrapped (`() => closePanel()`) or the MouseEvent becomes a truthy `silent` arg.
- Moon render size = `item.size * 0.72`; moon orbit radius = `planet.size * 0.8 + item.orbit.radius`. Data radii are canonical spacing; the offsets live in scene.js only.
- Chrome caches ES modules hard: new http.server port after every JS edit.
- Canvas has no DOM elements: test clicks by `agent-browser eval` dispatching PointerEvents (`pointermove` first, wait ~400ms for the rAF raycast to set `hovered`, then `pointerdown`+`pointerup` at the same coords). Click the sun first — it pauses orbital motion so later click coords stay valid.

## State
- Deployed: galaxy retheme (b0b8bd1 + docs).
- Local only, unpushed: solar system + 3 tuning passes (ec3a79f, f39055c, b8119e5, b3afb9b, 69cf380). Awaiting user "deploy".
- Background: many python http.server instances running (8753/8761/8762/8763/8770/8781/8792) — all serve the live working dir, 8792 is the most recently started. Kill stragglers on wrapup.
- BLOCKED on: user does not see tuning-pass-3 textures rendered — see "Current bug" section above. Not pushed to origin.
