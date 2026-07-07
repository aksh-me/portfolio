import type { Metadata } from "next";
import CameraRigDemo from "@/components/demo/CameraRigDemo";

export const metadata: Metadata = {
  title: "3D Rig Demo",
  robots: { index: false }, // demo page — not for search engines
};

/**
 * DEMO ONLY — standalone playground for the scroll-driven ZV-E10 hero.
 * Approve the feel here, then we lift the component into the real hero.
 * The copy blocks below just give the scroll some story beats.
 */
const beats = [
  { eyebrow: "THE RIG", title: "Sony ZV-E10.", text: "Every frame on this site started here. Scroll — the rig follows your hand." },
  { eyebrow: "01 — GLASS", title: "Light comes first.", text: "The lens picks up the room around it. Reflections are real, not painted on." },
  { eyebrow: "02 — MOTION", title: "Scrubbed, never played.", text: "The animation is welded to your scroll. Stop, and it breathes. Flick, and it glides to a halt." },
  { eyebrow: "03 — THE POINT", title: "Always in focus.", text: "Wherever the scene moves, the camera stays the subject. Just like a good story." },
];

export default function Demo3DPage() {
  return (
    <div className="relative">
      <CameraRigDemo />

      {/* scroll copy — sits above the fixed 3D stage */}
      <div className="pointer-events-none relative z-10">
        {beats.map((b, i) => (
          <section
            key={b.eyebrow}
            className={`mx-auto flex min-h-screen max-w-[1600px] items-center px-6 md:px-12 ${
              i % 2 ? "justify-end" : "justify-start"
            }`}
          >
            <div className="pointer-events-auto max-w-md">
              <p className="font-mono text-xs uppercase tracking-[0.3em] text-accent">{b.eyebrow}</p>
              <h2 className="mt-4 font-display text-display-2 font-medium">{b.title}</h2>
              <p className="mt-4 text-muted">{b.text}</p>
            </div>
          </section>
        ))}
        <section className="flex min-h-[50vh] items-center justify-center">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-muted">
            End of demo — like it? We wire it into the hero next.
          </p>
        </section>
      </div>
    </div>
  );
}
