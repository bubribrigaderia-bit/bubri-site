import { getAllProductsForAdmin } from "@/lib/data/products";
import { ProductsManager } from "@/components/admin/ProductsManager";

export default async function AdminProdutosPage() {
  const products = await getAllProductsForAdmin();

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-xl font-bold">Produtos</h1>
      <ProductsManager initialProducts={products} />
    </div>
  );
}
