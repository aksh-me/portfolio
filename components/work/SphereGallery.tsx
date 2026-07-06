"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import * as THREE from "three";
import gsap from "gsap";
import type { GalleryItem } from "@/data/content";

type SphereGalleryProps = {
  items: GalleryItem[];
};

/* ── layout constants ──────────────────────────────────────────────────────── */
const RADIUS = 22;
const CARD_W = 10;
const CARD_H = 7.8; // includes the label zones baked into the texture
const ROWS = [
  { lat: 0.5, share: 0.3 },
  { lat: 0, share: 0.4 },
  { lat: -0.5, share: 0.3 },
];
const PITCH_LIMIT = 0.55;

/* ── card texture ──────────────────────────────────────────────────────────
   Each card is a single canvas texture: hairline-bordered cell with a tiny
   mono caption top-left, title top-right, tag pills bottom-left and the
   year bottom-right — the image fills the middle. */
const TEX_W = 1024;
const TEX_H = 800;

function drawCard(
  canvas: HTMLCanvasElement,
  item: GalleryItem,
  fonts: { mono: string; display: string },
  img?: HTMLImageElement
) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const pad = 36;
  const imgTop = 104;
  const imgBottom = TEX_H - 128;

  // cell background + hairline border
  ctx.clearRect(0, 0, TEX_W, TEX_H);
  ctx.fillStyle = "#101012";
  ctx.fillRect(0, 0, TEX_W, TEX_H);
  ctx.strokeStyle = "rgba(242,240,237,0.16)";
  ctx.lineWidth = 2;
  ctx.strokeRect(1, 1, TEX_W - 2, TEX_H - 2);

  // header: caption (top-left) / title (top-right)
  ctx.textBaseline = "middle";
  ctx.fillStyle = "#8a8784";
  ctx.font = `24px ${fonts.mono}`;
  ctx.textAlign = "left";
  ctx.fillText(item.caption, pad, 56, TEX_W * 0.4);

  ctx.fillStyle = "#f2f0ed";
  ctx.font = `500 32px ${fonts.display}`;
  ctx.textAlign = "right";
  let title = item.title;
  while (ctx.measureText(title).width > TEX_W * 0.52 && title.length > 4) {
    title = title.slice(0, -2);
  }
  if (title !== item.title) title = `${title.trimEnd()}…`;
  ctx.fillText(title, TEX_W - pad, 56);

  // image (cover-cropped)
  const iw = TEX_W - pad * 2;
  const ih = imgBottom - imgTop;
  if (img && img.width > 0) {
    const scale = Math.max(iw / img.width, ih / img.height);
    const sw = iw / scale;
    const sh = ih / scale;
    const sx = (img.width - sw) / 2;
    const sy = (img.height - sh) / 2;
    ctx.drawImage(img, sx, sy, sw, sh, pad, imgTop, iw, ih);
  } else {
    ctx.fillStyle = "#1a1a1d";
    ctx.fillRect(pad, imgTop, iw, ih);
  }

  // footer: tag pills (bottom-left) / year (bottom-right)
  const pillY = TEX_H - 76;
  let px = pad;
  ctx.font = `22px ${fonts.mono}`;
  ctx.textAlign = "left";
  for (const tag of item.tags.slice(0, 3)) {
    const tw = ctx.measureText(tag).width;
    const pw = tw + 44;
    ctx.strokeStyle = "rgba(242,240,237,0.22)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(px, pillY - 26, pw, 52, 26);
    ctx.stroke();
    ctx.fillStyle = "#c9c6c2";
    ctx.fillText(tag, px + 22, pillY + 2);
    px += pw + 14;
  }
  ctx.fillStyle = "#dc143c";
  ctx.font = `24px ${fonts.mono}`;
  ctx.textAlign = "right";
  ctx.fillText(item.year, TEX_W - pad, pillY + 2);
}

