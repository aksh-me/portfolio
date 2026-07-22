"use client";

import { useState } from "react";
import { Upload, Image as ImageIcon, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface ImageUploaderProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
}

export default function ImageUploader({
  value,
  onChange,
  label = "Upload Image",
}: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);

    try {
      const supabase = createClient();
      if (supabase) {
        const fileExt = file.name.split(".").pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
        const filePath = `uploads/${fileName}`;

        const { data, error } = await supabase.storage
          .from("portfolio-media")
          .upload(filePath, file, {
            upsert: true,
            contentType: file.type,
          });

        if (error) {
          throw new Error(error.message);
        }

        const {
          data: { publicUrl },
        } = supabase.storage.from("portfolio-media").getPublicUrl(filePath);

        onChange(publicUrl);
      } else {
        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch("/api/admin/upload", {
          method: "POST",
          body: formData,
        });

        if (!res.ok) {
          if (res.status === 413) {
            throw new Error("File is too large for serverless upload (max 4.5MB). Please configure Supabase keys to upload larger files.");
          }
          const text = await res.text();
          throw new Error(text || `Server returned error ${res.status}`);
        }

        const data = await res.json();
        if (data.success && data.url) {
          onChange(data.url);
        } else {
          throw new Error(data.error || "Failed to upload image.");
        }
      }
    } catch (err: any) {
      alert(`Upload Error: ${err.message}`);
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-xs font-mono tracking-wider uppercase text-neutral-400">
          {label}
        </label>
      )}

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        {value ? (
          <div className="relative w-20 h-20 rounded-lg overflow-hidden border border-neutral-800 bg-neutral-900 flex-shrink-0 group">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={value} alt="Preview" className="w-full h-full object-cover" />
          </div>
        ) : (
          <div className="w-20 h-20 rounded-lg border border-dashed border-neutral-800 bg-neutral-950 flex flex-col items-center justify-center text-neutral-600 flex-shrink-0">
            <ImageIcon className="w-6 h-6" />
          </div>
        )}

        <div className="flex-1 space-y-2">
          <input
            type="text"
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Paste URL or upload image file..."
            className="w-full px-3 py-2 text-sm bg-neutral-900 border border-neutral-800 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:border-red-500/50 transition"
          />

          <label className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-mono uppercase tracking-wider text-neutral-300 bg-neutral-800 hover:bg-neutral-700 rounded-md cursor-pointer transition border border-neutral-700">
            {uploading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Uploading to Supabase CDN...</span>
              </>
            ) : (
              <>
                <Upload className="w-3.5 h-3.5" />
                <span>Upload file from computer</span>
              </>
            )}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
              disabled={uploading}
            />
          </label>
        </div>
      </div>
    </div>
  );
}
