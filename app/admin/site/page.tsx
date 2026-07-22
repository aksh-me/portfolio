"use client";

import { useEffect, useState } from "react";
import AdminPageWrapper from "@/components/admin/AdminPageWrapper";
import ImageUploader from "@/components/admin/ImageUploader";
import { Save, Plus, Trash2, Loader2, CheckCircle2, AlertCircle } from "lucide-react";

export default function AdminSitePage() {
  const [site, setSite] = useState<any>(null);
  const [hero, setHero] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    fetch("/api/admin/content")
      .then((res) => res.json())
      .then((res) => {
        if (res.success) {
          setSite(res.data.site || {});
          setHero(res.data.hero || {});
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setMsg("");

    try {
      const res1 = await fetch("/api/admin/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ section: "site", data: site }),
      });
      const res2 = await fetch("/api/admin/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ section: "hero", data: hero }),
      });

      const d1 = await res1.json();
      const d2 = await res2.json();

      if (d1.success && d2.success) {
        setMsg("Site and Hero settings saved successfully!");
      } else {
        setMsg(`Error saving: ${d1.error || d2.error}`);
      }
    } catch (err: any) {
      setMsg(`Error saving: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  const handleAddSlide = () => {
    setHero({
      ...hero,
      slides: [
        ...(hero.slides || []),
        { src: "/photos/nature/Image-14.jpg", caption: "50mm · f/2.8 · ISO 100" },
      ],
    });
  };

  const handleRemoveSlide = (idx: number) => {
    const updated = hero.slides.filter((_: any, i: number) => i !== idx);
    setHero({ ...hero, slides: updated });
  };

  if (loading) {
    return (
      <AdminPageWrapper title="Site & Hero Settings">
        <div className="flex items-center justify-center p-12 text-neutral-500 font-mono text-xs">
          <Loader2 className="w-5 h-5 animate-spin mr-2" /> Loading settings...
        </div>
      </AdminPageWrapper>
    );
  }

  return (
    <AdminPageWrapper
      title="Site & Hero Settings"
      description="Update overall portfolio details, contact email, social links, and hero slides"
      action={
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-mono text-xs uppercase tracking-wider font-semibold rounded-lg flex items-center gap-2 transition"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          <span>Save Changes</span>
        </button>
      }
    >
      {msg && (
        <div
          className={`p-4 rounded-xl border text-xs font-mono flex items-center gap-2 ${
            msg.includes("Error")
              ? "bg-red-950/40 border-red-900/50 text-red-400"
              : "bg-emerald-950/40 border-emerald-900/50 text-emerald-400"
          }`}
        >
          {msg.includes("Error") ? (
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
          ) : (
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          )}
          <span>{msg}</span>
        </div>
      )}

      {/* Global Site Information */}
      <div className="p-6 rounded-2xl bg-neutral-900/40 border border-neutral-800 space-y-6">
        <h2 className="text-sm font-mono uppercase tracking-widest text-red-500 font-semibold">
          1. Global Site Info
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">
              Your Name
            </label>
            <input
              type="text"
              value={site.name || ""}
              onChange={(e) => setSite({ ...site, name: e.target.value })}
              className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-lg text-sm text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">
              Location / City
            </label>
            <input
              type="text"
              value={site.city || ""}
              onChange={(e) => setSite({ ...site, city: e.target.value })}
              className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-lg text-sm text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">
              Role Title
            </label>
            <input
              type="text"
              value={site.role || ""}
              onChange={(e) => setSite({ ...site, role: e.target.value })}
              className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-lg text-sm text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">
              Contact Email Address
            </label>
            <input
              type="email"
              value={site.email || ""}
              onChange={(e) => setSite({ ...site, email: e.target.value })}
              className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-lg text-sm text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">
              Instagram Profile URL
            </label>
            <input
              type="text"
              value={site.instagram || ""}
              onChange={(e) => setSite({ ...site, instagram: e.target.value })}
              className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-lg text-sm text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">
              Studio Tagline
            </label>
            <input
              type="text"
              value={site.studioLine || ""}
              onChange={(e) => setSite({ ...site, studioLine: e.target.value })}
              className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-lg text-sm text-white"
            />
          </div>
        </div>
      </div>

      {/* Hero Section Configuration */}
      <div className="p-6 rounded-2xl bg-neutral-900/40 border border-neutral-800 space-y-6">
        <h2 className="text-sm font-mono uppercase tracking-widest text-red-500 font-semibold">
          2. Hero Section
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">
              Eyebrow Badge Text
            </label>
            <input
              type="text"
              value={hero.eyebrow || ""}
              onChange={(e) => setHero({ ...hero, eyebrow: e.target.value })}
              className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-lg text-sm text-white font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">
              Main Headline (use *words* for crimson accent)
            </label>
            <input
              type="text"
              value={hero.headline || ""}
              onChange={(e) => setHero({ ...hero, headline: e.target.value })}
              className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-lg text-sm text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">
              Subheadline / Intro Text
            </label>
            <textarea
              rows={3}
              value={hero.sub || ""}
              onChange={(e) => setHero({ ...hero, sub: e.target.value })}
              className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-lg text-sm text-white leading-relaxed"
            />
          </div>
        </div>

        {/* Hero Slides */}
        <div className="space-y-4 pt-4 border-t border-neutral-800">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-mono uppercase tracking-wider text-neutral-300">
              Hero Viewfinder Slides
            </h3>
            <button
              onClick={handleAddSlide}
              className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-xs font-mono text-white rounded-md flex items-center gap-1 transition"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Slide</span>
            </button>
          </div>

          <div className="space-y-4">
            {hero.slides?.map((slide: any, idx: number) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 space-y-3 relative group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-neutral-500">
                    Slide #{idx + 1}
                  </span>
                  <button
                    onClick={() => handleRemoveSlide(idx)}
                    className="p-1 text-neutral-500 hover:text-red-400 transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <ImageUploader
                  label="Slide Image"
                  value={slide.src}
                  onChange={(url) => {
                    const updated = [...hero.slides];
                    updated[idx].src = url;
                    setHero({ ...hero, slides: updated });
                  }}
                />

                <div>
                  <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">
                    Camera EXIF Caption
                  </label>
                  <input
                    type="text"
                    value={slide.caption || ""}
                    onChange={(e) => {
                      const updated = [...hero.slides];
                      updated[idx].caption = e.target.value;
                      setHero({ ...hero, slides: updated });
                    }}
                    placeholder="e.g. 50mm · f/5.6 · ISO 100"
                    className="w-full px-3 py-1.5 bg-neutral-900 border border-neutral-800 rounded-lg text-xs font-mono text-white"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminPageWrapper>
  );
}
