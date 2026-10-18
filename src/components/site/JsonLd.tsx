// Dados estruturados (schema.org) para buscadores e assistentes de IA.
// O replace evita que um "</script>" vindo do banco feche a tag antes da hora.
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
