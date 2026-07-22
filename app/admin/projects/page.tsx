"use client";

import { useEffect, useState } from "react";
import AdminPageWrapper from "@/components/admin/AdminPageWrapper";
import ImageUploader from "@/components/admin/ImageUploader";
import {
  Plus,
  Trash2,
  Edit2,
  Save,
  Loader2,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Star,
} from "lucide-react";

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [activeForm, setActiveForm] = useState<any>(null);

  useEffect(() => {
    fetch("/api/admin/content?section=projects")
      .then((res) => res.json())
      .then((res) => {
        if (res.success) {
          setProjects(res.data.projects || []);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const saveProjectsToDb = async (updatedList: any[]) => {
    setSaving(true);
    setMsg("");
    try {
      const res = await fetch("/api/admin/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ section: "projects", data: updatedList }),
      });
      const data = await res.json();
      if (data.success) {
        setProjects(updatedList);
        setMsg("Projects updated successfully!");
        setEditingIndex(null);
        setActiveForm(null);
      } else {
        setMsg(`Error saving: ${data.error}`);
      }
    } catch (err: any) {
      setMsg(`Error saving: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  const handleOpenAdd = () => {
    setActiveForm({
      slug: "new-project-" + Date.now(),
      title: "New Project",
      client: "Client Name",
      year: new Date().getFullYear().toString(),
      tags: ["DESIGN", "DEV"],
      role: "Design & build",
      stack: "Next.js · Tailwind",
      summary: "Short project overview description...",
      story: "Detailed project story and process...",
      liveUrl: "https://example.com",
      hero: "https://picsum.photos/id/1073/1600/1000",
      images: [
        "https://picsum.photos/id/106/1600/1000",
        "https://picsum.photos/id/152/1600/1000",
      ],
      featured: true,
    });
    setEditingIndex(-1); // -1 indicates new item
  };

  const handleOpenEdit = (index: number) => {
    setActiveForm({ ...projects[index] });
    setEditingIndex(index);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let updated: any[];
    if (editingIndex === -1) {
      updated = [activeForm, ...projects];
    } else if (editingIndex !== null) {
      updated = [...projects];
      updated[editingIndex] = activeForm;
    } else {
      return;
    }
    saveProjectsToDb(updated);
  };

  const handleDelete = (index: number) => {
    if (!confirm("Are you sure you want to delete this project?")) return;
    const updated = projects.filter((_, i) => i !== index);
    saveProjectsToDb(updated);
  };

  const handleToggleFeatured = (index: number) => {
    const updated = [...projects];
    updated[index].featured = !updated[index].featured;
    saveProjectsToDb(updated);
  };

  if (loading) {
    return (
      <AdminPageWrapper title="Projects Manager">
        <div className="flex items-center justify-center p-12 text-neutral-500 font-mono text-xs">
          <Loader2 className="w-5 h-5 animate-spin mr-2" /> Loading projects...
        </div>
      </AdminPageWrapper>
    );
  }

  return (
    <AdminPageWrapper
      title="Web Projects Manager"
      description="Add, edit, or remove client projects and case studies"
      action={
        <button
          onClick={handleOpenAdd}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-mono text-xs uppercase tracking-wider font-semibold rounded-lg flex items-center gap-2 transition shadow-lg shadow-red-950/40"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Project</span>
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

      {/* Edit / Add Modal or Inline Form */}
      {activeForm && (
        <div className="p-6 rounded-2xl bg-neutral-900 border border-red-900/50 space-y-6 shadow-2xl">
          <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
            <h2 className="text-sm font-mono uppercase tracking-widest text-red-500 font-semibold">
              {editingIndex === -1 ? "Add New Web Project" : `Edit Project: ${activeForm.title}`}
            </h2>
            <button
              onClick={() => {
                setActiveForm(null);
                setEditingIndex(null);
              }}
              className="text-xs font-mono text-neutral-500 hover:text-white"
            >
              Cancel
            </button>
          </div>

          <form onSubmit={handleFormSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">
                  Project Title
                </label>
                <input
                  type="text"
                  required
                  value={activeForm.title || ""}
                  onChange={(e) => setActiveForm({ ...activeForm, title: e.target.value })}
                  className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-sm text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">
                  URL Slug (unique)
                </label>
                <input
                  type="text"
                  required
                  value={activeForm.slug || ""}
                  onChange={(e) => setActiveForm({ ...activeForm, slug: e.target.value })}
                  className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-sm text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">
                  Client Name
                </label>
                <input
                  type="text"
                  value={activeForm.client || ""}
                  onChange={(e) => setActiveForm({ ...activeForm, client: e.target.value })}
                  className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-sm text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">
                  Year
                </label>
                <input
                  type="text"
                  value={activeForm.year || ""}
                  onChange={(e) => setActiveForm({ ...activeForm, year: e.target.value })}
                  className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-sm text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">
                  Role Description
                </label>
                <input
                  type="text"
                  value={activeForm.role || ""}
                  onChange={(e) => setActiveForm({ ...activeForm, role: e.target.value })}
                  className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-sm text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">
                  Tech Stack
                </label>
                <input
                  type="text"
                  value={activeForm.stack || ""}
                  onChange={(e) => setActiveForm({ ...activeForm, stack: e.target.value })}
                  className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-sm text-white font-mono"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">
                  Live Project URL
                </label>
                <input
                  type="text"
                  value={activeForm.liveUrl || ""}
                  onChange={(e) => setActiveForm({ ...activeForm, liveUrl: e.target.value })}
                  placeholder="https://..."
                  className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-sm text-white font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">
                Summary (Card Overview)
              </label>
              <textarea
                rows={2}
                value={activeForm.summary || ""}
                onChange={(e) => setActiveForm({ ...activeForm, summary: e.target.value })}
                className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-sm text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">
                Full Case Study Story
              </label>
              <textarea
                rows={4}
                value={activeForm.story || ""}
                onChange={(e) => setActiveForm({ ...activeForm, story: e.target.value })}
                className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-sm text-white leading-relaxed"
              />
            </div>

            <div className="space-y-4 pt-2">
              <ImageUploader
                label="Hero Image / Thumbnail"
                value={activeForm.hero}
                onChange={(url) => setActiveForm({ ...activeForm, hero: url })}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ImageUploader
                  label="Gallery Image 1"
                  value={activeForm.images?.[0] || ""}
                  onChange={(url) => {
                    const imgs = [...(activeForm.images || ["", ""])];
                    imgs[0] = url;
                    setActiveForm({ ...activeForm, images: imgs });
                  }}
                />

                <ImageUploader
                  label="Gallery Image 2"
                  value={activeForm.images?.[1] || ""}
                  onChange={(url) => {
                    const imgs = [...(activeForm.images || ["", ""])];
                    imgs[1] = url;
                    setActiveForm({ ...activeForm, images: imgs });
                  }}
                />
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <input
                type="checkbox"
                id="featured"
                checked={activeForm.featured || false}
                onChange={(e) => setActiveForm({ ...activeForm, featured: e.target.checked })}
                className="w-4 h-4 rounded border-neutral-800 text-red-600 focus:ring-red-500 bg-neutral-950"
              />
              <label htmlFor="featured" className="text-xs font-mono text-neutral-300">
                Show as Featured Project on Home & Spherical Work Gallery
              </label>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-800">
              <button
                type="button"
                onClick={() => {
                  setActiveForm(null);
                  setEditingIndex(null);
                }}
                className="px-4 py-2 bg-neutral-800 text-neutral-300 text-xs font-mono rounded-lg hover:bg-neutral-700 transition"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={saving}
                className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white font-mono text-xs uppercase tracking-wider font-semibold rounded-lg flex items-center gap-2 transition"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                <span>Save Project</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* List of Existing Projects */}
      <div className="space-y-4">
        {projects.map((proj, idx) => (
          <div
            key={proj.slug || idx}
            className="p-5 rounded-2xl bg-neutral-900/40 border border-neutral-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:border-neutral-700 transition group"
          >
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-xl bg-neutral-950 border border-neutral-800 overflow-hidden flex-shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={proj.hero} alt={proj.title} loading="lazy" decoding="async" className="w-full h-full object-cover" />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-white text-base">{proj.title}</h3>
                  {proj.featured && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono bg-red-950/60 text-red-400 border border-red-900/40">
                      <Star className="w-3 h-3 fill-red-400" /> Featured
                    </span>
                  )}
                </div>
                <p className="text-xs font-mono text-neutral-400 mt-1">
                  Client: {proj.client} · Year: {proj.year} · Stack: {proj.stack}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end md:self-auto">
              {proj.liveUrl && (
                <a
                  href={proj.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-neutral-400 hover:text-white rounded-lg bg-neutral-800/50 hover:bg-neutral-800 transition"
                  title="View Live Site"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}

              <button
                onClick={() => handleToggleFeatured(idx)}
                className={`p-2 rounded-lg transition ${
                  proj.featured
                    ? "text-yellow-400 bg-yellow-950/30"
                    : "text-neutral-500 hover:text-white bg-neutral-800/50"
                }`}
                title="Toggle Featured"
              >
                <Star className="w-4 h-4" />
              </button>

              <button
                onClick={() => handleOpenEdit(idx)}
                className="p-2 text-neutral-400 hover:text-white rounded-lg bg-neutral-800/50 hover:bg-neutral-800 transition"
                title="Edit Project"
              >
                <Edit2 className="w-4 h-4" />
              </button>

              <button
                onClick={() => handleDelete(idx)}
                className="p-2 text-neutral-400 hover:text-red-400 rounded-lg bg-neutral-800/50 hover:bg-red-950/30 transition"
                title="Delete Project"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </AdminPageWrapper>
  );
}
