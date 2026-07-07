"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

/**
 * Scroll-driven cinematic hero for the Sony ZV-E10 rig (DEMO).
 *
 * How it works
 * ─────────────
 * - The page scroll position maps to a progress value 0→1 (scrubbed, never
 *   autoplaying). Progress eases toward the real scroll with a lerp, which
 *   gives every movement momentum — fast flicks glide to a stop.
 * - A small keyframe track (K) defines the model's rotation, tilt and the
 *   camera dolly at four story beats; frames in between are interpolated
 *   with cubic ease-in-out, so each beat arrives softly.
 * - When the user stops scrolling, a time-based sine "breathing" float takes
 *   over (position bob + micro roll). Scroll velocity adds a reactive lean.
 * - Lighting: neutral RoomEnvironment for reflections (the lens glass and
 *   body plastics pick it up), a soft key light with PCF shadows onto a
 *   ShadowMaterial disc, and a faint crimson rim to tie into the brand.
 * - Performance: DPR capped at 2, one 2048 shadow map, geometry untouched,
 *   everything disposed on unmount. The model is centered/scaled/pivoted
 *   automatically from its bounding box, so any GLB drop-in works.
 */

/* story beats: t = scroll progress, ry/rx = model spin & tilt,
   my = model rise, cz/cx = camera dolly & drift */
const K = [
  { t: 0.0, ry: -0.55, rx: 0.06, my: 0.0, cz: 4.6, cx: 0.0 },
  { t: 0.33, ry: 1.9, rx: 0.28, my: 0.12, cz: 3.3, cx: 0.55 },
  { t: 0.66, ry: 3.7, rx: -0.18, my: -0.1, cz: 2.9, cx: -0.55 },
  { t: 1.0, ry: 5.85, rx: 0.05, my: 0.04, cz: 4.0, cx: 0.0 },
];

const easeInOut = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);

/** interpolate the keyframe track at progress p */
function pose(p: number) {
  let a = K[0];
  let b = K[K.length - 1];
  for (let i = 0; i < K.length - 1; i++) {
    if (p >= K[i].t && p <= K[i + 1].t) {
      a = K[i];
      b = K[i + 1];
      break;
    }
  }
  const span = b.t - a.t || 1;
  const e = easeInOut(THREE.MathUtils.clamp((p - a.t) / span, 0, 1));
  const mix = (ka: number, kb: number) => ka + (kb - ka) * e;
  return {
    ry: mix(a.ry, b.ry),
    rx: mix(a.rx, b.rx),
    my: mix(a.my, b.my),
    cz: mix(a.cz, b.cz),
    cx: mix(a.cx, b.cx),
  };
}