/* ── the gallery ──────────────────────────────────────────────────────────── */
export default function SphereGallery({ items }: SphereGalleryProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const fadeRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [progress, setProgress] = useState(0);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    const fadeEl = fadeRef.current;
    if (!container || !fadeEl) return;

    let disposed = false;

    /* renderer / scene / camera */
    const scene = new THREE.Scene();
    const rootStyle = getComputedStyle(document.documentElement);
    const bg = rootStyle.getPropertyValue("--bg").trim() || "#0a0a0b";
    scene.background = new THREE.Color(bg);

    const camera = new THREE.PerspectiveCamera(
      85, // wide FOV for the slight fisheye curvature feel
      container.clientWidth / container.clientHeight,
      0.1,
      200
    );
    camera.rotation.order = "YXZ";
    camera.position.set(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "high-performance" });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.domElement.style.touchAction = "none";
    renderer.domElement.style.display = "block";
    container.appendChild(renderer.domElement);

    const fonts = {
      mono: getComputedStyle(document.body).getPropertyValue("--font-mono").trim() || "monospace",
      display: rootStyle.getPropertyValue("--font-display").trim() || "sans-serif",
    };

    /* cards on the inside of the sphere — geometry is shared */
    const geometry = new THREE.PlaneGeometry(CARD_W, CARD_H);
    const meshes: THREE.Mesh<THREE.PlaneGeometry, THREE.MeshBasicMaterial>[] = [];
    const manager = new THREE.LoadingManager();
    manager.onProgress = (_url, loaded, total) => {
      if (!disposed) setProgress(Math.round((loaded / total) * 100));
    };
    manager.onLoad = () => {
      if (!disposed) setReady(true);
    };
    manager.onError = () => {
      // a failed placeholder image shouldn't block the gallery
      if (!disposed) setReady(true);
    };
    const imageLoader = new THREE.ImageLoader(manager);
    imageLoader.setCrossOrigin("anonymous");

    // split items across three latitude rows
    let cursor = 0;
    const rowsWithCounts = ROWS.map((row, i) => {
      const count =
        i === ROWS.length - 1
          ? items.length - cursor
          : Math.round(items.length * row.share);
      const slice = items.slice(cursor, cursor + count);
      cursor += count;
      return { ...row, slice };
    });

    for (const row of rowsWithCounts) {
      row.slice.forEach((item, i) => {
        const theta = (i / row.slice.length) * Math.PI * 2 + row.lat * 2; // offset rows so columns don't align
        const x = RADIUS * Math.cos(row.lat) * Math.sin(theta);
        const y = RADIUS * Math.sin(row.lat);
        const z = RADIUS * Math.cos(row.lat) * Math.cos(theta);

        const canvas = document.createElement("canvas");
        canvas.width = TEX_W;
        canvas.height = TEX_H;
        drawCard(canvas, item, fonts);

        const texture = new THREE.CanvasTexture(canvas);
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.anisotropy = Math.min(4, renderer.capabilities.getMaxAnisotropy());

        const material = new THREE.MeshBasicMaterial({ map: texture });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(x, y, z);
        mesh.lookAt(0, 0, 0);
        mesh.userData = { item, brightness: 1 };
        scene.add(mesh);
        meshes.push(mesh);

        imageLoader.load(item.image, (img) => {
          if (disposed) return;
          drawCard(canvas, item, fonts, img);
          texture.needsUpdate = true;
        });
      });
    }

    /* camera control state — Lenis-style weighted easing */
    let yaw = 0;
    let pitch = 0;
    let targetYaw = 0;
    let targetPitch = 0;
    let dragging = false;
    let animatingOut = false;
    let lastX = 0;
    let lastY = 0;
    let velX = 0;
    let downX = 0;
    let downY = 0;
    let moved = 0;
    let lastInteraction = performance.now();
    let hovered: (typeof meshes)[number] | null = null;

    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2(-10, -10);

    const setCursorLabel = (label: string) => {
      document.dispatchEvent(new CustomEvent("cursor:label", { detail: label }));
    };

    const onPointerDown = (e: PointerEvent) => {
      if (animatingOut) return;
      dragging = true;
      lastX = downX = e.clientX;
      lastY = downY = e.clientY;
      moved = 0;
      velX = 0;
      lastInteraction = performance.now();
      renderer.domElement.setPointerCapture(e.pointerId);
    };

    const onPointerMove = (e: PointerEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      if (!dragging || animatingOut) return;
      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;
      lastX = e.clientX;
      lastY = e.clientY;
      moved = Math.max(moved, Math.hypot(e.clientX - downX, e.clientY - downY));
      targetYaw += dx * 0.0028;
      targetPitch = THREE.MathUtils.clamp(targetPitch + dy * 0.0028, -PITCH_LIMIT, PITCH_LIMIT);
      velX = velX * 0.6 + dx * 0.4;
      lastInteraction = performance.now();
    };

    const onPointerUp = (e: PointerEvent) => {
      if (!dragging) return;
      dragging = false;
      lastInteraction = performance.now();
      // inertia: throw the wall and let the lerp glide it to a stop
      targetYaw += velX * 0.045;

      if (moved < 6 && hovered && !animatingOut) {
        selectCard(hovered);
      }
      try {
        renderer.domElement.releasePointerCapture(e.pointerId);
      } catch {
        /* already released */
      }
    };

    const onWheel = (e: WheelEvent) => {
      if (animatingOut) return;
      e.preventDefault();
      targetYaw += (e.deltaY + e.deltaX) * 0.00085;
      lastInteraction = performance.now();
    };

    /* click → GSAP push-in, fade, then route */
    const selectCard = (mesh: (typeof meshes)[number]) => {
      animatingOut = true;
      setCursorLabel("");
      const item = mesh.userData.item as GalleryItem;
      const p = mesh.position;

      // center the card first: solve yaw/pitch that point the camera at it
      const targetPitchTo = Math.asin(p.y / p.length());
      let yawTo = Math.atan2(-p.x, -p.z);
      const twoPi = Math.PI * 2;
      let diff = (yawTo - yaw) % twoPi;
      if (diff > Math.PI) diff -= twoPi;
      if (diff < -Math.PI) diff += twoPi;
      yawTo = yaw + diff;

      const rot = { yaw, pitch };
      gsap
        .timeline({
          onComplete: () => router.push(item.href),
        })
        .to(rot, {
          yaw: yawTo,
          pitch: targetPitchTo,
          duration: 0.65,
          ease: "power2.inOut",
          onUpdate: () => {
            yaw = targetYaw = rot.yaw;
            pitch = targetPitch = rot.pitch;
          },
        })
        .to(
          camera.position,
          { x: p.x * 0.55, y: p.y * 0.55, z: p.z * 0.55, duration: 0.9, ease: "power3.inOut" },
          "-=0.25"
        )
        .to(mesh.scale, { x: 1.3, y: 1.3, z: 1.3, duration: 0.9, ease: "power3.inOut" }, "<")
        .to(fadeEl, { opacity: 1, duration: 0.4, ease: "power2.in" }, "-=0.35");
    };

    /* render loop */
    let rafId: number;
    const tick = () => {
      rafId = requestAnimationFrame(tick);

      if (!animatingOut) {
        // idle drift after 2.5s without input
        if (!dragging && performance.now() - lastInteraction > 2500) {
          targetYaw += 0.00055;
        }
        yaw += (targetYaw - yaw) * 0.075;
        pitch += (targetPitch - pitch) * 0.075;
      }
      camera.rotation.y = yaw;
      camera.rotation.x = pitch;

      // hover: raycast, scale up + brighten the hit, dim the rest
      if (!animatingOut) {
        raycaster.setFromCamera(pointer, camera);
        const hit = raycaster.intersectObjects(meshes, false)[0];
        const next = (hit?.object as (typeof meshes)[number]) ?? null;
        if (next !== hovered) {
          hovered = next;
          setCursorLabel(hovered ? "View" : "");
        }
      }
      for (const mesh of meshes) {
        const isHover = mesh === hovered && !animatingOut;
        const targetScale = isHover ? 1.05 : 1;
        mesh.scale.x += (targetScale - mesh.scale.x) * 0.12;
        mesh.scale.y += (targetScale - mesh.scale.y) * 0.12;
        const targetBrightness = hovered && !isHover && !animatingOut ? 0.45 : 1;
        const b = mesh.userData.brightness as number;
        const nb = b + (targetBrightness - b) * 0.1;
        mesh.userData.brightness = nb;
        mesh.material.color.setScalar(nb);
      }

      renderer.render(scene, camera);
    };
    rafId = requestAnimationFrame(tick);

    /* events — ResizeObserver also covers the page-transition window where
       an animating ancestor transform can briefly collapse the container */
    const onResize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      if (w === 0 || h === 0) return;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    const resizeObserver = new ResizeObserver(onResize);
    resizeObserver.observe(container);
    renderer.domElement.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    renderer.domElement.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("resize", onResize);

    return () => {
      disposed = true;
      cancelAnimationFrame(rafId);
      gsap.killTweensOf([camera.position, fadeEl]);
      renderer.domElement.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      renderer.domElement.removeEventListener("wheel", onWheel);
      window.removeEventListener("resize", onResize);
      resizeObserver.disconnect();
      setCursorLabel("");
      for (const mesh of meshes) {
        mesh.material.map?.dispose();
        mesh.material.dispose();
      }
      geometry.dispose();
      renderer.dispose();
      if (renderer.domElement.parentElement === container) {
        container.removeChild(renderer.domElement);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="absolute inset-0">
      <div ref={containerRef} className="absolute inset-0" aria-label="3D gallery of selected work" role="region" />

      {/* fade-to-background overlay used by the click-through transition */}
      <div ref={fadeRef} aria-hidden className="pointer-events-none absolute inset-0 bg-bg opacity-0" />

      {/* texture loading counter (tied to the Three.js LoadingManager) */}
      <div
        aria-hidden
        className={`pointer-events-none absolute inset-0 flex items-center justify-center bg-bg transition-opacity duration-700 ${
          ready ? "opacity-0" : "opacity-100"
        }`}
      >
        <span className="font-mono text-sm tracking-[0.3em] text-muted tabular-nums">
          LOADING {progress}%
        </span>
      </div>
    </div>
  );
}
