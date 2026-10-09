import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x070912);
scene.fog = new THREE.FogExp2(0x070912, 0.022);

const camera = new THREE.PerspectiveCamera(42, innerWidth / innerHeight, 0.1, 250);
camera.position.set(7.5, 4.1, 9.2);

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.setSize(innerWidth, innerHeight);
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.15;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.06;
controls.enablePan = false;
controls.minDistance = 5.2;
controls.maxDistance = 15;
controls.maxPolarAngle = Math.PI * 0.48;
controls.target.set(0, 0.8, 0);

// Materials
const paint = new THREE.MeshPhysicalMaterial({
  color: 0x2438a6, metalness: 0.82, roughness: 0.22,
  clearcoat: 1, clearcoatRoughness: 0.12
});
const carbon = new THREE.MeshStandardMaterial({ color: 0x101522, metalness: 0.75, roughness: 0.3 });
const glass = new THREE.MeshPhysicalMaterial({
  color: 0x071426, metalness: 0.45, roughness: 0.12,
  transmission: 0.12, transparent: true, opacity: 0.92
});
const tireMat = new THREE.MeshStandardMaterial({ color: 0x080a10, roughness: 0.78, metalness: 0.1 });
const rimMat = new THREE.MeshStandardMaterial({ color: 0xa4b6cc, metalness: 0.9, roughness: 0.2 });
const neonMat = new THREE.MeshBasicMaterial({ color: 0x6af4ff });
const redMat = new THREE.MeshBasicMaterial({ color: 0xff285e });
const whiteLightMat = new THREE.MeshBasicMaterial({ color: 0xe5ffff });

// Lighting
scene.add(new THREE.HemisphereLight(0x9ebeff, 0x11121c, 2.1));
const key = new THREE.DirectionalLight(0xffffff, 3.3);
key.position.set(4, 9, 6);
key.castShadow = true;
key.shadow.mapSize.set(1024, 1024);
scene.add(key);
const cyanLight = new THREE.PointLight(0x35dfff, 32, 13);
cyanLight.position.set(-4, 2, -2);
scene.add(cyanLight);
const magentaLight = new THREE.PointLight(0x693fff, 26, 12);
magentaLight.position.set(3, 1, 4);
scene.add(magentaLight);

// Ground and showroom
const ground = new THREE.Mesh(
  new THREE.PlaneGeometry(200, 200),
  new THREE.MeshStandardMaterial({ color: 0x080b15, metalness: 0.35, roughness: 0.42 })
);
ground.rotation.x = -Math.PI / 2;
ground.position.y = -0.02;
ground.receiveShadow = true;
scene.add(ground);

const grid = new THREE.GridHelper(80, 80, 0x24465d, 0x18243b);
grid.position.y = 0.005;
grid.material.transparent = true;
grid.material.opacity = 0.42;
scene.add(grid);

// Circular display rings
const stageRing = new THREE.Mesh(
  new THREE.TorusGeometry(3.3, 0.025, 10, 120),
  neonMat
);
stageRing.rotation.x = Math.PI / 2;
stageRing.position.y = 0.045;
scene.add(stageRing);

const outerRing = new THREE.Mesh(
  new THREE.TorusGeometry(4.15, 0.012, 8, 120),
  new THREE.MeshBasicMaterial({ color: 0x734fff, transparent: true, opacity: 0.65 })
);
outerRing.rotation.x = Math.PI / 2;
outerRing.position.y = 0.035;
scene.add(outerRing);

// Decorative floating lights
const particlesGeo = new THREE.BufferGeometry();
const particleCount = 650;
const particlePositions = new Float32Array(particleCount * 3);
for (let i = 0; i < particleCount; i++) {
  particlePositions[i * 3] = (Math.random() - 0.5) * 36;
  particlePositions[i * 3 + 1] = Math.random() * 12 + 0.2;
  particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 36;
}
particlesGeo.setAttribute("position", new THREE.BufferAttribute(particlePositions, 3));
const particles = new THREE.Points(
  particlesGeo,
  new THREE.PointsMaterial({ color: 0x83cfff, size: 0.035, transparent: true, opacity: 0.7 })
);
scene.add(particles);

// Build a fully procedural concept car. Front faces +X.
const car = new THREE.Group();
scene.add(car);

function addMesh(parent, geometry, material, position, scale, rotation) {
  const mesh = new THREE.Mesh(geometry, material);
  if (position) mesh.position.set(...position);
  if (scale) mesh.scale.set(...scale);
  if (rotation) mesh.rotation.set(...rotation);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  parent.add(mesh);
  return mesh;
}

