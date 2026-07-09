// Single source of truth for the solar system and the list view.
// The scene is a solar system: the me node is the sun, each category in
// PLANETS is a planet orbiting it, and every item node is a moon of its
// category planet. All orbit parameters are hand-set: radius (world units),
// angle0 (degrees at t=0), speed (radians per second). Deterministic, no
// runtime randomness.

// Category colors modeled on the 4 rocky inner planets: Experience/Mars,
// Projects/Earth, Education/Mercury, Skills/Venus. Moons vary within their
// planet's family (see `color` on each moon node below) instead of
// inheriting one flat hue.
export const TYPES = {
  me:         { color: 0xe9d9b8, label: '' },
  experience: { color: 0xb5451f, label: 'Experience' }, // Mars
  project:    { color: 0x3f7ea6, label: 'Projects' },   // Earth
  education:  { color: 0x8c8072, label: 'Education' },  // Mercury
  skills:     { color: 0xd6c07a, label: 'Skills' },     // Venus
};

// One planet per category. Inclination tilts each orbit plane at a
// noticeably distinct angle (mixed signs) so the four planes visibly cross
// rather than reading as one flat disc.
export const PLANETS = [
  { type: 'experience', size: 0.85, radius: 5.5,  angle0: 25,  speed: 0.032, incl: 0.2094 },  // 12°
  { type: 'project',    size: 0.9,  radius: 9.5,  angle0: 150, speed: 0.021, incl: -0.3142 }, // -18°
  { type: 'education',  size: 0.75, radius: 13.0, angle0: 275, speed: 0.015, incl: 0.1396 },  // 8°
  { type: 'skills',     size: 0.7,  radius: 16.0, angle0: 70,  speed: 0.011, incl: -0.2618 }, // -15°
];

