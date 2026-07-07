import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { CSS2DRenderer, CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';
import { NODES, EDGES, TYPES } from './data.js';

const IDLE_RESUME_MS = 18000;

export function createScene({ mount, labelMount, onNodeClick }) {
  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x0a0a0c, 0.016);

  const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 200);
  camera.position.set(0, 1.6, 16.5);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  mount.appendChild(renderer.domElement);

  const labelRenderer = new CSS2DRenderer({ element: labelMount });

  // lighting: warm key, cool violet rim, low ambient
  scene.add(new THREE.AmbientLight(0xc9a86a, 0.35));
  const key = new THREE.DirectionalLight(0xf0dcb0, 2.2);
  key.position.set(6, 8, 10);
  scene.add(key);
  const rim = new THREE.DirectionalLight(0x6a5a8a, 1.4);
  rim.position.set(-8, -4, -6);
  scene.add(rim);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.06;
  controls.enablePan = false;
  controls.minDistance = 6;
  controls.maxDistance = 30;
  controls.autoRotate = true;
  controls.autoRotateSpeed = 0.5;

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

  // halo sprite texture
  const haloTexture = (() => {
    const c = document.createElement('canvas');
    c.width = c.height = 128;
    const ctx = c.getContext('2d');
    const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
    g.addColorStop(0, 'rgba(233,217,184,0.55)');
    g.addColorStop(0.35, 'rgba(201,168,106,0.18)');
    g.addColorStop(1, 'rgba(201,168,106,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 128, 128);
    return new THREE.CanvasTexture(c);
  })();

  // nodes
  const nodeGroup = new THREE.Group();
  scene.add(nodeGroup);
  const meshes = [];

  for (const node of NODES) {
    const color = TYPES[node.type].color;
    let mesh;
    if (node.id === 'me') {
      mesh = new THREE.Mesh(
        new THREE.IcosahedronGeometry(node.size, 0),
        new THREE.MeshStandardMaterial({
          color: 0xdec894, flatShading: true, metalness: 0.85, roughness: 0.22,
          emissive: 0x6a521e, emissiveIntensity: 0.55,
        })
      );
    } else {
      mesh = new THREE.Mesh(
        new THREE.SphereGeometry(node.size, 28, 20),
        new THREE.MeshStandardMaterial({
          color, metalness: 0.55, roughness: 0.35,
          emissive: color, emissiveIntensity: 0.08,
        })
      );
    }
    mesh.position.set(...node.pos);
    mesh.userData.node = node;
    mesh.userData.baseScale = 1;

    const halo = new THREE.Sprite(new THREE.SpriteMaterial({
      map: haloTexture, transparent: true, depthWrite: false,
      opacity: node.id === 'me' ? 0.9 : 0.55, blending: THREE.AdditiveBlending,
    }));
    halo.scale.setScalar(node.size * 5.2);
    mesh.add(halo);

    const labelEl = document.createElement('div');
    labelEl.className = node.id === 'me' ? 'node-label me-label' : 'node-label';
    labelEl.textContent = node.label;
    const label = new CSS2DObject(labelEl);
    label.position.set(0, -node.size, 0);
    mesh.add(label);
    mesh.userData.labelEl = labelEl;

    nodeGroup.add(mesh);
    meshes.push(mesh);
  }

  // gently bowed edges
  {
    const mat = new THREE.LineBasicMaterial({
      color: 0xc9a86a, transparent: true, opacity: 0.2,
    });
    const byId = Object.fromEntries(NODES.map(n => [n.id, new THREE.Vector3(...n.pos)]));
    for (const [a, b] of EDGES) {
      const va = byId[a], vb = byId[b];
      const mid = va.clone().add(vb).multiplyScalar(0.5);
      mid.multiplyScalar(a === 'me' || b === 'me' ? 1.12 : 1.08);
      const curve = new THREE.QuadraticBezierCurve3(va, mid, vb);
      const geo = new THREE.BufferGeometry().setFromPoints(curve.getPoints(18));
      scene.add(new THREE.Line(geo, mat));
    }
  }

  // interaction
  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2(-10, -10);
  let hovered = null;
  let pointerDownAt = null;

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
      focusNode(hovered);
      onNodeClick(hovered.userData.node);
    }
  });

  // camera focus tween
  let tween = null;
  function focusNode(mesh) {
    const target = mesh.position.clone();
    const dir = camera.position.clone().sub(controls.target).normalize();
    const dist = Math.max(9, mesh.userData.node.size * 13);
    tween = {
      t: 0,
      fromTarget: controls.target.clone(),
      toTarget: target,
      fromPos: camera.position.clone(),
      toPos: target.clone().add(dir.multiplyScalar(dist)),
    };
  }
  function resetView() {
    tween = {
      t: 0,
      fromTarget: controls.target.clone(),
      toTarget: new THREE.Vector3(0, 0, 0),
      fromPos: camera.position.clone(),
      toPos: new THREE.Vector3(0, 1.6, 16.5),
    };
  }

  // entrance + idle float
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
  function animate(now) {
    if (disposed) return;
    requestAnimationFrame(animate);
    const elapsed = (now - start) / 1000;

    meshes.forEach((mesh, i) => {
      const n = mesh.userData.node;
      const enter = easeOut(Math.min(1, Math.max(0, (elapsed - i * 0.06) / 1.1)));
      const hoverBoost = mesh === hovered ? 1.3 : 1;
      mesh.scale.setScalar(enter * hoverBoost);
      if (n.id === 'me') {
        mesh.rotation.y = elapsed * 0.18;
        mesh.rotation.x = Math.sin(elapsed * 0.1) * 0.15;
      } else {
        mesh.position.y = n.pos[1] + Math.sin(elapsed * 0.5 + i * 1.7) * 0.14;
      }
    });

    if (elapsed > 0.9) labelMount.classList.add('labels-in');

    // resume slow rotation after idle
    if (!controls.autoRotate && lastInteraction &&
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
