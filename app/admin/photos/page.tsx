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
  Star,
  Camera,
} from "lucide-react";

export default function AdminPhotosPage() {
  const [photos, setPhotos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [activeForm, setActiveForm] = useState<any>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  useEffect(() => {
    fetch("/api/admin/content?section=photos")
      .then((res) => res.json())
      .then((res) => {
        if (res.success) {
          setPhotos(res.data.photos || []);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const savePhotosToDb = async (updatedList: any[]) => {
    setSaving(true);
    setMsg("");
    try {
      const res = await fetch("/api/admin/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ section: "photos", data: updatedList }),
      });
      const data = await res.json();
      if (data.success) {
        setPhotos(updatedList);
        setMsg("Photo gallery updated successfully!");
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
      id: "ph-custom-" + Date.now(),
      src: "https://picsum.photos/id/1073/1600/1000",
      alt: "Description of photo for SEO and screen readers",
      category: "Portraits",
      exif: "f/2.8 · 50mm · ISO 100",
      w: 4000,
      h: 5000,
      featured: true,
    });
    setEditingIndex(-1);
  };

  const handleOpenEdit = (index: number) => {
    setActiveForm({ ...photos[index] });
    setEditingIndex(index);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let updated: any[];
    if (editingIndex === -1) {
      updated = [activeForm, ...photos];
    } else if (editingIndex !== null) {
      updated = [...photos];
      updated[editingIndex] = activeForm;
    } else {
      return;
    }
    savePhotosToDb(updated);
  };

  const handleDelete = (index: number) => {
    if (!confirm("Are you sure you want to delete this photo from gallery?")) return;
    const updated = photos.filter((_, i) => i !== index);
    savePhotosToDb(updated);
  };

  const handleToggleFeatured = (index: number) => {
    const updated = [...photos];
    updated[index].featured = !updated[index].featured;
    savePhotosToDb(updated);
  };

  const categories = ["All", "Portraits", "Streets", "Nature", "Cars"];
  const filteredPhotos =
    selectedCategory === "All"
      ? photos
      : photos.filter((p) => p.category === selectedCategory);

  if (loading) {
    return (
      <AdminPageWrapper title="Photography Manager">
        <div className="flex items-center justify-center p-12 text-neutral-500 font-mono text-xs">
          <Loader2 className="w-5 h-5 animate-spin mr-2" /> Loading photo gallery...
        </div>
      </AdminPageWrapper>
    );
  }

  return (
    <AdminPageWrapper
      title="Photography Gallery Manager"
      description="Upload new photos, edit camera EXIF data, categories, and toggle featured cards for the 3D sphere"
      action={
        <button
          onClick={handleOpenAdd}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-mono text-xs uppercase tracking-wider font-semibold rounded-lg flex items-center gap-2 transition shadow-lg shadow-red-950/40"
        >
          <Plus className="w-4 h-4" />
          <span>Upload / Add Photo</span>
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
              {editingIndex === -1 ? "Upload New Photo" : "Edit Photo Metadata"}
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
            <ImageUploader
              label="Photo Image File"
              value={activeForm.src}
              onChange={(url) => setActiveForm({ ...activeForm, src: url })}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">
                  Category
                </label>
                <select
                  value={activeForm.category || "Portraits"}
                  onChange={(e) => setActiveForm({ ...activeForm, category: e.target.value })}
                  className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-sm text-white font-mono"
                >
                  <option value="Portraits">Portraits</option>
                  <option value="Streets">Streets</option>
                  <option value="Nature">Nature</option>
                  <option value="Cars">Cars</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">
                  Camera EXIF Info
                </label>
                <input
                  type="text"
                  required
                  value={activeForm.exif || ""}
                  onChange={(e) => setActiveForm({ ...activeForm, exif: e.target.value })}
                  placeholder="e.g. f/8 · 50mm · ISO 100"
                  className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-sm text-white font-mono"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">
                  Alt Text / Caption (describes the photograph)
                </label>
                <input
                  type="text"
                  required
                  value={activeForm.alt || ""}
                  onChange={(e) => setActiveForm({ ...activeForm, alt: e.target.value })}
                  className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-sm text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">
                  Width (px)
                </label>
                <input
                  type="number"
                  value={activeForm.w || 4000}
                  onChange={(e) => setActiveForm({ ...activeForm, w: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-sm text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">
                  Height (px)
                </label>
                <input
                  type="number"
                  value={activeForm.h || 5000}
                  onChange={(e) => setActiveForm({ ...activeForm, h: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-sm text-white font-mono"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <input
                type="checkbox"
                id="photo-featured"
                checked={activeForm.featured || false}
                onChange={(e) => setActiveForm({ ...activeForm, featured: e.target.checked })}
                className="w-4 h-4 rounded border-neutral-800 text-red-600 focus:ring-red-500 bg-neutral-950"
              />
              <label htmlFor="photo-featured" className="text-xs font-mono text-neutral-300">
                Featured (Displays card on the 3D Interactive Spherical Work Gallery)
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
                <span>Save Photo</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Category Pills Filter */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-full text-xs font-mono transition uppercase ${
              selectedCategory === cat
                ? "bg-red-600 text-white font-semibold"
                : "bg-neutral-900 text-neutral-400 hover:text-white hover:bg-neutral-800"
            }`}
          >
            {cat} ({cat === "All" ? photos.length : photos.filter((p) => p.category === cat).length})
          </button>
        ))}
      </div>

      {/* Grid View of Photos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredPhotos.map((photo) => {
          const originalIndex = photos.findIndex((p) => p.id === photo.id);
          return (
            <div
              key={photo.id}
              className="group p-3 rounded-2xl bg-neutral-900/40 border border-neutral-800 flex flex-col justify-between space-y-3 relative hover:border-neutral-700 transition"
            >
              <div className="relative aspect-[4/5] rounded-xl overflow-hidden bg-neutral-950">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={photo.src}
                  alt={photo.alt}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />

                <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-md text-[10px] font-mono text-white">
                  {photo.category}
                </span>

                {photo.featured && (
                  <span className="absolute top-2 right-2 p-1 rounded-md bg-red-600/90 text-white">
                    <Star className="w-3.5 h-3.5 fill-white" />
                  </span>
                )}
              </div>

              <div>
                <p className="text-xs text-white font-medium line-clamp-1">{photo.alt}</p>
                <p className="text-[10px] font-mono text-neutral-400 mt-1">{photo.exif}</p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-neutral-800/80">
                <button
                  onClick={() => handleToggleFeatured(originalIndex)}
                  className={`text-[10px] font-mono flex items-center gap-1 ${
                    photo.featured ? "text-yellow-400" : "text-neutral-500 hover:text-neutral-300"
                  }`}
                >
                  <Star className="w-3 h-3" />
                  <span>{photo.featured ? "Sphere On" : "Sphere Off"}</span>
                </button>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenEdit(originalIndex)}
                    className="p-1.5 text-neutral-400 hover:text-white rounded-md hover:bg-neutral-800 transition"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(originalIndex)}
                    className="p-1.5 text-neutral-400 hover:text-red-400 rounded-md hover:bg-red-950/30 transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </AdminPageWrapper>
  );
}
