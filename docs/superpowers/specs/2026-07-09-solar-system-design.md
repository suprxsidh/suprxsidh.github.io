# Solar System Restructure

Date: 2026-07-09. Approved by Suprasidh (slow live orbits, edges on focus only, 4 planets).

## Hierarchy
- **Sun** = me node "Suprasidh": larger icosahedron + stronger corona. Click opens intro panel.
- **Planets** = 4 categories (Experience, Projects, Education, Skills), category colors, orbit radii ~6/9/12/15 on a tilted ecliptic.
- **Moons** = all items, orbiting their category planet. Item copy/links/panels unchanged.

## New content
Education planet gains two school moons (with IIT Madras):
- DPS South: CBSE, Classes 11-12, 98.2% in Class 12 boards.
- National Hill View Public School: CBSE, through Class 10, 96.4% in Class 10 boards.
No invented years. No em-dashes.

## Motion
- Planets revolve slowly (staggered, ~2-4 min/lap), moons faster.
- All orbital motion pauses while anything is focused; resumes on close/background click.
- prefers-reduced-motion: frozen layout.
- Deterministic: orbit params (parent, radius, angle0, speed, inclination) hand-set in data.js.

## Visuals
- Faint champagne planet orbit rings always on; moon rings + moon labels only when planet focused.
- Cross-link edges hidden by default, fade in for the focused planet/moon.
- Galaxy backdrop (starfield, nebula) unchanged. "Visually interesting": sun corona, per-planet hue tints, subtle moon size variance.

## Interaction
Click planet: camera tween in, moons reveal. Click moon: detail panel. Click empty space: zoom out, resume motion. Drag/scroll unchanged. Raycast includes planets + moons (moons get generous hit sizes).

## Untouched
List mode markup/logic (new school items flow in from data.js), mobile/reduced-motion/no-WebGL fallbacks, header, fonts, legacy/.

## Files
- `js/data.js`: PLANETS array; nodes gain orbit params (replace pos); two school nodes.
- `js/scene.js`: rebuild node/edge/animation layer (pivot hierarchy, rings, focus reveal, pause/resume).
- List mode may need zero changes; verify education section shows 3 items.

## Verification
Serve locally: default view (sun + 4 planets + rings), focus each planet, open a moon panel, background click resumes motion, list mode shows schools, no console errors.
