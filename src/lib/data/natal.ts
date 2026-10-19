// Catálogo de Natal Corporativo 2026 (B2B). Conteúdo sazonal e fixo, tirado
// do PDF "B2B Catálogo de Natal 2026" — por isso fica no código, não no banco.
// Para a próxima temporada, basta editar este arquivo e trocar as fotos em
// /public/natal.

export type NatalVariant = { label: string; price: number };

export type NatalProduct = {
  id: string;
  name: string;
  description: string;
  photo: string;
  group: "especiais" | "lembrancas";
  /** Tamanhos/quantidades com preço próprio. Produto de preço único tem uma só. */
  variants: NatalVariant[];
  /** Sabores que a empresa escolhe no pedido. */
  flavors?: string[];
  /** Sabores que já vêm na caixa (só informativo). */
  includedFlavors?: string[];
  badge?: string;
  /** Preço exibido como "a partir de". */
  fromPrice?: boolean;
};

export const NATAL_YEAR = 2026;
export const NATAL_PERSONALIZATION_DEADLINE = "10/11";
export const NATAL_SPECIAL_CONDITION_QTY = 20;

export const NATAL_GROUPS: { value: NatalProduct["group"]; title: string; subtitle: string }[] = [
  {
    value: "especiais",
    title: "Presentes especiais",
    subtitle: "Para clientes, parceiros, lideranças e diretoria.",
  },
  {
    value: "lembrancas",
    title: "Pequenas lembranças",
    subtitle: "Para presentear a equipe inteira, todas com tag personalizada.",
  },
];

export const NATAL_PRODUCTS: NatalProduct[] = [
  {
    id: "box-presenca",
    name: "Box Presença",
    description:
      "O presente mais completo da coleção: vinho, chocotone artesanal, biscoitos natalinos, pão de mel e latinha de chocolates, reunidos numa caixa com alça dourada. Tudo o que a ceia pede, num presente só. Ideal para diretoria, clientes especiais e parceiros estratégicos.",
    photo: "/natal/box-presenca.jpg",
    group: "especiais",
    variants: [{ label: "Box Presença", price: 348 }],
    badge: "Quantidade limitada",
  },
  {
    id: "caixa-noel",
    name: "Caixa Noel",
    description:
      "Biscoitos amanteigados com carimbos natalinos, chocolate meio amargo com mix de castanhas e chocolate branco com pistache. Um presente feito para ser aberto e dividido, ideal para equipes, clientes e parceiros.",
    photo: "/natal/caixa-noel.jpg",
    group: "especiais",
    variants: [{ label: "Caixa Noel", price: 228 }],
  },
  {
    id: "joias-de-cacau",
    name: "Joias de Cacau",
    description:
      "Dezesseis bombons finos pintados à mão nas cores da árvore, com casquinha brilhante e recheio cremoso. Chegam guardados num porta-joias feito para este Natal.",
    photo: "/natal/joias-de-cacau.jpg",
    group: "especiais",
    variants: [{ label: "Joias de Cacau (16 bombons)", price: 198 }],
    includedFlavors: ["Pistache Crocante", "Nutella Crocante", "Caramelo Salgado", "Frutas Vermelhas"],
    badge: "Edição limitada",
  },
  {
    id: "doce-brinde",
    name: "Doce Brinde",
    description:
      "Um brinde para quem fez o ano ser especial: espumante mini e seis doces finos selecionados, em caixa com visor e tag personalizada da empresa.",
    photo: "/natal/doce-brinde.jpg",
    group: "especiais",
    variants: [{ label: "Doce Brinde", price: 150 }],
  },
  {
    id: "chocotone",
    name: "Chocotone",
    description:
      "O presente clássico de fim de ano. Massa macia e perfumada, com gotas de chocolate, em embalagem personalizada com a tag da sua empresa. Ideal para clientes, parceiros e lideranças.",
    photo: "/natal/chocotone.jpg",
    group: "especiais",
    variants: [
      { label: "Mini Chocotone (150 g)", price: 54 },
      { label: "Chocotone Grande (800 g)", price: 142 },
    ],
    flavors: ["Pistache Crocante", "Nutella Crocante", "Brigadeiro", "Ninho c/ Frutas Vermelhas"],
    fromPrice: true,
  },
  {
    id: "doces-finos",
    name: "Doces Finos",
    description:
      "Seleção de doces finos com tema natalino em caixa com visor e fita personalizada. Uma lembrança delicada para presentear toda a equipe, personalizável com a marca da sua empresa.",
    photo: "/natal/doces-finos.jpg",
    group: "lembrancas",
    variants: [
      { label: "Doces Finos — 2 unid.", price: 21 },
      { label: "Doces Finos — 4 unid.", price: 36 },
      { label: "Doces Finos — 6 unid.", price: 53 },
    ],
    fromPrice: true,
  },
  {
    id: "mini-guirlanda",
    name: "Mini Guirlanda",
    description:
      "Brownie artesanal em formato de guirlanda, com casquinha fina por fora e textura úmida por dentro. Decorada com confeitos de Natal e brigadeiro. Com visor transparente e tag personalizada.",
    photo: "/natal/mini-guirlanda.jpg",
    group: "lembrancas",
    variants: [{ label: "Mini Guirlanda", price: 16 }],
    badge: "A mais vendida de 2025",
  },
  {
    id: "latinha-de-chocolate",
    name: "Latinha de Chocolate",
    description:
      "Chocolate ao leite com o estalo das drágeas crocantes, numa latinha com design personalizado com a identidade da sua empresa. Um presente que continua na mesa de quem ganhou, levando a sua marca junto.",
    photo: "/natal/latinha-de-chocolate.jpg",
    group: "lembrancas",
    variants: [{ label: "Latinha de Chocolate", price: 42 }],
  },
  {
    id: "pao-de-mel",
    name: "Pão de Mel",
    description:
      "Pão de mel artesanal com recheio de doce de leite da casa e toque dourado, em formato de presente. Com visor transparente e tag personalizada.",
    photo: "/natal/pao-de-mel.jpg",
    group: "lembrancas",
    variants: [
      { label: "Pão de Mel — individual", price: 13 },
      { label: "Pão de Mel — dupla", price: 25 },
      { label: "Pão de Mel — quarteto", price: 49 },
    ],
    fromPrice: true,
  },
  {
    id: "biscoito-natalino",
    name: "Biscoito Natalino",
    description:
      "O Papai Noel que cabe na palma da mão: biscoito amanteigado artesanal, macio e com aquele sabor de baunilha que lembra infância.",
    photo: "/natal/biscoito-natalino.jpg",
    group: "lembrancas",
    variants: [{ label: "Biscoito Natalino", price: 8 }],
  },
];

