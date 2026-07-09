# portfolio-website

Personal portfolio: "The Constellation" — Suprasidh's career as an interactive 3D knowledge graph. Spec: `docs/superpowers/specs/2026-07-07-portfolio-constellation-design.md`.

## Constraints
- **No build step.** Plain ES modules; three.js 0.166.1 pinned via CDN import map in `index.html`. Deploys to GitHub Pages by pushing the directory as-is.
- **All content lives in `js/data.js`** (nodes, edges, copy, links). Never hardcode text in scene/panel/list code.
- Design tokens in `css/style.css` `:root`: obsidian #0a0a0c, champagne #c9a86a, ivory #ece4d6. Fonts: Space Grotesk (display, token `--display`, no italic), Instrument Sans (body), Spline Sans Mono (labels/data).
- No em-dashes in user-facing copy (user rule).
- List mode must stay in feature parity with the graph: it renders from the same `data.js` and is the fallback for mobile (<768px), reduced-motion, no-WebGL, and the header toggle. Mode choice persists in `localStorage['view-mode']`.
- `legacy/index-2025.html` = old site, keep frozen. Resume served from `assets/resume.pdf` (copy of "Grad Resume.pdf").

## Working knowledge
- Node positions are hand-placed in `data.js` (no runtime randomness). Clusters: experience upper-right, projects left, education lower-right, skills lower-back.
- Region labels as 3D-anchored CSS2D objects failed (collide with node labels during auto-rotate); replaced with the screen-fixed legend, bottom-left. Don't reintroduce.
- Don't put `overflow:hidden` on html/body: graph-mode children are all fixed-position so the page can't scroll anyway, and the lock broke list-mode scrolling (nested-scroller trap).
- Header readability over scrolling content comes from the `.chrome-top` gradient scrim.
- Node click = pointerup within 6px of pointerdown (drag guard). Camera focus tween ~`dist = max(9, size*13)`; tighter distances cause label pileups.
- Local test: `python3 -m http.server <port>`; Chrome caches modules aggressively, use a fresh port after JS edits.

- Galaxy ambience lives entirely in `js/scene.js`: seeded two-shell starfield + nebula sprites (both `fog: false` or fog swallows them), emissive star-look node materials. Site identity is one-word "Suprasidh".

## State (2026-07-08)
- **LIVE at https://suprxsidh.github.io** — origin is `suprxsidh/suprxsidh.github.io`, Pages serves main/root. Old live site + old resume backed up in `legacy/`. Push to main = deploy.