export const NODES = [
  {
    id: 'me', type: 'me', size: 1.5,
    label: 'Suprasidh', sub: 'AI Engineer',
    title: 'Suprasidh',
    period: 'Bengaluru · Chennai',
    body: [
      'I build retrieval systems, agents, and knowledge graphs. Most of my work lives where language models meet structured knowledge: GraphRAG frameworks, multi-agent pipelines, and models that run on local hardware.',
      'B.Tech from IIT Madras, class of 2026. Currently doing AI engineering at Eagle Eye Networks.',
      'This site is a small solar system because my work orbits a few fixed ideas. Every moon is real work; drag, click, and explore.',
    ],
    tech: [],
    links: [
      { label: 'GitHub', url: 'https://github.com/suprxsidh' },
      { label: 'Email', url: 'mailto:suprasidh.das@gmail.com' },
      { label: 'Resume', url: 'assets/resume.pdf' },
    ],
  },

  // ---- Experience ----
  {
    id: 'een', type: 'experience', size: 0.52, color: 0xc1440e,
    orbit: { radius: 1.5, angle0: 0, speed: 0.28 },
    label: 'Eagle Eye Networks', sub: 'AI Engineering Intern',
    title: 'Eagle Eye Networks',
    period: 'Jun 2026 · present — Bengaluru',
    body: [
      'Video surveillance at cloud scale. I work on the retrieval backend that lets people search hours of CCTV footage with plain language.',
      'Cut query latency on the Elasticsearch multi-vector retrieval pipeline by more than 40%.',
      'Fine-tune vision-language models to pull metadata and spatial context out of camera frames, and design cross-modal rank fusion with a custom golden dataset to keep accuracy honest.',
    ],
    tech: ['Elasticsearch', 'VLMs', 'Python', 'Rank fusion'],
    links: [],
  },
  {
    id: 'blueocean', type: 'experience', size: 0.46, color: 0xd2691e,
    orbit: { radius: 2.5, angle0: 200, speed: 0.18 },
    label: 'Blue Ocean', sub: 'AI Architect',
    title: 'Blue Ocean',
    period: 'Apr 2026 · present — Remote',
    body: [
      'Automated venture research. I designed a four-agent system that runs due diligence, landscape mapping, and competitor analysis for VC workflows.',
      'Agents execute asynchronously through n8n flows with dynamic routing between them.',
      'Self-correcting validation loops and human-in-the-loop feedback keep hallucinations out of the reports.',
    ],
    tech: ['Multi-agent systems', 'n8n', 'LLMs'],
    links: [],
  },
  {
    id: 'hypergro', type: 'experience', size: 0.42, color: 0x8b3a1f,
    orbit: { radius: 2.9, angle0: 300, speed: 0.15 },
    label: 'Hypergro', sub: 'GenAI Intern',
    title: 'Hypergro',
    period: 'Jan 2026 · Mar 2026 — Remote',
    body: [
      'Hyper-personalized video ads. Built a LatentSync pipeline that lip-syncs a viewer’s own name into base footage.',
      'Integrated GFPGAN facial restoration to remove artifacts and hold broadcast-level clarity.',
      'Reworked preprocessing and inference paths for a 30% gain in speed and sync accuracy.',
    ],
    tech: ['LatentSync', 'GFPGAN', 'PyTorch'],
    links: [],
  },
  {
    id: 'danone', type: 'experience', size: 0.46, color: 0xe08850,
    orbit: { radius: 2.0, angle0: 100, speed: 0.22 },
    label: 'Danone', sub: 'AI Operations Intern',
    title: 'Danone',
    period: 'May 2025 · Nov 2025 — Hybrid',
    body: [
      'Where I got serious about knowledge graphs. Architected a Neo4j GraphRAG framework that extracts semantics from operating procedures, lifting query resolution by 60%.',
      'Fine-tuned LLMs with LoRA adapters on constrained hardware so everything could run locally.',
      'Automated QC reporting pipelines: 80% fewer false rejections, 40% faster analysis.',
    ],
    tech: ['Neo4j', 'GraphRAG', 'LoRA', 'Python'],
    links: [],
  },

  // ---- Projects ----
  {
    id: 'chemgpt', type: 'project', size: 0.5, color: 0x2f6690,
    orbit: { radius: 1.5, angle0: 0, speed: 0.26 },
    label: 'ChemGPT', sub: 'Agentic GraphRAG',
    title: 'ChemGPT',
    period: 'Jul 2025 · Nov 2025',
    body: [
      'An agentic GraphRAG system for chemical engineering knowledge, built on iterative hypergraph reasoning.',
      'Hits 92% retrieval accuracy, with an ontology extraction layer holding 88% precision across five scientific domains.',
    ],
    tech: ['GraphRAG', 'Hypergraphs', 'Ontology extraction'],
    links: [],
  },
  {
    id: 'kai', type: 'project', size: 0.48, color: 0x3f9e8f,
    orbit: { radius: 1.9, angle0: 52, speed: 0.22 },
    label: 'Project Kai', sub: 'Local agent orchestrator',
    title: 'Project Kai',
    period: 'Ongoing',
    body: [
      'A voice-commanded agentic orchestrator that runs across my own devices over a Tailscale mesh, translating speech into workflows across apps.',
      'Includes a memory-orchestration layer for MLX that juggles model loading and execution under tight RAM budgets.',
    ],
    tech: ['MLX', 'Tailscale', 'Agents', 'Whisper'],
    links: [],
  },
  {
    id: 'speechgraph', type: 'project', size: 0.46, color: 0x5b8c5a,
    orbit: { radius: 2.3, angle0: 104, speed: 0.19 },
    label: 'Speech-to-Graph', sub: 'Edge AI · Android',
    title: 'Edge AI Speech-to-Graph Engine',
    period: 'Ongoing',
    body: [
      'A fully offline Android app that listens, transcribes with whisper.cpp over JNI, summarizes with TinyLlama, and builds a knowledge graph from what it heard.',
      'Entity timelines render on a Compose canvas; clean architecture with MVVM and Hilt underneath.',
    ],
    tech: ['whisper.cpp', 'TinyLlama', 'Kotlin', 'Compose'],
    links: [],
  },
  {
    id: 'contentengine', type: 'project', size: 0.42, color: 0x6fb8d1,
    orbit: { radius: 2.7, angle0: 156, speed: 0.17 },
    label: 'Content Engine', sub: 'Multi-agent video pipeline',
    title: 'Automated GenAI Content Engine',
    period: 'Jul 2025 · Nov 2025',
    body: [
      'An end-to-end pipeline that produced 15 videos a day with local LLMs, TTS, and dynamic video assembly.',
      'A multi-agent layer A/B tested content strategies against each other, cutting production time by over 90%.',
    ],
    tech: ['Multi-agent', 'Local LLMs', 'TTS', 'ffmpeg'],
    links: [],
  },
  {
    id: 'tandem', type: 'project', size: 0.4, color: 0x8fd9c4,
    orbit: { radius: 3.0, angle0: 208, speed: 0.15 },
    label: 'tandem', sub: 'Two strangers, one canvas',
    title: 'tandem',
    period: '2026',
    body: [
      'Anonymous real-time collaborative drawing. Two cursors, one canvas, no names.',
      'Built to see how little interface two people need to make something together.',
    ],
    tech: ['TypeScript', 'WebSockets', 'Canvas'],
    links: [{ label: 'GitHub', url: 'https://github.com/suprxsidh/tandem' }],
  },
  {
    id: 'fintrack', type: 'project', size: 0.4, color: 0x3a5a8c,
    orbit: { radius: 3.3, angle0: 260, speed: 0.13 },
    label: 'FinTrack', sub: 'Local-first finance',
    title: 'FinTrack',
    period: '2026',
    body: [
      'A local-first Android finance tracker that reads Indian bank SMS automatically. No cloud, no account, your data never leaves the phone.',
    ],
    tech: ['Flutter', 'Dart', 'On-device parsing'],
    links: [{ label: 'GitHub', url: 'https://github.com/suprxsidh/fintrack' }],
  },
  {
    id: 'hopalong', type: 'project', size: 0.36, color: 0xd8e4e0,
    orbit: { radius: 3.6, angle0: 312, speed: 0.11 },
    label: 'Cosmic Voyager', sub: 'Procedural attractor art',
    title: 'Hopalong Cosmic Voyager',
    period: '2025',
    body: [
      'An endless flythrough of Hopalong attractor point clouds, rendered on plain Canvas 2D at 60fps.',
      'Math as scenery. No libraries, no shaders, just orbits.',
    ],
    tech: ['JavaScript', 'Canvas 2D', 'Generative math'],
    links: [{ label: 'GitHub', url: 'https://github.com/suprxsidh/hopalong-cosmic-voyager' }],
  },

  // ---- Education ----
  {
    id: 'iitm', type: 'education', size: 0.5, color: 0x8c8072,
    orbit: { radius: 1.4, angle0: 0, speed: 0.24 },
    label: 'IIT Madras', sub: 'B.Tech · CGPA 9.01',
    title: 'Indian Institute of Technology, Madras',
    period: 'Nov 2022 · May 2026 — Chennai',
    body: [
      'B.Tech in Chemical Engineering, CGPA 9.01 of 10.',
      'Thesis: symbolic regression with PySR over 200+ simulation datasets to derive interpretable pressure-drop correlations for packed beds, matching empirical models on predictive performance.',
      'Coursework spans machine learning, deep learning, DSA, optimization, and numerical methods.',
    ],
    tech: ['PySR', 'Symbolic regression'],
    links: [],
  },
  {
    id: 'dpssouth', type: 'education', size: 0.4, color: 0xa39684,
    orbit: { radius: 2.0, angle0: 130, speed: 0.19 },
    label: 'DPS South', sub: 'CBSE · 98.2% in Class 12 boards',
    title: 'Delhi Public School South',
    period: 'Classes 11 and 12 · CBSE',
    body: [
      'Senior secondary, Classes 11 and 12.',
      'Scored 98.2% in the Class 12 board examinations.',
    ],
    tech: [],
    links: [],
  },
  {
    id: 'nhvps', type: 'education', size: 0.38, color: 0x6e6357,
    orbit: { radius: 2.5, angle0: 250, speed: 0.16 },
    label: 'National Hill View', sub: 'CBSE · 96.4% in Class 10 boards',
    title: 'National Hill View Public School',
    period: 'Through Class 10 · CBSE',
    body: [
      'Schooling through Class 10.',
      'Scored 96.4% in the Class 10 board examinations.',
    ],
    tech: [],
    links: [],
  },

  // ---- Skills ----
  {
    id: 'skills-ai', type: 'skills', size: 0.34, color: 0xd6c07a,
    orbit: { radius: 1.4, angle0: 40, speed: 0.22 },
    label: 'AI / ML', sub: 'Libraries and frameworks',
    title: 'AI / ML',
    period: '',
    body: ['The modeling stack I reach for daily.'],
    tech: ['PyTorch', 'TensorFlow', 'MLX', 'LangChain', 'Whisper.cpp', 'OpenCV', 'scikit-learn', 'PySR', 'Pandas'],
    links: [],
  },
  {
    id: 'skills-sys', type: 'skills', size: 0.34, color: 0xc9a35a,
    orbit: { radius: 1.9, angle0: 220, speed: 0.18 },
    label: 'Systems', sub: 'Languages and infra',
    title: 'Systems',
    period: '',
    body: ['Languages and infrastructure I ship with.'],
    tech: ['Python', 'C++', 'Go', 'Bash', 'SQL', 'Docker', 'AWS', 'Azure', 'Databricks', 'Tailscale', 'Git'],
    links: [],
  },
];

// Cross-links that encode real relationships between items. Hidden by
// default in the scene; revealed when a planet or moon is focused.
export const EDGES = [
  ['danone', 'chemgpt'],        // GraphRAG lineage
  ['een', 'chemgpt'],           // retrieval accuracy work
  ['kai', 'speechgraph'],       // local-first AI
  ['hypergro', 'contentengine'],// generative video
  ['skills-ai', 'kai'],
  ['skills-sys', 'fintrack'],
  ['iitm', 'chemgpt'],          // chemE + AI
];

export const ORDER = ['experience', 'project', 'education', 'skills'];
