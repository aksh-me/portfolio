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
  BookOpen,
} from "lucide-react";

export default function AdminJournalPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [activeForm, setActiveForm] = useState<any>(null);

  useEffect(() => {
    fetch("/api/admin/content?section=posts")
      .then((res) => res.json())
      .then((res) => {
        if (res.success) {
          setPosts(res.data.posts || []);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const savePostsToDb = async (updatedList: any[]) => {
    setSaving(true);
    setMsg("");
    try {
      const res = await fetch("/api/admin/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ section: "posts", data: updatedList }),
      });
      const data = await res.json();
      if (data.success) {
        setPosts(updatedList);
        setMsg("Journal posts updated successfully!");
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
      slug: "new-post-" + Date.now(),
      title: "New Article Title",
      date: new Date().toISOString().split("T")[0],
      readTime: "4 min read",
      cover: "https://picsum.photos/id/250/1600/900",
      excerpt: "Short summary excerpt for the article card...",
      bodyText: "First paragraph...\n\nSecond paragraph...\n\nThird paragraph...",
    });
    setEditingIndex(-1);
  };

  const handleOpenEdit = (index: number) => {
    const p = posts[index];
    setActiveForm({
      ...p,
      bodyText: Array.isArray(p.body) ? p.body.join("\n\n") : p.body || "",
    });
    setEditingIndex(index);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formattedPost = {
      slug: activeForm.slug,
      title: activeForm.title,
      date: activeForm.date,
      readTime: activeForm.readTime,
      cover: activeForm.cover,
      excerpt: activeForm.excerpt,
      body: activeForm.bodyText
        .split("\n\n")
        .map((paragraph: string) => paragraph.trim())
        .filter(Boolean),
    };

    let updated: any[];
    if (editingIndex === -1) {
      updated = [formattedPost, ...posts];
    } else if (editingIndex !== null) {
      updated = [...posts];
      updated[editingIndex] = formattedPost;
    } else {
      return;
    }
    savePostsToDb(updated);
  };

  const handleDelete = (index: number) => {
    if (!confirm("Are you sure you want to delete this article?")) return;
    const updated = posts.filter((_, i) => i !== index);
    savePostsToDb(updated);
  };

  if (loading) {
    return (
      <AdminPageWrapper title="Journal Manager">
        <div className="flex items-center justify-center p-12 text-neutral-500 font-mono text-xs">
          <Loader2 className="w-5 h-5 animate-spin mr-2" /> Loading journal posts...
        </div>
      </AdminPageWrapper>
    );
  }

  return (
    <AdminPageWrapper
      title="Journal / Blog Manager"
      description="Write and publish articles on photography, process, and creative insights"
      action={
        <button
          onClick={handleOpenAdd}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-mono text-xs uppercase tracking-wider font-semibold rounded-lg flex items-center gap-2 transition shadow-lg shadow-red-950/40"
        >
          <Plus className="w-4 h-4" />
          <span>Write New Post</span>
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
              {editingIndex === -1 ? "New Article" : `Edit Article: ${activeForm.title}`}
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
                  Article Title
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
                  URL Slug
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
                  Publish Date
                </label>
                <input
                  type="date"
                  value={activeForm.date || ""}
                  onChange={(e) => setActiveForm({ ...activeForm, date: e.target.value })}
                  className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-sm text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">
                  Read Time Estimate
                </label>
                <input
                  type="text"
                  value={activeForm.readTime || ""}
                  onChange={(e) => setActiveForm({ ...activeForm, readTime: e.target.value })}
                  placeholder="e.g. 4 min read"
                  className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-sm text-white font-mono"
                />
              </div>
            </div>

            <ImageUploader
              label="Cover Image"
              value={activeForm.cover}
              onChange={(url) => setActiveForm({ ...activeForm, cover: url })}
            />

            <div>
              <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">
                Excerpt (Card Teaser)
              </label>
              <textarea
                rows={2}
                value={activeForm.excerpt || ""}
                onChange={(e) => setActiveForm({ ...activeForm, excerpt: e.target.value })}
                className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-sm text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">
                Article Body (Separate paragraphs with double line breaks)
              </label>
              <textarea
                rows={8}
                value={activeForm.bodyText || ""}
                onChange={(e) => setActiveForm({ ...activeForm, bodyText: e.target.value })}
                className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-sm text-white leading-relaxed font-mono"
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
                <span>Publish Post</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* List of Posts */}
      <div className="space-y-4">
        {posts.map((post, idx) => (
          <div
            key={post.slug || idx}
            className="p-5 rounded-2xl bg-neutral-900/40 border border-neutral-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:border-neutral-700 transition"
          >
            <div className="flex items-center gap-4">
              <div className="w-20 h-14 rounded-xl bg-neutral-950 border border-neutral-800 overflow-hidden flex-shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={post.cover} alt={post.title} className="w-full h-full object-cover" />
              </div>

              <div>
                <h3 className="font-bold text-white text-base">{post.title}</h3>
                <p className="text-xs font-mono text-neutral-400 mt-1">
                  {post.date} · {post.readTime}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end md:self-auto">
              <button
                onClick={() => handleOpenEdit(idx)}
                className="p-2 text-neutral-400 hover:text-white rounded-lg bg-neutral-800/50 hover:bg-neutral-800 transition"
                title="Edit Post"
              >
                <Edit2 className="w-4 h-4" />
              </button>

              <button
                onClick={() => handleDelete(idx)}
                className="p-2 text-neutral-400 hover:text-red-400 rounded-lg bg-neutral-800/50 hover:bg-red-950/30 transition"
                title="Delete Post"
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
