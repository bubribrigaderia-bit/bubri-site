import { getSiteSettings } from "@/lib/data/settings";
import { SettingsForm } from "@/components/admin/SettingsForm";

export default async function AdminConfiguracoesPage() {
  const settings = await getSiteSettings();

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-xl font-bold">Configurações</h1>
      <SettingsForm settings={settings} />
    </div>
  );
}
