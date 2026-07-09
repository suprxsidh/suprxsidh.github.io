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
9. ⏳ USER REVIEW of solar system → then `git push origin main` to deploy (commits ec3a79f, f39055c, b8119e5, b3afb9b, 69cf380 local-only, NOT pushed)
10. ⬜ Possible tuning after review: orbit speeds, moon label sizes, nebula strength

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
- Background: python http.server instances may still be running on ports 8753/8761/8762/8763 — kill on wrapup.
