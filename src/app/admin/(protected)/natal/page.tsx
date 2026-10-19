import { getNatalPhotos } from "@/lib/data/natalPhotos";
import { NatalPhotosManager } from "@/components/admin/NatalPhotosManager";

export default async function AdminNatalPage() {
  const photos = await getNatalPhotos();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-xl font-bold">Natal Corporativo</h1>
        <p className="text-sm text-graphite">
          Troque as fotos da página{" "}
          <a href="/natal-corporativo" target="_blank" className="underline">
            /natal-corporativo
          </a>
          . A foto é salva assim que você confirma o recorte. Textos e preços continuam sendo
          alterados pelo Claude.
        </p>
      </div>
      <NatalPhotosManager photos={photos} />
    </div>
  );
}
