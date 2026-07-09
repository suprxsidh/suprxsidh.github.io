# portfolio-website

Personal portfolio: an interactive 3D solar system — sun = "Suprasidh", planets = categories, moons = items. Specs: `docs/superpowers/specs/2026-07-09-solar-system-design.md` (current), `2026-07-09-galaxy-retheme-design.md`, `2026-07-07-portfolio-constellation-design.md` (historical).

## Constraints
- **No build step.** Plain ES modules; three.js 0.166.1 pinned via CDN import map in `index.html`. Deploys to GitHub Pages by pushing the directory as-is.
- **All content lives in `js/data.js`** (nodes, edges, copy, links). Never hardcode text in scene/panel/list code.
- Design tokens in `css/style.css` `:root`: obsidian #0a0a0c, champagne #c9a86a, ivory #ece4d6. Fonts: Space Grotesk (display, token `--display`, no italic), Instrument Sans (body), Spline Sans Mono (labels/data).
- No em-dashes in user-facing copy (user rule).
- List mode must stay in feature parity with the graph: it renders from the same `data.js` and is the fallback for mobile (<768px), reduced-motion, no-WebGL, and the header toggle. Mode choice persists in `localStorage['view-mode']`.
- `legacy/index-2025.html` = old site, keep frozen. Resume served from `assets/resume.pdf` (copy of "Grad Resume.pdf").

## Working knowledge
- Layout is orbital: `PLANETS` + per-node `orbit {radius, angle0, speed}` in `data.js`, all hand-set (no runtime randomness). Scene-side offsets: moon render size = `size*0.72`, moon orbit radius = `planet.size*0.8 + orbit.radius`.
- Orbits pause while anything is focused (speedFactor snaps to 0 so the camera tween target holds still); background click resets and resumes. Moon labels/rings/cross-link edges reveal only on focus.
- `systemGroup.rotation.x` must be positive (+0.28) to show the disc face from the elevated camera; negative reads edge-on.
- Sprite gradient textures (halo/nebula) need steep multi-stop falloff to ~0 well inside the edge, else they render as banded gray discs at large scales.
- Star/nebula/dust materials need `fog: false`.
- `closePanel(silent)` exists so planet clicks dismiss a stale panel without resetting focus; the close-button listener must stay wrapped (`() => closePanel()`).
- Region labels as 3D-anchored CSS2D objects failed (collide with node labels during auto-rotate); replaced with the screen-fixed legend, bottom-left. Don't reintroduce.
- Don't put `overflow:hidden` on html/body: graph-mode children are all fixed-position so the page can't scroll anyway, and the lock broke list-mode scrolling (nested-scroller trap).
- Header readability over scrolling content comes from the `.chrome-top` gradient scrim.
- Node click = pointerup within 6px of pointerdown (drag guard). Focus distances: sun 13, planet `size*4 + (size*0.8+maxMoonR)*2.4`, moon 5.
- Local test: `python3 -m http.server <port>`; Chrome caches modules aggressively, use a fresh port after JS edits.

- Galaxy ambience lives entirely in `js/scene.js`: seeded two-shell starfield + nebula sprites (both `fog: false` or fog swallows them), emissive star-look node materials. Site identity is one-word "Suprasidh".
- Category colors are inner-planet themed (`TYPES` in `data.js`): Experience/Mars, Projects/Earth, Education/Mercury, Skills/Venus. Moons carry their own `color` field (hand-picked shade within their planet's family); `scene.js` falls back to `TYPES[type].color` if a moon has none.
- `PLANETS` array order in `data.js` = orbital radius order (inner to outer), independent of `ORDER` (list-mode section order, still experience/project/education/skills). Currently education, skills, experience, project inner-to-outer — fewer-moon categories inside, more-moon categories outside. Reordering just swaps which `type` occupies a radius/speed/angle0/incl slot; the slot values themselves are untouched.
- Sun uses `IcosahedronGeometry(size, 0)` (not 1) — deliberately low-poly/faceted so it reads as an angular gem, not a smooth sphere. Don't "fix" this by raising detail.
- `makeHalo(size, opacity, tint)`: optional `tint` multiplies the baked champagne halo texture toward a body's own hue (used for planet/moon glow). Omit `tint` (or pass none) for the original uniform warm-champagne glow (used for the sun's corona).
- Planet/moon surfaces use deterministic canvas-painted textures (`PLANET_TEXTURES` per type, shared grayscale `moonTexture` for all moons tinted by `material.color`), generated with the same seeded Park-Miller PRNG (`seededRand`) as the starfield — fixed seeds so the look never changes across reloads. Moon texture is grayscale-only so it multiplies against each moon's own hue instead of carrying color itself.
- **Verify visual changes at the DEFAULT camera zoom, not just close-up screenshots.** A texture/detail change can look obviously different when zoomed in via agent-browser yet be nearly invisible to the user at the normal viewing distance where planets render small — screenshot the default view first and confirm the change actually reads there before claiming a visual tweak is done.
- Many stray `python -m http.server` instances tend to accumulate across a session (each JS edit needs a fresh port to dodge Chrome's module cache) — check `lsof -iTCP -sTCP:LISTEN` and kill strays on wrapup rather than letting them pile up indefinitely.

## State (2026-07-09)
- Galaxy retheme deployed (commit b0b8bd1): one-word "Suprasidh", Space Grotesk, starfield + nebula, banding/label-contrast fixes.
- Solar system restructure + 3 tuning passes committed locally (ec3a79f, f39055c, b8119e5, b3afb9b, 69cf380), NOT pushed. BLOCKED: user reports not seeing tuning-pass-3 (textures) rendered — see BUILD_PLAN.md "Current bug" section for hypotheses (stale cached tab vs. effect too subtle at default zoom) before touching more code.

- **LIVE at https://suprxsidh.github.io** — origin is `suprxsidh/suprxsidh.github.io`, Pages serves main/root. Old live site + old resume backed up in `legacy/`. Push to main = deploy.
