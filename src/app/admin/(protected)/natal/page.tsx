import { getNatalGallery, getNatalPhotos } from "@/lib/data/natalPhotos";
import { NatalPhotosManager } from "@/components/admin/NatalPhotosManager";

export default async function AdminNatalPage() {
  const [photos, gallery] = await Promise.all([getNatalPhotos(), getNatalGallery()]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-xl font-bold">Natal Corporativo</h1>
        <p className="text-sm text-graphite">
          Troque as fotos da página{" "}
          <a href="/natal-corporativo" target="_blank" className="underline">
            /natal-corporativo
          </a>
          . A foto é salva assim que você confirma o recorte. Em “Fotos extras” você adiciona mais fotos de cada produto, que o cliente vê passando para o lado. Textos e preços continuam sendo
          alterados pelo Claude.
        </p>
      </div>
      <NatalPhotosManager photos={photos} gallery={gallery} />
    </div>
  );
}
