"use client";

import { useEffect, useState } from "react";
import AdminPageWrapper from "@/components/admin/AdminPageWrapper";
import { Save, Plus, Trash2, Loader2, CheckCircle2, AlertCircle, Sparkles } from "lucide-react";

export default function AdminServicesPage() {
  const [services, setServices] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    fetch("/api/admin/content")
      .then((res) => res.json())
      .then((res) => {
        if (res.success) {
          setServices(res.data.services || { snapshot: [], offerings: [] });
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
        body: JSON.stringify({ section: "services", data: services }),
      });
      const data = await res.json();
      if (data.success) {
        setMsg("Services and rates saved successfully!");
      } else {
        setMsg(`Error saving: ${data.error}`);
      }
    } catch (err: any) {
      setMsg(`Error saving: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateOffering = (idx: number, key: string, value: any) => {
    const updatedOfferings = [...services.offerings];
    updatedOfferings[idx][key] = value;
    setServices({ ...services, offerings: updatedOfferings });
  };

  const handleUpdateIncludes = (offeringIdx: number, includesText: string) => {
    const lines = includesText.split("\n").map((l) => l.trim()).filter(Boolean);
    const updatedOfferings = [...services.offerings];
    updatedOfferings[offeringIdx].includes = lines;
    setServices({ ...services, offerings: updatedOfferings });
  };

  if (loading) {
    return (
      <AdminPageWrapper title="Services & Pricing">
        <div className="flex items-center justify-center p-12 text-neutral-500 font-mono text-xs">
          <Loader2 className="w-5 h-5 animate-spin mr-2" /> Loading services...
        </div>
      </AdminPageWrapper>
    );
  }

  return (
    <AdminPageWrapper
      title="Services & Packages Manager"
      description="Update pricing, deliverables, and service offerings (Photography, Videography, Social Media, Web Design)"
      action={
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-mono text-xs uppercase tracking-wider font-semibold rounded-lg flex items-center gap-2 transition"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          <span>Save Services</span>
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

      <div className="space-y-6">
        {services.offerings?.map((offering: any, idx: number) => (
          <div
            key={idx}
            className="p-6 rounded-2xl bg-neutral-900/40 border border-neutral-800 space-y-4"
          >
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <h3 className="font-bold text-white text-lg">{offering.name}</h3>
              <span className="text-xs font-mono uppercase text-red-500 font-semibold">
                Package #{idx + 1}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">
                  Pricing (e.g., "From $150" or "On request")
                </label>
                <input
                  type="text"
                  value={offering.price || ""}
                  onChange={(e) => handleUpdateOffering(idx, "price", e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-sm text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">
                  Scope / Category line
                </label>
                <input
                  type="text"
                  value={offering.timeline || ""}
                  onChange={(e) => handleUpdateOffering(idx, "timeline", e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-sm text-white"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">
                  What's Included (One bullet point per line)
                </label>
                <textarea
                  rows={5}
                  value={offering.includes?.join("\n") || ""}
                  onChange={(e) => handleUpdateIncludes(idx, e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-sm text-white font-mono leading-relaxed"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </AdminPageWrapper>
  );
}
