# Portfolio Redesign — "The Constellation"

**Date:** 2026-07-07 · **Status:** approved (user delegated final decisions)

## Concept

Suprasidh's career rendered as an interactive 3D knowledge graph — the portfolio itself demonstrates the GraphRAG/KG work he does professionally. Visitors orbit a constellation of nodes (experience, projects, skills, education) around a central "me" node; clicking a node opens a luxe case-study panel.

Chosen by user from three directions (Obsidian Gallery / Constellation / Light Atelier). Mood and layout decisions delegated to Claude:

- **Mood:** Obsidian & Champagne — warm near-black (#0a0a0c family), champagne-gold (#c9a86a) link lines and halos, ivory serif display type (gallery-luxury), hairline borders.
- **Organization:** Typed clusters — Experience / Projects / Skills / Education occupy labeled regions around the center; nodes drift organically in place (subtle sine float), but cluster membership keeps the graph instantly scannable.

## Audience & goals

Everyone (recruiters, founders, peers). Primary goal: "really great design" — memorable and novel, but content must remain legible and fast to reach.

## Stack

- Static site, **no build step**: `index.html` + ES modules, three.js pinned via CDN import map. Deploys to GitHub Pages by pushing the directory.
- No framework. One `data/content.js` module holds all graph/content data so text edits never touch scene code.

## Architecture

```
index.html          shell, import map, fallback <noscript>/list markup mount
css/style.css       typography, panel, overlay, list-mode styles
js/data.js          graph data: nodes {id,type,label,title,period,body[],tech[],links[]}, edges
js/scene.js         three.js scene: nodes, edges, labels, bloom-ish halos, orbit controls, raycasting
js/panel.js         case-study panel open/close, renders node data to DOM
js/list-mode.js     accessible flat rendering of same data (nav + sections)
js/main.js          boot: WebGL/mobile/reduced-motion detection → scene or list mode; mode toggle
```

- **Data flow:** `data.js` is the single source of truth → consumed by both `scene.js` (3D) and `list-mode.js` (flat). Panel renders from the same node objects.
- **Interaction:** drag = orbit (OrbitControls, damped, auto-rotate when idle); hover = node halo brightens + label grows + cursor change; click = camera eases toward node, panel slides in from right; Esc/close = panel out, camera returns.
- **Entrance:** nodes fade/scale in staggered from center on load; brief hint text "drag to orbit · click a node".

## Content (curated)

- **Center:** Suprasidh Das — AI engineer, IIT Madras '26.
- **Experience (4):** Eagle Eye Networks (AI Eng Intern, retrieval/VLMs), Blue Ocean (AI Architect, multi-agent VC research), Hypergro (GenAI, LatentSync ads), Danone (AI Ops, Neo4j GraphRAG).
- **Projects (7):** ChemGPT, Project Kai, Edge AI Speech-to-Graph, Automated GenAI Content Engine, tandem, FinTrack, hopalong-cosmic-voyager (fun/visual pick). Each links to GitHub repo where public.
- **Education (1):** IIT Madras, B.Tech ChemEng, CGPA 9.01 + BTP (PySR symbolic regression).
- **Skills (grouped node(s)):** Languages/tools + AI/ML libs from resume.
- **Contact:** persistent minimal footer bar (email, GitHub) — not buried in the graph.

## Fallbacks & accessibility

- List mode when: no WebGL, `prefers-reduced-motion`, viewport < 768px, or user clicks the always-visible "list view" toggle. Same data, elegant editorial layout, zero JS dependencies beyond rendering.
- Panel content is real DOM (selectable, screen-reader reachable). Labels use sprite/CSS2D so text stays crisp.
- Perf budget: three.js only (~150KB gz), no textures beyond generated gradients; target <1s first paint, 60fps orbit on M-series/modern laptops, graceful on integrated GPUs (cap DPR at 2).

## Error handling

- three.js CDN failure or WebGL context loss → catch, swap to list mode silently.
- All external links `rel="noopener"`.

## Testing / verification

- Serve locally, drive with browser automation: load, orbit, click ≥3 nodes, open/close panel, toggle list mode, mobile-width viewport check. Screenshot evidence.
- Old site preserved as `legacy/index-2025.html`.

## Out of scope (future_plans.md)

Blog/writing section, OG-image generation, analytics, custom domain, per-project detail pages.
