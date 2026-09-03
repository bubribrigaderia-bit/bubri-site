import type { Area } from "react-easy-crop";

/**
 * Recorta a imagem no navegador a partir da área escolhida no cropper,
 * redimensiona para caber em `maxWidth` e devolve um arquivo JPEG leve
 * (pronto para o upload do painel).
 */
export async function getCroppedImageFile(
  imageSrc: string,
  cropPixels: Area,
  fileName: string,
  maxWidth = 1600
): Promise<File> {
  const image = await loadImage(imageSrc);

  const scale = cropPixels.width > maxWidth ? maxWidth / cropPixels.width : 1;
  const targetWidth = Math.round(cropPixels.width * scale);
  const targetHeight = Math.round(cropPixels.height * scale);

  const canvas = document.createElement("canvas");
  canvas.width = targetWidth;
  canvas.height = targetHeight;

  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Não foi possível processar a imagem");

  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(
    image,
    cropPixels.x,
    cropPixels.y,
    cropPixels.width,
    cropPixels.height,
    0,
    0,
    targetWidth,
    targetHeight
  );

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, "image/jpeg", 0.85)
  );
  if (!blob) throw new Error("Não foi possível processar a imagem");

  const baseName = fileName.replace(/\.[^.]+$/, "") || "foto";
  return new File([blob], `${baseName}.jpg`, { type: "image/jpeg" });
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Não foi possível carregar a imagem"));
    img.src = src;
  });
}

export function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error("Não foi possível ler o arquivo"));
    reader.readAsDataURL(file);
  });
}
