export function SaveBar({
  saving,
  error,
  saved,
  onSave,
}: {
  saving: boolean;
  error: string | null;
  saved: boolean;
  onSave: () => void;
}) {
  return (
    <div className="flex items-center gap-3 sticky bottom-0 bg-paper py-3 border-t border-line-soft">
      <button
        type="button"
        onClick={onSave}
        disabled={saving}
        className="border border-accent text-accent-ink font-semibold px-4 py-2 text-sm hover:bg-accent-soft transition-colors disabled:opacity-50"
      >
        {saving ? "Salvando..." : "Salvar alterações"}
      </button>
      {error && <span className="text-sm text-red-700">{error}</span>}
      {saved && !error && <span className="text-sm text-accent-ink">Salvo com sucesso</span>}
    </div>
  );
}
