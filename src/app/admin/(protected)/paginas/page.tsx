import { getPillars } from "@/lib/data/pillars";
import { getPageContent } from "@/lib/data/content";
import { getAllFaqItemsForAdmin } from "@/lib/data/faq";
import { PaginasManager } from "@/components/admin/PaginasManager";

export default async function AdminPaginasPage() {
  const [pillars, homeContent, sobreContent, faqItems] = await Promise.all([
    getPillars(),
    getPageContent("home"),
    getPageContent("sobre"),
    getAllFaqItemsForAdmin(),
  ]);

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-xl font-bold">Páginas</h1>
      <PaginasManager
        pillars={pillars}
        homeContent={homeContent}
        sobreContent={sobreContent}
        faqItems={faqItems}
      />
    </div>
  );
}
