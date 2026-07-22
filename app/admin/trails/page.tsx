"use client";

import { useEffect, useState } from "react";
import AdminPageWrapper from "@/components/admin/AdminPageWrapper";
import ImageUploader from "@/components/admin/ImageUploader";
import { Plus, Trash2, Edit2, Save, Loader2, CheckCircle2, AlertCircle, Compass } from "lucide-react";

export default function AdminTrailsPage() {
  const [trailsData, setTrailsData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [activeForm, setActiveForm] = useState<any>(null);

  useEffect(() => {
    fetch("/api/admin/content?section=trails")
      .then((res) => res.json())
      .then((res) => {
        if (res.success) {
          setTrailsData(res.data.trails || { intro: "", stats: [], list: [] });
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const saveTrailsToDb = async (updatedObj: any) => {
    setSaving(true);
    setMsg("");
    try {
      const res = await fetch("/api/admin/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ section: "trails", data: updatedObj }),
      });
      const data = await res.json();
      if (data.success) {
        setTrailsData(updatedObj);
        setMsg("Trails log updated successfully!");
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
      name: "New Trail Name",
      location: "St. John's, NL",
      distance: "5 km",
      elevation: "150 m gain",
      difficulty: "Moderate",
      duration: "2 hrs",
      date: "Sep 2025",
      note: "Description of the hike, views, and lighting conditions...",
      image: "/photos/nature/Image-14.jpg",
    });
    setEditingIndex(-1);
  };

  const handleOpenEdit = (index: number) => {
    setActiveForm({ ...trailsData.list[index] });
    setEditingIndex(index);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let updatedList: any[];
    if (editingIndex === -1) {
      updatedList = [activeForm, ...trailsData.list];
    } else if (editingIndex !== null) {
      updatedList = [...trailsData.list];
      updatedList[editingIndex] = activeForm;
    } else {
      return;
    }

    const updatedTrailsObj = {
      ...trailsData,
      list: updatedList,
      stats: [
        { value: `${updatedList.length < 10 ? "0" + updatedList.length : updatedList.length}`, label: "Trails logged" },
        { value: trailsData.stats?.[1]?.value || "41 km", label: "Distance covered" },
        { value: trailsData.stats?.[2]?.value || "1,750 m", label: "Elevation gained" },
      ],
    };

    saveTrailsToDb(updatedTrailsObj);
  };

  const handleDelete = (index: number) => {
    if (!confirm("Are you sure you want to delete this trail entry?")) return;
    const updatedList = trailsData.list.filter((_: any, i: number) => i !== index);
    saveTrailsToDb({ ...trailsData, list: updatedList });
  };

  if (loading) {
    return (
      <AdminPageWrapper title="Trails & Hikes">
        <div className="flex items-center justify-center p-12 text-neutral-500 font-mono text-xs">
          <Loader2 className="w-5 h-5 animate-spin mr-2" /> Loading trails...
        </div>
      </AdminPageWrapper>
    );
  }

  return (
    <AdminPageWrapper
      title="Trails & Hikes Manager"
      description="Log outdoor hikes, trail stats, elevation gained, and landscape photos"
      action={
        <button
          onClick={handleOpenAdd}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-mono text-xs uppercase tracking-wider font-semibold rounded-lg flex items-center gap-2 transition shadow-lg shadow-red-950/40"
        >
          <Plus className="w-4 h-4" />
          <span>Log New Trail</span>
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

      {/* Form Editor */}
      {activeForm && (
        <div className="p-6 rounded-2xl bg-neutral-900 border border-red-900/50 space-y-6 shadow-2xl">
          <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
            <h2 className="text-sm font-mono uppercase tracking-widest text-red-500 font-semibold">
              {editingIndex === -1 ? "Log New Hike" : `Edit Trail: ${activeForm.name}`}
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
                  Trail Name
                </label>
                <input
                  type="text"
                  required
                  value={activeForm.name || ""}
                  onChange={(e) => setActiveForm({ ...activeForm, name: e.target.value })}
                  className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-sm text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">
                  Location
                </label>
                <input
                  type="text"
                  required
                  value={activeForm.location || ""}
                  onChange={(e) => setActiveForm({ ...activeForm, location: e.target.value })}
                  className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-sm text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">
                  Distance (e.g. "5.3 km")
                </label>
                <input
                  type="text"
                  value={activeForm.distance || ""}
                  onChange={(e) => setActiveForm({ ...activeForm, distance: e.target.value })}
                  className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-sm text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">
                  Elevation (e.g. "180 m gain")
                </label>
                <input
                  type="text"
                  value={activeForm.elevation || ""}
                  onChange={(e) => setActiveForm({ ...activeForm, elevation: e.target.value })}
                  className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-sm text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">
                  Difficulty (Easy / Moderate / Hard)
                </label>
                <input
                  type="text"
                  value={activeForm.difficulty || ""}
                  onChange={(e) => setActiveForm({ ...activeForm, difficulty: e.target.value })}
                  className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-sm text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">
                  Date (e.g. "Sep 2025")
                </label>
                <input
                  type="text"
                  value={activeForm.date || ""}
                  onChange={(e) => setActiveForm({ ...activeForm, date: e.target.value })}
                  className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-sm text-white font-mono"
                />
              </div>
            </div>

            <ImageUploader
              label="Trail Landscape Photo"
              value={activeForm.image}
              onChange={(url) => setActiveForm({ ...activeForm, image: url })}
            />

            <div>
              <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">
                Trail Note / Story
              </label>
              <textarea
                rows={3}
                value={activeForm.note || ""}
                onChange={(e) => setActiveForm({ ...activeForm, note: e.target.value })}
                className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-sm text-white leading-relaxed"
              />
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
                <span>Save Trail Entry</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* List of Trails */}
      <div className="space-y-4">
        {trailsData.list?.map((trail: any, idx: number) => (
          <div
            key={idx}
            className="p-5 rounded-2xl bg-neutral-900/40 border border-neutral-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:border-neutral-700 transition"
          >
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-xl bg-neutral-950 border border-neutral-800 overflow-hidden flex-shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={trail.image} alt={trail.name} className="w-full h-full object-cover" />
              </div>

              <div>
                <h3 className="font-bold text-white text-base">{trail.name}</h3>
                <p className="text-xs font-mono text-neutral-400 mt-1">
                  {trail.location} · {trail.distance} · {trail.elevation} · {trail.difficulty}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end md:self-auto">
              <button
                onClick={() => handleOpenEdit(idx)}
                className="p-2 text-neutral-400 hover:text-white rounded-lg bg-neutral-800/50 hover:bg-neutral-800 transition"
                title="Edit Trail"
              >
                <Edit2 className="w-4 h-4" />
              </button>

              <button
                onClick={() => handleDelete(idx)}
                className="p-2 text-neutral-400 hover:text-red-400 rounded-lg bg-neutral-800/50 hover:bg-red-950/30 transition"
                title="Delete Trail"
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
