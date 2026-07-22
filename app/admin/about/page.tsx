"use client";

import { useEffect, useState } from "react";
import AdminPageWrapper from "@/components/admin/AdminPageWrapper";
import ImageUploader from "@/components/admin/ImageUploader";
import { Save, Plus, Trash2, Loader2, CheckCircle2, AlertCircle } from "lucide-react";

export default function AdminAboutPage() {
  const [about, setAbout] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    fetch("/api/admin/content")
      .then((res) => res.json())
      .then((res) => {
        if (res.success) {
          setAbout(res.data.about || {});
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setMsg("");
    try {
      const res = await fetch("/api/admin/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ section: "about", data: about }),
      });
      const data = await res.json();
      if (data.success) {
        setMsg("About page content saved successfully!");
      } else {
        setMsg(`Error saving: ${data.error}`);
      }
    } catch (err: any) {
      setMsg(`Error saving: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  const handleStoryChange = (text: string) => {
    const paragraphs = text.split("\n\n").map((p) => p.trim()).filter(Boolean);
    setAbout({ ...about, story: paragraphs });
  };

  const handleToolsChange = (text: string) => {
    const list = text.split(",").map((t) => t.trim()).filter(Boolean);
    setAbout({ ...about, tools: list });
  };

  const handleGearChange = (text: string) => {
    const list = text.split("\n").map((g) => g.trim()).filter(Boolean);
    setAbout({ ...about, gear: list });
  };

  if (loading) {
    return (
      <AdminPageWrapper title="About & Story">
        <div className="flex items-center justify-center p-12 text-neutral-500 font-mono text-xs">
          <Loader2 className="w-5 h-5 animate-spin mr-2" /> Loading about data...
        </div>
      </AdminPageWrapper>
    );
  }

  return (
    <AdminPageWrapper
      title="About & Biography Manager"
      description="Update your bio story, portrait image, camera gear, software tools, and journey milestones"
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

      <div className="p-6 rounded-2xl bg-neutral-900/40 border border-neutral-800 space-y-6">
        <ImageUploader
          label="Portrait Photo (Upright 3:4 aspect ratio)"
          value={about.portrait}
          onChange={(url) => setAbout({ ...about, portrait: url })}
        />

        <div>
          <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">
            Short Teaser Bio
          </label>
          <textarea
            rows={2}
            value={about.teaser || ""}
            onChange={(e) => setAbout({ ...about, teaser: e.target.value })}
            className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-sm text-white leading-relaxed"
          />
        </div>

        <div>
          <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">
            Full Biography Story (Separate paragraphs with double line breaks)
          </label>
          <textarea
            rows={6}
            value={about.story?.join("\n\n") || ""}
            onChange={(e) => handleStoryChange(e.target.value)}
            className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-sm text-white leading-relaxed font-mono"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">
              Software Tools & Tech (Comma separated)
            </label>
            <input
              type="text"
              value={about.tools?.join(", ") || ""}
              onChange={(e) => handleToolsChange(e.target.value)}
              placeholder="Lightroom, Premiere Pro, Figma, Next.js"
              className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-sm text-white font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">
              Camera Gear List (One item per line)
            </label>
            <textarea
              rows={4}
              value={about.gear?.join("\n") || ""}
              onChange={(e) => handleGearChange(e.target.value)}
              className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-sm text-white font-mono"
            />
          </div>
        </div>
      </div>
    </AdminPageWrapper>
  );
}
