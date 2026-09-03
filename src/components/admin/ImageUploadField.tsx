"use client";

import { useRef, useState } from "react";
import type { Area } from "react-easy-crop";
import { uploadImage } from "@/app/admin/actions";
import { PhotoOrPlaceholder } from "@/components/site/PhotoOrPlaceholder";
import { getCroppedImageFile, readFileAsDataUrl } from "@/lib/cropImage";
import { ImageCropModal, type AspectOption } from "./ImageCropModal";

const DEFAULT_ASPECT_OPTIONS: AspectOption[] = [
  { label: "Quadrada", value: 1 },
  { label: "Vertical", value: 4 / 5 },
  { label: "Horizontal", value: 4 / 3 },
];

export function ImageUploadField({
  label,
  value,
  onChange,
  aspectOptions = DEFAULT_ASPECT_OPTIONS,
  exportMaxWidth = 1600,
}: {
  label: string;
  value: string | null;
  onChange: (url: string) => void;
  /** Formatos de recorte oferecidos. O primeiro é o padrão. */
  aspectOptions?: AspectOption[];
  /** Largura máxima do JPEG gerado. Maior para fotos que ocupam a tela toda. */
  exportMaxWidth?: number;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState<{ src: string; fileName: string } | null>(null);

  function resetInput() {
    if (inputRef.current) inputRef.current.value = "";
  }

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setError(null);

    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setError("Envie um arquivo JPG, PNG ou WEBP");
      resetInput();
      return;
    }

    try {
      const src = await readFileAsDataUrl(file);
      setEditing({ src, fileName: file.name });
    } catch {
      setError("Não foi possível abrir essa imagem. Tente outra.");
      resetInput();
    }
  }

  async function handleConfirmCrop(cropPixels: Area) {
    if (!editing) return;
    setUploading(true);
    setError(null);

    try {
      const croppedFile = await getCroppedImageFile(
        editing.src,
        cropPixels,
        editing.fileName,
        exportMaxWidth
      );

      const formData = new FormData();
      formData.set("file", croppedFile);
      const result = await uploadImage(formData);

      if (!result.success) {
        setError(result.error);
        return;
      }

      onChange(result.url);
      setEditing(null);
    } catch {
      setError(
        "Não foi possível enviar a foto. Tente uma imagem menor (até 5MB) ou tente de novo."
      );
    } finally {
      setUploading(false);
      resetInput();
    }
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
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="text-xs text-accent-ink underline disabled:opacity-50"
        >
          {value ? "Trocar foto" : "Escolher foto"}
        </button>
        {value && (
          <button
            type="button"
            onClick={() => onChange("")}
            disabled={uploading}
            className="text-xs text-graphite underline disabled:opacity-50"
          >
            Remover
          </button>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFileChange}
        className="hidden"
      />
      {uploading && <span className="text-xs text-graphite">Enviando...</span>}
      {error && <span className="text-xs text-red-700">{error}</span>}

      {editing && (
        <ImageCropModal
          imageSrc={editing.src}
          aspectOptions={aspectOptions}
          busy={uploading}
          onCancel={() => {
            if (uploading) return;
            setEditing(null);
            resetInput();
          }}
          onConfirm={handleConfirmCrop}
        />
      )}
    </div>
  );
}
