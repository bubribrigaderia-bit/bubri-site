"use client";

import { useCallback, useState } from "react";
import Cropper, { type Area } from "react-easy-crop";

export function ImageCropModal({
  imageSrc,
  aspect,
  busy = false,
  onCancel,
  onConfirm,
}: {
  imageSrc: string;
  aspect: number;
  busy?: boolean;
  onCancel: () => void;
  onConfirm: (cropPixels: Area) => void;
}) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [cropPixels, setCropPixels] = useState<Area | null>(null);

  const onCropComplete = useCallback((_area: Area, areaPixels: Area) => {
    setCropPixels(areaPixels);
  }, []);

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-[60]">
      <div className="bg-paper w-full max-w-md rounded-2xl p-5 flex flex-col gap-4">
        <div>
          <h3 className="font-display text-lg">Ajustar foto</h3>
          <p className="text-xs text-graphite">
            Arraste para reposicionar e use a barra para dar zoom.
          </p>
        </div>

        <div className="relative w-full h-64 bg-black/80 rounded-xl overflow-hidden">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={aspect}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
            showGrid={false}
          />
        </div>

        <label className="flex items-center gap-3 text-xs text-graphite">
          Zoom
          <input
            type="range"
            min={1}
            max={3}
            step={0.01}
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
            className="flex-1 accent-[var(--accent)]"
          />
        </label>

        <div className="flex gap-3 justify-end">
          <button
            type="button"
            onClick={onCancel}
            disabled={busy}
            className="text-sm text-graphite px-3 py-2 disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={() => cropPixels && onConfirm(cropPixels)}
            disabled={!cropPixels || busy}
            className="bg-accent text-paper font-semibold px-5 py-2 rounded-full text-sm hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {busy ? "Enviando..." : "Usar foto"}
          </button>
        </div>
      </div>
    </div>
  );
}
