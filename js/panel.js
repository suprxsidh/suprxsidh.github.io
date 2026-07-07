import { TYPES } from './data.js';

const panel = document.getElementById('panel');
const body = document.getElementById('panel-body');
const closeBtn = document.getElementById('panel-close');

let onCloseCallback = null;

export function openPanel(node, onClose) {
  onCloseCallback = onClose;
  const eyebrow = node.type === 'me' ? 'About' : TYPES[node.type].label;

  body.innerHTML = `
    <p class="panel-eyebrow">${eyebrow}</p>
    <h2 class="panel-title" id="panel-title">${node.title}</h2>
    ${node.sub ? `<p class="panel-sub">${node.sub}</p>` : ''}
    ${node.period ? `<p class="panel-period">${node.period}</p>` : ''}
    ${node.body.map(p => `<p>${p}</p>`).join('')}
    ${node.tech.length ? `<hr class="panel-rule">
      <div class="tech-chips">${node.tech.map(t => `<span>${t}</span>`).join('')}</div>` : ''}
    ${node.links.length ? `<div class="panel-links">${node.links.map(l =>
      `<a href="${l.url}" ${l.url.startsWith('http') ? 'target="_blank" rel="noopener"' : ''}>${l.label}</a>`
    ).join('')}</div>` : ''}
  `;

  panel.hidden = false;
  requestAnimationFrame(() => panel.classList.add('open'));
  closeBtn.focus({ preventScroll: true });
}

export function closePanel() {
  if (!panel.classList.contains('open')) return;
  panel.classList.remove('open');
  setTimeout(() => { panel.hidden = true; }, 560);
  if (onCloseCallback) { onCloseCallback(); onCloseCallback = null; }
}

closeBtn.addEventListener('click', closePanel);
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closePanel();
});
