import {
  getAllOccasionPhotosForAdmin,
  getAllCorporateClientsForAdmin,
  getAllProductOccasionMeta,
  productOccasionMetaReady,
} from "@/lib/data/occasions";
import { getAllProductsForAdmin } from "@/lib/data/products";
import { OcasioesManager } from "@/components/admin/OcasioesManager";

export default async function AdminOcasioesPage() {
  const [photos, corporateClients, products, productMeta, productMetaReady] = await Promise.all([
    getAllOccasionPhotosForAdmin(),
    getAllCorporateClientsForAdmin(),
    getAllProductsForAdmin(),
    getAllProductOccasionMeta(),
    productOccasionMetaReady(),
  ]);

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-xl font-bold">Ocasiões</h1>
      <p className="text-sm text-graphite">
        Galeria de fotos, ordem dos produtos e, no Corporativo, os logos do bloco &quot;Alguns dos
        nossos clientes&quot;. Os textos e a foto principal de cada ocasião ficam em Páginas → Home
        → Os 4 pilares.
      </p>
      <OcasioesManager
        photos={photos}
        corporateClients={corporateClients}
        products={products}
        productMeta={productMeta}
        productMetaReady={productMetaReady}
      />
    </div>
  );
}
