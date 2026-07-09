// Single source of truth for the constellation and the list view.
// pos values are hand-placed: experience upper right, projects left,
// education lower right, skills lower back.

export const TYPES = {
  me:         { color: 0xe9d9b8, label: '' },
  experience: { color: 0xc9a86a, label: 'Experience' },
  project:    { color: 0xece4d6, label: 'Projects' },
  education:  { color: 0xa5824e, label: 'Education' },
  skills:     { color: 0x746b82, label: 'Skills' },
};

export const REGIONS = [
  { type: 'experience', pos: [7.2, 6.9, -1.5] },
  { type: 'project',    pos: [-10.6, 1.7, 0.9] },
  { type: 'education',  pos: [6.2, -6.3, 2.9] },
  { type: 'skills',     pos: [-5.4, -7.2, -3.7] },
];

export const NODES = [
  {
    id: 'me', type: 'me', size: 1.15, pos: [0, 0, 0],
    label: 'Suprasidh', sub: 'AI Engineer',
    title: 'Suprasidh',
    period: 'Bengaluru · Chennai',
    body: [
      'I build retrieval systems, agents, and knowledge graphs. Most of my work lives where language models meet structured knowledge: GraphRAG frameworks, multi-agent pipelines, and models that run on local hardware.',
      'B.Tech from IIT Madras, class of 2026. Currently doing AI engineering at Eagle Eye Networks.',
      'This site is a knowledge graph because that is what I make. Every node is real work; drag, click, and explore.',
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
    id: 'een', type: 'experience', size: 0.52, pos: [5.6, 3.9, -0.4],
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
    id: 'blueocean', type: 'experience', size: 0.46, pos: [7.6, 2.4, -2.2],
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
    id: 'hypergro', type: 'experience', size: 0.42, pos: [5.2, 5.3, -2.6],
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
    id: 'danone', type: 'experience', size: 0.46, pos: [7.2, 4.8, 0.9],
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
    id: 'chemgpt', type: 'project', size: 0.5, pos: [-6.2, 2.8, 1.6],
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
    id: 'kai', type: 'project', size: 0.48, pos: [-7.8, 0.2, -1.0],
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
    id: 'speechgraph', type: 'project', size: 0.46, pos: [-5.4, 0.8, 2.8],
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
    id: 'contentengine', type: 'project', size: 0.42, pos: [-8.2, 2.2, 1.0],
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
    id: 'tandem', type: 'project', size: 0.4, pos: [-6.0, -1.4, -1.8],
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
    id: 'fintrack', type: 'project', size: 0.4, pos: [-4.6, 2.2, -0.9],
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
    id: 'hopalong', type: 'project', size: 0.36, pos: [-7.4, -0.9, 2.2],
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
    id: 'iitm', type: 'education', size: 0.5, pos: [4.4, -4.4, 2.0],
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

  // ---- Skills ----
  {
    id: 'skills-ai', type: 'skills', size: 0.34, pos: [-1.4, -4.6, -2.0],
    label: 'AI / ML', sub: 'Libraries and frameworks',
    title: 'AI / ML',
    period: '',
    body: ['The modeling stack I reach for daily.'],
    tech: ['PyTorch', 'TensorFlow', 'MLX', 'LangChain', 'Whisper.cpp', 'OpenCV', 'scikit-learn', 'PySR', 'Pandas'],
    links: [],
  },
  {
    id: 'skills-sys', type: 'skills', size: 0.34, pos: [-3.2, -5.4, -3.0],
    label: 'Systems', sub: 'Languages and infra',
    title: 'Systems',
    period: '',
    body: ['Languages and infrastructure I ship with.'],
    tech: ['Python', 'C++', 'Go', 'Bash', 'SQL', 'Docker', 'AWS', 'Azure', 'Databricks', 'Tailscale', 'Git'],
    links: [],
  },
];

// Edges: center to every node, plus cross-links that encode real relationships.
export const EDGES = [
  ...NODES.filter(n => n.id !== 'me').map(n => ['me', n.id]),
  ['danone', 'chemgpt'],        // GraphRAG lineage
  ['een', 'chemgpt'],           // retrieval accuracy work
  ['kai', 'speechgraph'],       // local-first AI
  ['hypergro', 'contentengine'],// generative video
  ['skills-ai', 'kai'],
  ['skills-sys', 'fintrack'],
  ['iitm', 'chemgpt'],          // chemE + AI
];

export const ORDER = ['experience', 'project', 'education', 'skills'];
