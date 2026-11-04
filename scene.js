/* Progressive 3D scene. THREE.js is loaded only where WebGL and motion are available.
 * If the CDN or WebGL is unavailable, the CSS 3D orbit sculpture remains visible.
 */
const wrap = document.getElementById('sculpture-wrap');
const canvas = document.getElementById('hero-canvas');
const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const small = window.matchMedia('(max-width: 640px)').matches;

const canWebGL = () => {
  try {
    const probe = document.createElement('canvas');
    return !!(probe.getContext('webgl2') || probe.getContext('webgl'));
  } catch { return false; }
};

if (wrap && canvas && !reduce && canWebGL()) {
  try {
    const THREE = await import('https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js');
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: !small, powerPreference: 'low-power' });
    renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 1.65));
    renderer.setClearColor(0x000000, 0);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.7;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(35, 1, .1, 100);
    camera.position.set(0, 0.1, 12.1);
    const group = new THREE.Group();
    group.rotation.set(-.16, .18, -.15);
    scene.add(group);

    const brass = new THREE.MeshStandardMaterial({ color: 0xc8a36d, metalness: .89, roughness: .23, emissive: 0x36200a, emissiveIntensity: .17, side: THREE.DoubleSide });
    const warmBrass = new THREE.MeshStandardMaterial({ color: 0xf2d4a1, metalness: .74, roughness: .20, emissive: 0x624526, emissiveIntensity: .08, side: THREE.DoubleSide });
    const pale = new THREE.MeshStandardMaterial({ color: 0x8eaaa0, metalness: .78, roughness: .22, emissive: 0x102a24, emissiveIntensity: .10, side: THREE.DoubleSide });
    const glass = new THREE.MeshPhysicalMaterial({ color: 0xc7b48b, metalness: .26, roughness: .10, transmission: .55, thickness: 1.15, ior: 1.32, clearcoat: 1, clearcoatRoughness: .09, flatShading: true, side: THREE.DoubleSide });

    const core = new THREE.Mesh(new THREE.IcosahedronGeometry(1.15, 1), glass);
    core.rotation.set(.25, -.35, .4);
    group.add(core);
    const innerCore = new THREE.Mesh(new THREE.IcosahedronGeometry(.54, 1), warmBrass);
    innerCore.rotation.set(-.25, .4, -.1);
    group.add(innerCore);
    const rings = [];
    function addRing(radius, tube, material, euler, s = 1) {
      const ring = new THREE.Mesh(new THREE.TorusGeometry(radius, tube, 12, 180), material);
      ring.rotation.set(...euler);
      ring.scale.set(s, s, s);
      group.add(ring);
      rings.push(ring);
      return ring;
    }
    addRing(3.05, .034, brass, [1.08, -.29, .34]);
    addRing(2.76, .021, warmBrass, [.28, 1.15, -.29]);
    addRing(2.36, .022, pale, [-.47, -.29, 1.08]);
    addRing(1.78, .025, brass, [.92, .34, -.9]);
    addRing(1.41, .012, warmBrass, [-.21, 1.27, .11]);
    addRing(3.25, .008, pale, [-.7, .5, .13]);

    // 3D arcs set on offset planes — metallic shavings orbit the central gem.
    const arcGeo = new THREE.TorusGeometry(3.48, .016, 6, 100, Math.PI * .28);
    const arcs = [];
    for (let i = 0; i < 8; i++) {
      const arc = new THREE.Mesh(arcGeo, i % 3 === 0 ? pale : brass);
      arc.rotation.set(i * .43, i * .72, i * .88);
      arc.scale.setScalar(.76 + i * .06);
      group.add(arc);
      arcs.push(arc);
    }

    // Floating minute gilded markers with real depth.
    const markerGeo = new THREE.SphereGeometry(.035, 8, 8);
    const markers = [];
    for (let i = 0; i < 28; i++) {
      const theta = i * Math.PI * (3 - Math.sqrt(5));
      const height = 1 - (i / 27) * 2;
      const r = Math.sqrt(1 - height * height);
      const dot = new THREE.Mesh(markerGeo, i % 3 ? brass : warmBrass);
      dot.position.set(Math.cos(theta) * r * 3.35, height * 3.35, Math.sin(theta) * r * 3.35);
      dot.scale.setScalar(i % 5 === 0 ? 1.9 : .7);
      group.add(dot);
      markers.push(dot);
    }
    // Brass gyroscopic axis.
    const stem = new THREE.Mesh(new THREE.CylinderGeometry(.023,.023,3.75,10), brass);
    stem.rotation.z = -.64;
    stem.rotation.x = .43;
    group.add(stem);

    const ambient = new THREE.AmbientLight(0xe6e6de, .65);scene.add(ambient);
    const key = new THREE.PointLight(0xffe6b8, 165, 28); key.position.set(-3, 4, 8);scene.add(key);
    const rim = new THREE.PointLight(0x6cb8a8, 85, 25); rim.position.set(4, -3, -1);scene.add(rim);
    const top = new THREE.PointLight(0xffc06b, 70, 20); top.position.set(0, -4, 6);scene.add(top);

    const pointer = { x: 0, y: 0 };
    window.addEventListener('pointermove', event => {
      pointer.x = (event.clientX / window.innerWidth - .5) * 2;
      pointer.y = (event.clientY / window.innerHeight - .5) * 2;
    }, { passive: true });

    function resize() {
      const rect = wrap.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;
      camera.aspect = rect.width / rect.height;
      camera.updateProjectionMatrix();
      renderer.setSize(rect.width, rect.height, false);
      group.scale.setScalar(Math.min(1, rect.width / 700));
    }
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(wrap);
    wrap.classList.add('has-webgl');

    let visible = true;
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; }, { threshold: 0 });
    observer.observe(wrap);
    const clock = new THREE.Clock();
    const animate = () => {
      requestAnimationFrame(animate);
      if (document.visibilityState !== 'visible' || !visible) { clock.getDelta(); return; }
      const elapsed = clock.getElapsedTime();
      group.rotation.y += (pointer.x * .12 + .16 + elapsed * .035 - group.rotation.y) * .03;
      group.rotation.x += (-pointer.y * .1 - .16 - group.rotation.x) * .03;
      group.position.y = Math.sin(elapsed * .45) * .09;
      core.rotation.x = elapsed * .11;
      core.rotation.y = elapsed * .09;
      innerCore.rotation.y = elapsed * -.2;
      rings[0].rotation.z += .0019;
      rings[1].rotation.y += .0016;
      rings[2].rotation.x -= .0017;
      rings[3].rotation.z -= .0011;
      rings[4].rotation.y += .0015;
      arcs.forEach((arc, i) => { arc.rotation.y += (i % 2 ? -.0009 : .001); });
      renderer.render(scene, camera);
    };
    animate();
  } catch (error) {
    console.warn('WebGL sculpture unavailable. Showing CSS 3D artwork instead.', error);
    wrap.classList.remove('has-webgl');
  }
}
