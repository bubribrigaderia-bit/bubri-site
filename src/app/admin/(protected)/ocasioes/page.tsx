import {
  getAllOccasionPhotosForAdmin,
  getAllCorporateClientsForAdmin,
} from "@/lib/data/occasions";
import { OcasioesManager } from "@/components/admin/OcasioesManager";

export default async function AdminOcasioesPage() {
  const [photos, corporateClients] = await Promise.all([
    getAllOccasionPhotosForAdmin(),
    getAllCorporateClientsForAdmin(),
  ]);

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-xl font-bold">Ocasiões</h1>
      <p className="text-sm text-graphite">
        Galeria de fotos de cada ocasião e, no Corporativo, os logos das empresas que já
        fecharam. Os textos e a foto principal de cada ocasião ficam em Páginas → Home → Os 4
        pilares.
      </p>
      <OcasioesManager photos={photos} corporateClients={corporateClients} />
    </div>
  );
}