function makeBodyShape() {
  const shape = new THREE.Shape();
  shape.moveTo(-2.45, 0.42);
  shape.lineTo(-2.2, 0.72);
  shape.lineTo(-1.45, 0.82);
  shape.lineTo(-0.85, 1.0);
  shape.lineTo(0.6, 0.98);
  shape.lineTo(1.45, 0.78);
  shape.lineTo(2.2, 0.65);
  shape.lineTo(2.48, 0.45);
  shape.lineTo(2.35, 0.22);
  shape.lineTo(-2.22, 0.22);
  shape.closePath();
  const geo = new THREE.ExtrudeGeometry(shape, { depth: 1.45, bevelEnabled: true, bevelSegments: 3, steps: 1, bevelSize: 0.08, bevelThickness: 0.07 });
  geo.translate(0, 0, -0.725);
  return geo;
}
addMesh(car, makeBodyShape(), paint, [0, 0, 0], [1, 1, 1], [0, 0, 0]);

// Sculpted front hood / nose
addMesh(car, new THREE.BoxGeometry(1.35, 0.18, 1.25), paint, [1.45, 0.72, 0], [1, 1, 1], [0, 0, 0]);
addMesh(car, new THREE.BoxGeometry(0.42, 0.13, 1.15), carbon, [2.14, 0.43, 0], [1, 1, 1], [0, 0, 0]);

// Low cockpit with angular windows
const cabinShape = new THREE.Shape();
cabinShape.moveTo(-1.25, 0.0);
cabinShape.lineTo(-0.78, 0.58);
cabinShape.lineTo(0.42, 0.58);
cabinShape.lineTo(1.0, 0.02);
cabinShape.closePath();
const cabinGeo = new THREE.ExtrudeGeometry(cabinShape, { depth: 0.94, bevelEnabled: true, bevelSegments: 2, bevelSize: 0.025, bevelThickness: 0.025 });
cabinGeo.translate(0, 0, -0.47);
addMesh(car, cabinGeo, glass, [-0.12, 0.92, 0], [1, 1, 1], [0, 0, 0]);

// Roof panel and side window trim
addMesh(car, new THREE.BoxGeometry(0.85, 0.045, 0.91), carbon, [-0.18, 1.49, 0], [1, 1, 1]);
for (const side of [-1, 1]) {
  addMesh(car, new THREE.BoxGeometry(1.2, 0.035, 0.035), neonMat, [-0.05, 1.18, side * 0.49], [1, 1, 1], [0, 0, -0.14]);
  addMesh(car, new THREE.BoxGeometry(0.55, 0.025, 0.025), carbon, [0.05, 1.38, side * 0.49]);
}

// Front and rear light strips
addMesh(car, new THREE.BoxGeometry(0.055, 0.08, 1.0), whiteLightMat, [2.37, 0.58, 0], [1, 1, 1]);
addMesh(car, new THREE.BoxGeometry(0.065, 0.07, 1.1), redMat, [-2.31, 0.59, 0], [1, 1, 1]);
for (const side of [-1, 1]) {
  addMesh(car, new THREE.BoxGeometry(0.48, 0.045, 0.06), neonMat, [1.9, 0.48, side * 0.54], [1, 1, 1], [0, 0.2, 0]);
  // Side skirts
  addMesh(car, new THREE.BoxGeometry(2.2, 0.09, 0.11), carbon, [-0.05, 0.29, side * 0.72]);
  addMesh(car, new THREE.BoxGeometry(1.2, 0.025, 0.025), neonMat, [-0.1, 0.34, side * 0.78]);
}

// Rear diffuser and spoiler
addMesh(car, new THREE.BoxGeometry(0.52, 0.16, 1.25), carbon, [-2.15, 0.35, 0]);
for (const side of [-1, 1]) {
  addMesh(car, new THREE.BoxGeometry(0.12, 0.36, 0.12), carbon, [-1.95, 0.86, side * 0.5]);
}
addMesh(car, new THREE.BoxGeometry(0.55, 0.07, 1.45), paint, [-1.98, 1.05, 0], [1, 1, 1], [0, 0, -0.03]);

