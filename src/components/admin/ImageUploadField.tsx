"use client";

import { useRef, useState } from "react";
import { uploadImage } from "@/app/admin/actions";
import { PhotoOrPlaceholder } from "@/components/site/PhotoOrPlaceholder";

export function ImageUploadField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string | null;
  onChange: (url: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);

    const formData = new FormData();
    formData.set("file", file);
    const result = await uploadImage(formData);

    setUploading(false);

    if (!result.success) {
      setError(result.error);
      return;
    }

    onChange(result.url);
  }

  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm font-medium">{label}</span>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="w-full"
        disabled={uploading}
      >
        <PhotoOrPlaceholder src={value} alt={label} className="h-32 w-full hover:opacity-80" />
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFileChange}
        className="hidden"
      />
      {uploading && <span className="text-xs text-graphite">Enviando...</span>}
      {error && <span className="text-xs text-red-700">{error}</span>}
    </div>
  );
}
