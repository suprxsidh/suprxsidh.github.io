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

## Addendum 2026-07-09: inner-planet colors + tilt increase
Approved by Suprasidh after first local review of the restructure.

**Colors** — each category planet retinted to an inner-planet family, moons vary within that family instead of inheriting one flat color:
- Experience → Mars (rust/terracotta base `#b5451f`)
- Projects → Earth (blue-green base `#3f7ea6`; 7 moons, widest spread)
- Education → Mercury (grey-brown base `#8c8072`)
- Skills → Venus (pale cream-gold base `#d6c07a`)

Per-moon hex lives on each moon node in `data.js` (`color` field); `scene.js` falls back to the planet's `TYPES[type].color` if a moon has none. Hand-picked, no runtime randomness.

**Tilts** — `incl` values increased from the original 2-4° spread (too subtle to read) to a moderate, clearly-distinct spread with mixed signs so the four orbital planes visibly cross:
- Experience: 12°, Projects: -18°, Education: 8°, Skills: -15°

`systemGroup.rotation.x` stays at +0.28; per-planet `incline.rotation.z` is unaffected by that base tilt.

## Addendum 2026-07-09 (2): orbit reorder, less-spherical sun, color pop
Second round of feedback after the first tuning pass.

**Orbit reorder** — skills (2 moons) read as small and detached out on the
outermost ring alone. Swapped the orbit-slot assignments in `PLANETS` so
education and skills (fewer moons) take the two inner, tighter orbits, and
experience and projects (more moons, esp. projects at 7) take the two outer
orbits where there's room to spread out. Radius/speed/angle0/incl values
per slot are unchanged, only which `type` occupies each slot moved.

**Sun shape** — `IcosahedronGeometry(size, 1)` read as basically a smooth
ball; dropped detail to `0` so the facets are fewer and larger, giving the
sun a visibly crystalline/gem silhouette instead of reading as a sphere.

**Color pop against the starfield/nebula bg** — the flat-diffuse planet/moon
spheres read dull next to the glowing nebula sprites. Two changes:
- `makeHalo()` now takes an optional `tint` argument that sets the sprite
  material's `color`, multiplying the baked champagne gradient toward the
  body's own hue instead of always glowing uniform warm-champagne. Planets
  and moons now pass their own color as the tint; the sun's corona is left
  untinted (stays warm-gold, matches its emissive).
- Bumped planet material to `metalness 0.22 / roughness 0.38 /
  emissiveIntensity 0.5` (was 0.15/0.55/0.32) and moon material to
  `metalness 0.2 / roughness 0.35 / emissiveIntensity 0.62` (was
  0.1/0.5/0.5) for more specular pop and a stronger glow.

Verified visually via local server + agent-browser screenshots: colored
halos read distinctly per planet, skills/education now cluster on the inner
rings instead of skills sitting alone outside, sun facets are visibly
angular on close zoom, no console errors.

## Addendum 2026-07-09 (3): procedural surface textures
Feedback: planet/moon surfaces read "too basic" (flat single-color spheres).

Added deterministic canvas-generated surface textures, reusing the same
Park-Miller PRNG pattern already used for the starfield (fixed seed per
texture, so the look is identical across reloads/deploys):
- **Planets** (`PLANET_TEXTURES` in `scene.js`, one per category type): each
  is a full-color painted 256x256 canvas matching its inner-planet
  inspiration — Mars gets rusty blotches + dark basalt patches, Earth gets
  ocean base + green/brown landmasses + cloud wisps, Mercury gets circular
  impact craters, Venus gets wavy cream cloud bands. `material.color` is set
  to white so the painted colors show through unmodified; `emissive` still
  carries the type color so the halo/glow tie-in from the previous pass is
  unchanged. Also used as `bumpMap` (`bumpScale: 0.035`) for cheap relief
  under the sun light.
- **Moons** share one grayscale mottled/cratered 128x128 texture
  (`moonTexture`) used as both `map` and `bumpMap` (`bumpScale: 0.025`);
  grayscale multiplies against each moon's own `material.color`, so every
  moon keeps its individual hue from the round-1 tuning while gaining
  surface variation, without needing 16 separate textures.
- Both texture sets set `colorSpace = THREE.SRGBColorSpace` for correct
  color output (existing halo/nebula canvas textures don't set this,
  intentionally left alone since they're translucent additive glows where
  it doesn't matter).

Sun geometry/material untouched (already addressed via the icosahedron
detail-0 change in addendum 2).

Verified visually via local server + agent-browser: zoomed screenshots show
clearly mottled/cratered/banded surfaces per planet type distinct from the
previous flat-color spheres, no console errors.
