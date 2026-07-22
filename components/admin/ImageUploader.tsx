"use client";

import { useState } from "react";
import { Upload, Image as ImageIcon, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface ImageUploaderProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
}

// Client-side canvas image compressor (Max dimension: 2400px, output: WebP format)
async function compressImage(file: File, maxDimension = 2400, quality = 0.85): Promise<File> {
  if (!file.type.startsWith("image/") || file.type.includes("svg") || file.type.includes("gif")) {
    return file;
  }

  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new window.Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        let { width, height } = img;
        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              resolve(file);
              return;
            }
            const compressedFile = new File(
              [blob],
              file.name.replace(/\.[^/.]+$/, "") + ".webp",
              { type: "image/webp" }
            );
            resolve(compressedFile);
          },
          "image/webp",
          quality
        );
      };
      img.onerror = () => resolve(file);
    };
    reader.onerror = () => resolve(file);
  });
}

export default function ImageUploader({
  value,
  onChange,
  label = "Upload Image",
}: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawFile = e.target.files?.[0];
    if (!rawFile) return;

    setUploading(true);

    try {
      // Compress and optimize image to WebP before uploading
      const file = await compressImage(rawFile);

      const supabase = createClient();
      if (supabase) {
        const fileExt = file.name.split(".").pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
        const filePath = `uploads/${fileName}`;

        const { error } = await supabase.storage
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
            throw new Error("File is too large for serverless upload. Configure Supabase keys for unlimited file sizes.");
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
                <span>Optimizing & Uploading WebP...</span>
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
