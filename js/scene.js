import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { CSS2DRenderer, CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';
import { NODES, EDGES, TYPES, PLANETS } from './data.js';

const IDLE_RESUME_MS = 18000;
const HOME_POS = new THREE.Vector3(0, 10, 28);
const DEG = Math.PI / 180;

export function createScene({ mount, labelMount, onNodeClick, onPanelDismiss }) {
  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x0a0a0c, 0.009);

  const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 260);
  camera.position.copy(HOME_POS);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  mount.appendChild(renderer.domElement);

  const labelRenderer = new CSS2DRenderer({ element: labelMount });

  // lighting: the sun itself is the key light; faint fill + violet rim keep
  // the dark sides readable.
  scene.add(new THREE.AmbientLight(0xc9a86a, 0.28));
  const sunLight = new THREE.PointLight(0xf0dcb0, 160, 0, 1.8);
  scene.add(sunLight);
  const rim = new THREE.DirectionalLight(0x6a5a8a, 1.0);
  rim.position.set(-8, -4, -6);
  scene.add(rim);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.06;
  controls.enablePan = false;
  controls.minDistance = 5;
  controls.maxDistance = 44;
  controls.autoRotate = true;
  controls.autoRotateSpeed = 0.4;

  let lastInteraction = 0;
  controls.addEventListener('start', () => {
    controls.autoRotate = false;
    lastInteraction = performance.now();
  });

  // champagne dust for depth
  {
    const count = 320;
    const positions = new Float32Array(count * 3);
    let seed = 7;
    const rand = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (rand() - 0.5) * 44;
      positions[i * 3 + 1] = (rand() - 0.5) * 30;
      positions[i * 3 + 2] = (rand() - 0.5) * 44;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const mat = new THREE.PointsMaterial({
      color: 0xc9a86a, size: 0.05, transparent: true, opacity: 0.35,
      blending: THREE.AdditiveBlending, depthWrite: false,
    });
    scene.add(new THREE.Points(geo, mat));
  }

  // distant starfield: two shells so the system sits inside a galaxy, not a void.
  // fog would swallow anything this far out, so star materials opt out of it.
  {
    let seed = 42;
    const rand = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
    const STAR_COLORS = [0xece4d6, 0xece4d6, 0xece4d6, 0xffffff, 0xc9a86a, 0x9a8ac0];
    const makeShell = (count, rMin, rMax, size, opacity) => {
      const positions = new Float32Array(count * 3);
      const colors = new Float32Array(count * 3);
      const c = new THREE.Color();
      for (let i = 0; i < count; i++) {
        const v = new THREE.Vector3(rand() - 0.5, rand() - 0.5, rand() - 0.5);
        if (v.lengthSq() < 1e-6) v.set(0.3, 0.3, 0.3);
        v.normalize().multiplyScalar(rMin + rand() * (rMax - rMin));
        positions.set([v.x, v.y, v.z], i * 3);
        c.setHex(STAR_COLORS[Math.floor(rand() * STAR_COLORS.length)]);
        const dim = 0.55 + rand() * 0.45;
        colors.set([c.r * dim, c.g * dim, c.b * dim], i * 3);
      }
      const geo = new THREE.BufferGeometry();
      geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
      const mat = new THREE.PointsMaterial({
        size, vertexColors: true, transparent: true, opacity,
        blending: THREE.AdditiveBlending, depthWrite: false, fog: false,
      });
      scene.add(new THREE.Points(geo, mat));
    };
    makeShell(1400, 70, 120, 0.28, 0.75); // faint far field
    makeShell(600, 55, 85, 0.45, 0.9);    // nearer, brighter stars
  }

  // nebula haze: large soft sprites behind the system
  {
    const nebulaTexture = (r, g, b) => {
      const c = document.createElement('canvas');
      c.width = c.height = 256;
      const ctx = c.getContext('2d');
      const grad = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
      grad.addColorStop(0, `rgba(${r},${g},${b},0.30)`);
      grad.addColorStop(0.28, `rgba(${r},${g},${b},0.09)`);
      grad.addColorStop(0.55, `rgba(${r},${g},${b},0.025)`);
      grad.addColorStop(0.78, `rgba(${r},${g},${b},0.007)`);
      grad.addColorStop(1, `rgba(${r},${g},${b},0)`);
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 256, 256);
      return new THREE.CanvasTexture(c);
    };
    const violet = nebulaTexture(106, 90, 138);
    const champagne = nebulaTexture(201, 168, 106);
    const CLOUDS = [
      [violet, [-22, 8, -32], 50, 0.15],
      [violet, [20, -10, -36], 58, 0.13],
      [champagne, [10, 12, -30], 42, 0.10],
      [champagne, [-12, -14, -26], 36, 0.08],
      [violet, [0, 18, -40], 64, 0.10],
    ];
    for (const [map, pos, scale, opacity] of CLOUDS) {
      const sprite = new THREE.Sprite(new THREE.SpriteMaterial({
        map, transparent: true, opacity, depthWrite: false,
        blending: THREE.AdditiveBlending, fog: false,
      }));
      sprite.position.set(...pos);
      sprite.scale.setScalar(scale);
      scene.add(sprite);
    }
  }

  // halo sprite texture
  const haloTexture = (() => {
    const c = document.createElement('canvas');
    c.width = c.height = 128;
    const ctx = c.getContext('2d');
    const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
    g.addColorStop(0, 'rgba(233,217,184,0.55)');
    g.addColorStop(0.22, 'rgba(201,168,106,0.16)');
    g.addColorStop(0.45, 'rgba(201,168,106,0.045)');
    g.addColorStop(0.7, 'rgba(201,168,106,0.012)');
    g.addColorStop(1, 'rgba(201,168,106,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 128, 128);
    return new THREE.CanvasTexture(c);
  })();

  // Deterministic surface textures (same Park-Miller PRNG as the starfield
  // above) so planets/moons read as painted bodies instead of flat-shaded
  // spheres, while staying identical across reloads.
  const seededRand = (seed) => () => (seed = (seed * 16807) % 2147483647) / 2147483647;

  // Full-color painted texture per planet family. material.color is left
  // white so these paint colors show through unmodified; the planet's
  // emissive/halo tint still carries the type color.
  const PLANET_TEXTURES = {
    experience: (() => { // Mars: rusty blotches + dark basalt patches
      const c = document.createElement('canvas'); c.width = c.height = 256;
      const ctx = c.getContext('2d');
      const rand = seededRand(311);
      ctx.fillStyle = '#b5451f'; ctx.fillRect(0, 0, 256, 256);
      for (let i = 0; i < 46; i++) {
        const x = rand() * 256, y = rand() * 256, r = 10 + rand() * 30;
        ctx.fillStyle = rand() > 0.45 ? 'rgba(74,32,16,0.58)' : 'rgba(214,140,86,0.48)';
        ctx.beginPath(); ctx.ellipse(x, y, r, r * (0.5 + rand() * 0.3), rand() * Math.PI, 0, Math.PI * 2); ctx.fill();
      }
      for (let i = 0; i < 700; i++) {
        const x = rand() * 256, y = rand() * 256, v = rand();
        ctx.fillStyle = v > 0.5 ? 'rgba(50,20,8,0.22)' : 'rgba(240,180,120,0.2)';
        ctx.fillRect(x, y, 1.4, 1.4);
      }
      return new THREE.CanvasTexture(c);
    })(),
    project: (() => { // Earth: ocean base, green/brown landmasses, cloud wisps
      const c = document.createElement('canvas'); c.width = c.height = 256;
      const ctx = c.getContext('2d');
      const rand = seededRand(613);
      ctx.fillStyle = '#3f7ea6'; ctx.fillRect(0, 0, 256, 256);
      for (let i = 0; i < 20; i++) {
        const x = rand() * 256, y = rand() * 256, r = 14 + rand() * 26;
        ctx.fillStyle = rand() > 0.5 ? 'rgba(70,120,70,0.7)' : 'rgba(90,90,60,0.6)';
        ctx.beginPath(); ctx.ellipse(x, y, r, r * (0.55 + rand() * 0.3), rand() * Math.PI, 0, Math.PI * 2); ctx.fill();
      }
      for (let i = 0; i < 10; i++) {
        const y = rand() * 256, h = 6 + rand() * 10;
        ctx.fillStyle = 'rgba(240,244,240,0.32)';
        ctx.beginPath(); ctx.ellipse(rand() * 256, y, 40 + rand() * 50, h, 0, 0, Math.PI * 2); ctx.fill();
      }
      return new THREE.CanvasTexture(c);
    })(),
    education: (() => { // Mercury: grey cratered rock
      const c = document.createElement('canvas'); c.width = c.height = 256;
      const ctx = c.getContext('2d');
      const rand = seededRand(919);
      ctx.fillStyle = '#8c8072'; ctx.fillRect(0, 0, 256, 256);
      for (let i = 0; i < 60; i++) {
        const x = rand() * 256, y = rand() * 256, r = 4 + rand() * 16;
        ctx.fillStyle = 'rgba(56,48,40,0.5)';
        ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = 'rgba(200,190,175,0.42)';
        ctx.beginPath(); ctx.arc(x - r * 0.3, y - r * 0.3, r * 0.6, 0, Math.PI * 2); ctx.fill();
      }
      return new THREE.CanvasTexture(c);
    })(),
    skills: (() => { // Venus: cream cloud bands
      const c = document.createElement('canvas'); c.width = c.height = 256;
      const ctx = c.getContext('2d');
      const rand = seededRand(1237);
      ctx.fillStyle = '#d6c07a'; ctx.fillRect(0, 0, 256, 256);
      for (let i = 0; i < 14; i++) {
        const y = (i / 14) * 256 + rand() * 8;
        ctx.strokeStyle = rand() > 0.5 ? 'rgba(250,240,210,0.4)' : 'rgba(160,130,70,0.34)';
        ctx.lineWidth = 4 + rand() * 8;
        ctx.beginPath();
        ctx.moveTo(0, y);
        for (let x = 0; x <= 256; x += 32) ctx.lineTo(x, y + Math.sin(x * 0.05 + i) * 10);
        ctx.stroke();
      }
      return new THREE.CanvasTexture(c);
    })(),
  };
  for (const tex of Object.values(PLANET_TEXTURES)) tex.colorSpace = THREE.SRGBColorSpace;

  // Shared grayscale mottle/crater texture for moons: multiplies against
  // each moon's own material.color rather than carrying its own hue.
  const moonTexture = (() => {
    const c = document.createElement('canvas'); c.width = c.height = 128;
    const ctx = c.getContext('2d');
    const rand = seededRand(2027);
    ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, 128, 128);
    for (let i = 0; i < 46; i++) {
      const x = rand() * 128, y = rand() * 128, r = 3 + rand() * 11;
      const v = Math.round(140 + rand() * 90);
      ctx.fillStyle = `rgba(${v},${v},${v},0.55)`;
      ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
    }
    for (let i = 0; i < 320; i++) {
      const x = rand() * 128, y = rand() * 128, v = Math.round(110 + rand() * 130);
      ctx.fillStyle = `rgba(${v},${v},${v},0.26)`;
      ctx.fillRect(x, y, 1, 1);
    }
    return new THREE.CanvasTexture(c);
  })();
  moonTexture.colorSpace = THREE.SRGBColorSpace;

  // tint multiplies the baked champagne gradient toward a body's own hue so
  // each planet/moon glows in its own color instead of a uniform warm haze.
  const makeHalo = (size, opacity, tint) => {
    const halo = new THREE.Sprite(new THREE.SpriteMaterial({
      map: haloTexture, transparent: true, depthWrite: false,
      opacity, blending: THREE.AdditiveBlending,
      color: tint !== undefined ? tint : 0xffffff,
    }));
    halo.scale.setScalar(size);
    return halo;
  };

  const makeLabel = (mesh, text, className, offsetY) => {
    const el = document.createElement('div');
    el.className = className;
    el.textContent = text;
    const label = new CSS2DObject(el);
    label.position.set(0, offsetY, 0);
    mesh.add(label);
    mesh.userData.labelEl = el;
    return el;
  };

  const orbitRing = (radius, opacity) => {
    const pts = [];
    for (let i = 0; i <= 128; i++) {
      const a = (i / 128) * Math.PI * 2;
      pts.push(new THREE.Vector3(Math.cos(a) * radius, 0, Math.sin(a) * radius));
    }
    const geo = new THREE.BufferGeometry().setFromPoints(pts);
    return new THREE.Line(geo, new THREE.LineBasicMaterial({
      color: 0xc9a86a, transparent: true, opacity,
    }));
  };

  // ---- the system ----
  // sun at origin; each planet hangs off a pivot whose y-rotation is its
  // orbital angle; moons repeat the same pattern around their planet anchor.
  const systemGroup = new THREE.Group();
  systemGroup.rotation.set(0.28, 0, 0.05); // tip the disc toward the camera
  scene.add(systemGroup);

  const meshes = [];       // raycast targets: sun + planets + moons
  const planetSystems = {}; // type -> { pivot, anchor, moonPivots, moonRings, moonMeshes }
  const meshById = {};      // item id -> moon mesh (for focus edges)
  const meNode = NODES.find(n => n.id === 'me');

  // sun
  const sun = new THREE.Mesh(
    new THREE.IcosahedronGeometry(meNode.size, 0),
    new THREE.MeshStandardMaterial({
      color: 0xe9d9b8, flatShading: true, metalness: 0.1, roughness: 0.4,
      emissive: 0xc9973a, emissiveIntensity: 1.15,
    })
  );
  sun.userData = { kind: 'sun', node: meNode, baseScale: 1 };
  const corona = makeHalo(meNode.size * 7, 0.85);
  sun.add(corona);
  sun.add(makeHalo(meNode.size * 13, 0.3)); // wide outer corona
  makeLabel(sun, meNode.label, 'node-label me-label', -meNode.size);
  systemGroup.add(sun);
  meshes.push(sun);

  for (const planet of PLANETS) {
    const color = TYPES[planet.type].color;
    const incline = new THREE.Group();
    incline.rotation.z = planet.incl;
    systemGroup.add(incline);

    incline.add(orbitRing(planet.radius, 0.10));

    const pivot = new THREE.Group();
    incline.add(pivot);
    const anchor = new THREE.Group();
    anchor.position.set(planet.radius, 0, 0);
    pivot.add(anchor);

    const planetTex = PLANET_TEXTURES[planet.type];
    const mesh = new THREE.Mesh(
      new THREE.SphereGeometry(planet.size, 32, 24),
      new THREE.MeshStandardMaterial({
        color: 0xffffff, map: planetTex, bumpMap: planetTex, bumpScale: 0.09,
        metalness: 0.22, roughness: 0.38,
        emissive: color, emissiveIntensity: 0.5,
      })
    );
    mesh.userData = { kind: 'planet', planet, baseScale: 1 };
    mesh.add(makeHalo(planet.size * 4.6, 0.55, color));
    makeLabel(mesh, TYPES[planet.type].label, 'node-label planet-label', -planet.size - 0.15);
    anchor.add(mesh);
    meshes.push(mesh);

    const system = { pivot, anchor, planetMesh: mesh, moonPivots: [], moonRings: [], moonMeshes: [] };
    planetSystems[planet.type] = system;

    for (const item of NODES.filter(n => n.type === planet.type)) {
      // moons render smaller than their data size and orbit clear of the
      // planet surface; data radii stay the canonical spacing
      const moonSize = item.size * 0.72;
      const moonR = planet.size * 0.8 + item.orbit.radius;
      const ring = orbitRing(moonR, 0.14);
      ring.visible = false;
      anchor.add(ring);
      system.moonRings.push(ring);

      const moonPivot = new THREE.Group();
      anchor.add(moonPivot);

      const moonColor = item.color ?? color;
      const moon = new THREE.Mesh(
        new THREE.SphereGeometry(moonSize, 24, 18),
        new THREE.MeshStandardMaterial({
          color: moonColor, map: moonTexture, bumpMap: moonTexture, bumpScale: 0.06,
          metalness: 0.2, roughness: 0.35,
          emissive: moonColor, emissiveIntensity: 0.62,
        })
      );
      moon.position.set(moonR, 0, 0);
      moon.userData = { kind: 'moon', node: item, planetType: planet.type, baseScale: 1 };
      moon.add(makeHalo(moonSize * 4.4, 0.55, moonColor));
      makeLabel(moon, item.label, 'node-label moon-label', -moonSize - 0.1);
      moonPivot.add(moon);

      system.moonPivots.push({ pivot: moonPivot, orbit: item.orbit });
      system.moonMeshes.push(moon);
      meshById[item.id] = moon;
      meshes.push(moon);
    }
  }

  // ---- focus / reveal ----
  let focused = null;      // mesh or null
  let speedFactor = 1;     // orbital motion multiplier, eases toward target
  let speedTarget = 1;
  let focusEdges = [];     // Line objects, rebuilt per focus

  function clearReveal() {
    for (const sys of Object.values(planetSystems)) {
      sys.moonRings.forEach(r => { r.visible = false; });
      sys.moonMeshes.forEach(m => m.userData.labelEl.classList.remove('visible'));
    }
    focusEdges.forEach(l => { scene.remove(l); l.geometry.dispose(); l.material.dispose(); });
    focusEdges = [];
  }

  function revealPlanet(type) {
    const sys = planetSystems[type];
    sys.moonRings.forEach(r => { r.visible = true; });
    sys.moonMeshes.forEach(m => m.userData.labelEl.classList.add('visible'));

    // cross-link edges touching this planet's moons, built from frozen
    // world positions (motion is paused while focused)
    const ids = new Set(sys.moonMeshes.map(m => m.userData.node.id));
    const va = new THREE.Vector3(), vb = new THREE.Vector3();
    for (const [a, b] of EDGES) {
      if (!ids.has(a) && !ids.has(b)) continue;
      const ma = meshById[a], mb = meshById[b];
      if (!ma || !mb) continue;
      ma.getWorldPosition(va);
      mb.getWorldPosition(vb);
      const mid = va.clone().add(vb).multiplyScalar(0.5).multiplyScalar(1.07);
      const curve = new THREE.QuadraticBezierCurve3(va.clone(), mid, vb.clone());
      const geo = new THREE.BufferGeometry().setFromPoints(curve.getPoints(20));
      const line = new THREE.Line(geo, new THREE.LineBasicMaterial({
        color: 0xc9a86a, transparent: true, opacity: 0.3,
      }));
      scene.add(line);
      focusEdges.push(line);
    }
  }

  function focusMesh(mesh) {
    focused = mesh;
    speedTarget = 0;
    speedFactor = 0; // freeze instantly so the camera target holds still
    controls.autoRotate = false;
    lastInteraction = performance.now();

    clearReveal();
    const d = mesh.userData;
    if (d.kind === 'planet') {
      revealPlanet(d.planet.type);
    } else if (d.kind === 'moon') {
      revealPlanet(d.planetType);
    }

    const target = new THREE.Vector3();
    mesh.getWorldPosition(target);
    let dist;
    if (d.kind === 'sun') dist = 13;
    else if (d.kind === 'planet') {
      const maxMoonR = Math.max(...planetSystems[d.planet.type].moonPivots.map(m => m.orbit.radius), 1);
      dist = d.planet.size * 4 + (d.planet.size * 0.8 + maxMoonR) * 2.4;
    } else dist = 5;
    const dir = camera.position.clone().sub(controls.target).normalize();
    tween = {
      t: 0,
      fromTarget: controls.target.clone(),
      toTarget: target,
      fromPos: camera.position.clone(),
      toPos: target.clone().add(dir.multiplyScalar(dist)),
    };
  }

  function resetView() {
    focused = null;
    speedTarget = 1;
    clearReveal();
    tween = {
      t: 0,
      fromTarget: controls.target.clone(),
      toTarget: new THREE.Vector3(0, 0, 0),
      fromPos: camera.position.clone(),
      toPos: HOME_POS.clone(),
    };
  }

  // ---- interaction ----
  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2(-10, -10);
  let hovered = null;
  let pointerDownAt = null;
  let tween = null;

  renderer.domElement.addEventListener('pointermove', (e) => {
    pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
    pointer.y = -(e.clientY / window.innerHeight) * 2 + 1;
  });
  renderer.domElement.addEventListener('pointerdown', (e) => {
    pointerDownAt = [e.clientX, e.clientY];
  });
  renderer.domElement.addEventListener('pointerup', (e) => {
    lastInteraction = performance.now();
    if (!pointerDownAt) return;
    const moved = Math.hypot(e.clientX - pointerDownAt[0], e.clientY - pointerDownAt[1]);
    pointerDownAt = null;
    if (moved > 6) return; // it was a drag, not a click
    if (hovered) {
      focusMesh(hovered);
      if (hovered.userData.node) onNodeClick(hovered.userData.node);
      else if (onPanelDismiss) onPanelDismiss(); // planets have no panel
    } else if (focused) {
      resetView(); // empty-space click zooms back out and resumes motion
      if (onPanelDismiss) onPanelDismiss();
    }
  });

  // entrance
  const start = performance.now();
  const easeOut = (t) => 1 - Math.pow(1 - t, 3);

  function resize() {
    const w = window.innerWidth, h = window.innerHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
    labelRenderer.setSize(w, h);
  }
  window.addEventListener('resize', resize);
  resize();

  let disposed = false;
  let orbitTime = 0;
  let prevNow = start;

  function animate(now) {
    if (disposed) return;
    requestAnimationFrame(animate);
    const elapsed = (now - start) / 1000;
    const dt = Math.min(0.05, (now - prevNow) / 1000);
    prevNow = now;

    // orbital motion, eased to a stop while something is focused
    speedFactor += (speedTarget - speedFactor) * Math.min(1, dt * 3);
    orbitTime += dt * speedFactor;

    for (const planet of PLANETS) {
      const sys = planetSystems[planet.type];
      sys.pivot.rotation.y = planet.angle0 * DEG + orbitTime * planet.speed;
      // counter-rotate the anchor so moon orbits and labels stay stable
      sys.anchor.rotation.y = -sys.pivot.rotation.y;
      sys.moonPivots.forEach(({ pivot, orbit }) => {
        pivot.rotation.y = orbit.angle0 * DEG + orbitTime * orbit.speed;
      });
    }

    // entrance stagger + hover boost + sun life
    meshes.forEach((mesh, i) => {
      const enter = easeOut(Math.min(1, Math.max(0, (elapsed - i * 0.05) / 1.1)));
      const hoverBoost = mesh === hovered ? 1.25 : 1;
      mesh.scale.setScalar(enter * hoverBoost);
    });
    sun.rotation.y = elapsed * 0.12;
    sun.rotation.x = Math.sin(elapsed * 0.08) * 0.12;
    corona.material.opacity = 0.78 + Math.sin(elapsed * 1.1) * 0.09;

    if (elapsed > 0.9) labelMount.classList.add('labels-in');

    // resume slow rotation after idle, but never while focused
    if (!focused && !controls.autoRotate && lastInteraction &&
        performance.now() - lastInteraction > IDLE_RESUME_MS) {
      controls.autoRotate = true;
    }

    if (tween) {
      tween.t = Math.min(1, tween.t + 0.022);
      const k = easeOut(tween.t);
      controls.target.lerpVectors(tween.fromTarget, tween.toTarget, k);
      camera.position.lerpVectors(tween.fromPos, tween.toPos, k);
      if (tween.t >= 1) tween = null;
    }

    raycaster.setFromCamera(pointer, camera);
    const hit = raycaster.intersectObjects(meshes, false)[0];
    const next = hit ? hit.object : null;
    if (next !== hovered) {
      if (hovered) hovered.userData.labelEl.classList.remove('hot');
      hovered = next;
      if (hovered) hovered.userData.labelEl.classList.add('hot');
      renderer.domElement.style.cursor = hovered ? 'pointer' : 'grab';
    }

    controls.update();
    renderer.render(scene, camera);
    labelRenderer.render(scene, camera);
  }
  requestAnimationFrame(animate);

  return {
    resetView,
    dispose() {
      disposed = true;
      window.removeEventListener('resize', resize);
      renderer.dispose();
      mount.removeChild(renderer.domElement);
      labelMount.innerHTML = '';
    },
  };
}