// Wheels: cylinders aligned to the Z axis, with luminous rim and spokes.
const wheels = [];
function createWheel(x, z) {
  const wheel = new THREE.Group();
  wheel.position.set(x, 0.48, z);
  car.add(wheel);
  const tire = addMesh(wheel, new THREE.CylinderGeometry(0.48, 0.48, 0.24, 32), tireMat, [0, 0, 0], [1, 1, 1], [Math.PI / 2, 0, 0]);
  tire.castShadow = true;
  const rim = addMesh(wheel, new THREE.CylinderGeometry(0.31, 0.31, 0.255, 24), rimMat, [0, 0, 0], [1, 1, 1], [Math.PI / 2, 0, 0]);
  const hub = addMesh(wheel, new THREE.CylinderGeometry(0.105, 0.105, 0.27, 16), neonMat, [0, 0, 0], [1, 1, 1], [Math.PI / 2, 0, 0]);
  for (let i = 0; i < 6; i++) {
    const angle = i * Math.PI / 3;
    addMesh(wheel, new THREE.BoxGeometry(0.045, 0.52, 0.035), carbon, [Math.sin(angle) * 0.18, Math.cos(angle) * 0.18, 0], [1, 1, 1], [0, 0, angle]);
  }
  wheels.push(wheel);
}
createWheel(1.45, 0.72);
createWheel(1.45, -0.72);
createWheel(-1.45, 0.72);
createWheel(-1.45, -0.72);

// Underbody glow
const underGlow = new THREE.Mesh(
  new THREE.PlaneGeometry(4.3, 1.5),
  new THREE.MeshBasicMaterial({ color: 0x1b9eff, transparent: true, opacity: 0.17, side: THREE.DoubleSide })
);
underGlow.rotation.x = -Math.PI / 2;
underGlow.position.y = 0.08;
car.add(underGlow);

// Car is a single coherent 3D model made from Three.js geometry.
// Center vehicle visually in scene.
car.position.y = 0.02;

// Interactions
let driveMode = false;
let lightsOn = true;
let energy = 100;
let toastTimer;

function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 1900);
}

document.getElementById("drive-button").addEventListener("click", () => {
  driveMode = !driveMode;
  document.getElementById("drive-button").innerHTML = driveMode ? 'STOP DRIVE <span>Ⅱ</span>' : 'ACTIVATE DRIVE <span>↗</span>';
  document.getElementById("mode-label").textContent = driveMode ? "DRIVE MODE ACTIVE" : "SHOWROOM MODE";
  showToast(driveMode ? "DRIVE MODE ACTIVATED" : "RETURNED TO SHOWROOM");
});

document.getElementById("lights-button").addEventListener("click", () => {
  lightsOn = !lightsOn;
  document.getElementById("lights-button").textContent = `LIGHTS: ${lightsOn ? "ON" : "OFF"}`;
  neonMat.color.setHex(lightsOn ? 0x6af4ff : 0x24313a);
  whiteLightMat.color.setHex(lightsOn ? 0xe5ffff : 0x29313d);
  redMat.color.setHex(lightsOn ? 0xff285e : 0x3b1824);
  cyanLight.intensity = lightsOn ? 32 : 3;
  magentaLight.intensity = lightsOn ? 26 : 4;
  underGlow.material.opacity = lightsOn ? 0.17 : 0.025;
  showToast(lightsOn ? "NEON LIGHTS ENABLED" : "NEON LIGHTS DISABLED");
});

const clock = new THREE.Clock();
let elapsed = 0;
function animate() {
  requestAnimationFrame(animate);
  const dt = Math.min(clock.getDelta(), 0.04);
  elapsed += dt;

  // Subtle idle movement; drive mode adds stronger movement and wheel spin.
  car.rotation.y = Math.sin(elapsed * (driveMode ? 0.85 : 0.22)) * (driveMode ? 0.28 : 0.08);
  car.position.y = 0.02 + Math.sin(elapsed * (driveMode ? 5 : 1.2)) * (driveMode ? 0.045 : 0.018);
  wheels.forEach(wheel => {
    wheel.rotation.x += dt * (driveMode ? 8 : 0.2);
  });
  particles.rotation.y += dt * 0.008;
  stageRing.rotation.z += dt * 0.08;
  outerRing.rotation.z -= dt * 0.035;

  if (driveMode) {
    energy = Math.max(12, energy - dt * 1.5);
  } else {
    energy = Math.min(100, energy + dt * 2.8);
  }
  document.getElementById("energy-value").textContent = `${Math.round(energy)}%`;
  document.getElementById("energy-bar").style.width = `${energy}%`;

  controls.update();
  renderer.render(scene, camera);
}
animate();

setTimeout(() => {
  const screen = document.getElementById("loading-screen");
  screen.style.opacity = "0";
  setTimeout(() => screen.remove(), 700);
}, 1400);

window.addEventListener("resize", () => {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
});
