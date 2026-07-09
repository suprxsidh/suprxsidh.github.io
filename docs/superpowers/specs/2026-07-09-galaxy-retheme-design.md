# Galaxy Retheme: name, font, ambience

Date: 2026-07-09. Approved by Suprasidh (all recommended options).

## Goals
1. One-word name "Suprasidh" everywhere (capitalized).
2. Replace Fraunces with Space Grotesk as the display font.
3. Galaxy ambience so the graph reads as a constellation/galaxy, not an atom.

## 1. Name
- `index.html`: page title and og:title become "Suprasidh · AI Engineer"; meta description, header wordmark, noscript h1 lose "Das".
- `js/data.js`: me-node `label` and `title` become "Suprasidh".
- Email address unchanged. `legacy/` frozen, untouched.

## 2. Font
- Google Fonts link: Fraunces out, Space Grotesk 300..700 in. Instrument Sans and Spline Sans Mono stay.
- `css/style.css`: rename `--serif` token to `--display`, update all usages.
- Space Grotesk has no italic: former italic display styles become upright, weight/letter-spacing adjusted.

## 3. Galaxy ambience (`js/scene.js` only; node layout, controls, labels, interaction untouched)
- **Starfield**: ~2,000 stars, seeded random, two depth layers on a large shell (radius beyond the graph), sizes varied; colors mostly ivory with champagne + pale-violet sprinkles; `fog: false` on star materials.
- **Nebula haze**: 4-5 large canvas radial-gradient sprites (deep violet #2a2440-ish + champagne), additive blending, low opacity, behind clusters.
- **Nodes as stars**: replace metallic look with bright emissive cores; halos larger/stronger. Me-node keeps icosahedron, brightest. Geometry, sizes, raycast, hover/click unchanged.
- **Edges**: same curves, lower opacity (constellation lines).
- Palette stays obsidian/champagne/ivory + existing violet accent. No runtime randomness (seeded PRNG as existing dust does).

## Out of scope
Spiral-arm node layout (not chosen). List mode needs no changes (renders from data.js; font token change applies automatically).

## Verification
Serve locally on a fresh port, load graph mode + list mode, click a node, check labels readable over starfield.
