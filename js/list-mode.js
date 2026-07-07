import { NODES, TYPES, ORDER } from './data.js';

const root = document.getElementById('list-root');
let built = false;

function itemHTML(node) {
  return `
    <article class="list-item">
      <div class="list-item-head">
        <h3 class="list-item-title">${node.title}</h3>
        ${node.period ? `<span class="list-item-period">${node.period}</span>` : ''}
      </div>
      ${node.sub ? `<p class="list-item-sub">${node.sub}</p>` : ''}
      ${node.body.map(p => `<p>${p}</p>`).join('')}
      ${node.tech.length ? `<div class="tech-chips">${node.tech.map(t => `<span>${t}</span>`).join('')}</div>` : ''}
      ${node.links.length ? `<div class="panel-links">${node.links.map(l =>
        `<a href="${l.url}" ${l.url.startsWith('http') ? 'target="_blank" rel="noopener"' : ''}>${l.label}</a>`
      ).join('')}</div>` : ''}
    </article>
  `;
}

function build() {
  const me = NODES.find(n => n.id === 'me');
  const sections = ORDER.map(type => {
    const items = NODES.filter(n => n.type === type);
    return `
      <section class="list-section">
        <h2 class="list-section-title">${TYPES[type].label}</h2>
        ${items.map(itemHTML).join('')}
      </section>
    `;
  }).join('');

  root.innerHTML = `
    <p class="list-intro">${me.body[0].replace(
      'retrieval systems, agents, and knowledge graphs',
      '<em>retrieval systems, agents, and knowledge graphs</em>'
    )}</p>
    ${sections}
  `;
  built = true;
}

export function showList() {
  if (!built) build();
  root.classList.remove('hidden');
}

export function hideList() {
  root.classList.add('hidden');
  window.scrollTo(0, 0);
}
