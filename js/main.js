import { openPanel, closePanel } from './panel.js';
import { showList, hideList } from './list-mode.js';

const stage = document.getElementById('stage');
const hint = document.getElementById('hint');
const toggle = document.getElementById('mode-toggle');

function webglAvailable() {
  try {
    const c = document.createElement('canvas');
    return !!(c.getContext('webgl2') || c.getContext('webgl'));
  } catch { return false; }
}

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const small = window.innerWidth < 768;
const stored = localStorage.getItem('view-mode');

let sceneApi = null;
let mode = null; // 'graph' | 'list'

async function enterGraph() {
  if (!webglAvailable()) { enterList(); return; }
  try {
    if (!sceneApi) {
      const { createScene } = await import('./scene.js');
      sceneApi = createScene({
        mount: document.getElementById('scene-root'),
        labelMount: document.getElementById('labels-root'),
        onNodeClick: (node) => {
          hint.classList.add('faded');
          openPanel(node, () => sceneApi && sceneApi.resetView());
        },
        onPanelDismiss: () => closePanel(true),
      });
    }
    stage.classList.remove('hidden');
    hideList();
    mode = 'graph';
    toggle.textContent = 'List view';
    toggle.setAttribute('aria-pressed', 'false');
  } catch (err) {
    console.error('Scene failed, falling back to list view.', err);
    enterList();
  }
}

function enterList() {
  closePanel();
  stage.classList.add('hidden');
  showList();
  mode = 'list';
  toggle.textContent = 'Solar system';
  toggle.setAttribute('aria-pressed', 'true');
}

toggle.addEventListener('click', () => {
  if (mode === 'graph') {
    enterList();
    localStorage.setItem('view-mode', 'list');
  } else {
    enterGraph();
    localStorage.setItem('view-mode', 'graph');
  }
});

// boot: explicit choice wins, then accessibility and device signals
if (stored === 'list') enterList();
else if (stored === 'graph') enterGraph();
else if (reducedMotion || small) enterList();
else enterGraph();