export const NATAL_REASONS: { title: string; text: string }[] = [
  {
    title: "Personalização completa",
    text: "Embalagem, fita e tag com a identidade da sua empresa.",
  },
  {
    title: "Ingredientes de alta qualidade",
    text: "Trabalhamos com chocolate nobre Sicao, do grupo Barry Callebaut.",
  },
  {
    title: "Processo artesanal",
    text: "Cada doce é único e pode apresentar pequenas variações, que fazem parte do processo artesanal.",
  },
  {
    title: "Apresentação completa",
    text: "Todos os presentes acompanham fita personalizada, tag de Natal e sacola.",
  },
  {
    title: "Emissão de nota fiscal",
    text: "Empresa formalizada, com CNPJ ativo e emissão de nota fiscal eletrônica.",
  },
  {
    title: "Condições especiais",
    text: `Presentear a equipe inteira tem condição especial. Para pedidos a partir de ${NATAL_SPECIAL_CONDITION_QTY} unidades, preparamos uma proposta exclusiva para a sua empresa.`,
  },
  {
    title: "Entrega para todo o Brasil",
    text: "Entregamos em todas as regiões de São Paulo e enviamos itens selecionados para todo o Brasil. Consulte os produtos disponíveis para envio nacional.",
  },
];

export const NATAL_STEPS: string[] = [
  "Monte o seu pedido aqui na página (ou mande pelo WhatsApp) com a quantidade, os produtos de interesse e a data de entrega desejada.",
  "Receba a proposta com valores, prazo e prévia da personalização.",
  "Aprove a arte e confirme o pedido com o pagamento.",
];

export const NATAL_PRODUCTION_TEXT =
  "A partir de 7 dias após a aprovação da arte e do pagamento. O prazo exato varia conforme o produto, a quantidade e o nível de personalização, e é confirmado na proposta.";

export const NATAL_PAYMENT_TEXT =
  "Pix, transferência bancária, boleto ou cartão de crédito corporativo.";

export const NATAL_DELIVERY_TEXT: string[] = [
  "Entregamos em todas as regiões de São Paulo, com taxa calculada conforme a localização.",
  "Enviamos para todos os estados do Brasil pelos Correios, com frete calculado conforme o destino.",
];

export function formatBRL(value: number): string {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: Number.isInteger(value) ? 0 : 2,
  });
}

export function lowestPrice(product: NatalProduct): number {
  return Math.min(...product.variants.map((v) => v.price));
}