export default function CameraRigDemo() {
  const mountRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let disposed = false;

    /* renderer — transparent so the site background/theme shows through */
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, mount.clientWidth / mount.clientHeight, 0.1, 50);
    camera.position.set(0, 0.4, 4.6);

    /* image-based reflections without any HDR download */
    const pmrem = new THREE.PMREMGenerator(renderer);
    scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;

    /* lights: soft key with shadows + faint crimson rim (brand accent) */
    const key = new THREE.DirectionalLight(0xffffff, 2.4);
    key.position.set(4, 6, 5);
    key.castShadow = true;
    key.shadow.mapSize.set(2048, 2048);
    key.shadow.camera.near = 1;
    key.shadow.camera.far = 20;
    key.shadow.radius = 8;
    key.shadow.bias = -0.0002;
    scene.add(key);
    const rim = new THREE.DirectionalLight(0xdc143c, 0.55);
    rim.position.set(-5, 2, -4);
    scene.add(rim);
    scene.add(new THREE.AmbientLight(0xffffff, 0.35));

    /* rig group = pivot; the model is centered inside it automatically */
    const rig = new THREE.Group();
    scene.add(rig);

    const loader = new GLTFLoader();
    loader.load(
      "/models/zv-e10.glb",
      (gltf) => {
        if (disposed) return;
        const model = gltf.scene;

        // this GLB is authored lens-up — stand it upright, lens toward viewer
        model.rotation.x = -Math.PI / 2;
        model.updateMatrixWorld(true);

        // auto center + scale: fit the longest side to ~2.2 world units
        const box = new THREE.Box3().setFromObject(model);
        const size = box.getSize(new THREE.Vector3());
        const center = box.getCenter(new THREE.Vector3());
        const scale = 2.2 / Math.max(size.x, size.y, size.z);
        model.scale.setScalar(scale);
        model.position.sub(center.multiplyScalar(scale)); // pivot = true center

        model.traverse((o) => {
          if ((o as THREE.Mesh).isMesh) {
            o.castShadow = true;
            o.receiveShadow = true;
          }
        });
        rig.add(model);

        // soft contact shadow disc just under the model
        const bottom = -size.y * scale * 0.5 - 0.05;
        const ground = new THREE.Mesh(
          new THREE.CircleGeometry(3, 48),
          new THREE.ShadowMaterial({ opacity: 0.28 })
        );
        ground.rotation.x = -Math.PI / 2;
        ground.position.y = bottom;
        ground.receiveShadow = true;
        scene.add(ground);

        // phones get a slightly smaller rig so it never crowds the copy
        if (mount.clientWidth < 640) rig.scale.setScalar(0.82);
        setReady(true);
      },
      undefined,
      () => setReady(true) // don't trap the page behind a failed load
    );

    /* scroll scrubbing with momentum */
    let target = 0; // real scroll progress
    let p = 0; // eased (displayed) progress
    let vel = 0; // for the reactive lean
    const readScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      target = max > 0 ? window.scrollY / max : 0;
    };
    readScroll();
    window.addEventListener("scroll", readScroll, { passive: true });

    const onResize = () => {
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      if (!w || !h) return; // ancestor transform can briefly collapse the mount
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", onResize);
    const ro = new ResizeObserver(onResize);
    ro.observe(mount);

    /* render loop */
    const clock = new THREE.Clock();
    let rafId = 0;
    const tick = () => {
      rafId = requestAnimationFrame(tick);
      const t = clock.getElapsedTime();

      const prev = p;
      p += (target - p) * (reduced ? 1 : 0.07); // momentum lerp
      vel = THREE.MathUtils.lerp(vel, p - prev, 0.1);
      if (!disposed) setProgress(p);

      const k = pose(p);
      // idle float fades out while actively scrolling
      const idle = reduced ? 0 : Math.max(0, 1 - Math.abs(vel) * 220);
      rig.rotation.y = k.ry;
      rig.rotation.x = k.rx + Math.sin(t * 0.7) * 0.02 * idle;
      rig.rotation.z = Math.sin(t * 0.5) * 0.025 * idle + vel * 14; // reactive lean
      rig.position.y = k.my + Math.sin(t * 0.9) * 0.045 * idle;

      camera.position.x += (k.cx - camera.position.x) * 0.08;
      camera.position.z += (k.cz - camera.position.z) * 0.08;
      camera.lookAt(rig.position.x, rig.position.y + 0.05, rig.position.z); // rig stays the focal point

      renderer.render(scene, camera);
    };
    rafId = requestAnimationFrame(tick);

    return () => {
      disposed = true;
      cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", readScroll);
      window.removeEventListener("resize", onResize);
      ro.disconnect();
      scene.traverse((o) => {
        const m = o as THREE.Mesh;
        if (m.isMesh) {
          m.geometry.dispose();
          (Array.isArray(m.material) ? m.material : [m.material]).forEach((mat) => mat.dispose());
        }
      });
      pmrem.dispose();
      renderer.dispose();
      if (renderer.domElement.parentElement === mount) mount.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <>
      {/* fixed stage behind the scrolling copy */}
      <div ref={mountRef} className="fixed inset-0 z-0" aria-hidden />
      {/* loading veil until the GLB is in */}
      <div
        aria-hidden
        className={`pointer-events-none fixed inset-0 z-10 flex items-center justify-center bg-bg transition-opacity duration-700 ${ready ? "opacity-0" : "opacity-100"}`}
      >
        <span className="font-mono text-xs tracking-[0.3em] text-muted">LOADING RIG…</span>
      </div>
      {/* progress readout, mono — helps you feel the scrub in the demo */}
      <div className="pointer-events-none fixed bottom-6 right-6 z-10 font-mono text-xs tabular-nums text-muted">
        SCRUB {(progress * 100).toFixed(0).padStart(3, "0")}%
      </div>
    </>
  );
}
