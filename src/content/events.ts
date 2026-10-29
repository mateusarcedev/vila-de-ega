import type { HistoricalEvent } from "@/types/history";

// Datas e vínculos ainda sem referência permanecem explicitamente em investigação.
export const events: HistoricalEvent[] = [
  {
    id: "antes-da-cidade", chapter: 1, shortTitle: "Antes da cidade", title: "Antes da cidade, havia muitos mundos.",
    period: "Memórias anteriores à colonização", dateLabel: "Antes dos registros coloniais",
    summary: "Povos originários, território e relações com os rios do Médio Solimões.",
    lead: "Muito antes dos nomes coloniais, povos originários viviam, circulavam e construíam relações com os rios e as terras do Médio Solimões.",
    content: ["Esta história começa com presença e conhecimento. O território não era vazio: era lugar de vida, troca, deslocamento e memória, com povos e modos de existência diversos que precisam ser contados com suas próprias fontes e vozes."],
    category: "Povos originários", relatedPeople: [], relatedPlaces: [], sources: [], visualCredits: [], researchStatus: "under-investigation",
  },
  {
    id: "missoes", chapter: 2, shortTitle: "Missões", title: "Missões, margens e disputas.",
    period: "Final do século XVII e século XVIII", dateLabel: "Séculos XVII–XVIII",
    summary: "Missões religiosas e autoridades coloniais no Médio Solimões.",
    lead: "No fim do século XVII e ao longo do XVIII, missões religiosas e autoridades coloniais disputaram presença e influência nas águas do Solimões.",
    content: ["A missão de Santa Teresa dos Axiuaris, Samuel Fritz e Frei André da Costa aparecem neste capítulo como pistas para pesquisa. Datas de fundação, deslocamento e reorganização ainda precisam ser confrontadas com documentos.", "As relações entre missionários, povos indígenas e autoridades coloniais, assim como as disputas territoriais entre Portugal e Espanha, permanecem em investigação."],
    category: "Missões religiosas", relatedPeople: ["samuel-fritz", "frei-andre-da-costa"], relatedPlaces: ["santa-teresa-dos-axiuaris"], sources: [], visualCredits: [], researchStatus: "under-investigation",
  },
  {
    id: "vila-de-ega", chapter: 3, shortTitle: "Vila de Ega", title: "O nome Ega entra no mapa.",
    period: "1759 · Vila de Ega", dateLabel: "1759",
    summary: "A transformação administrativa da povoação em vila, apresentada como marco a documentar.",
    lead: "A povoação é apresentada no acervo inicial como Vila de Ega, um marco administrativo em meio às transformações políticas do período colonial.",
    content: ["A criação da vila, seu contexto e as formas anteriores de organização serão apresentados junto a documentos e versões históricas. Este protótipo não atribui um ato ou uma data sem referência anexada."],
    category: "Administração e política", relatedPeople: [], relatedPlaces: ["vila-de-ega"], sources: [], visualCredits: [], researchStatus: "under-investigation",
  },
  {
    id: "cidade-de-tefe", chapter: 4, shortTitle: "Cidade de Tefé", title: "Ega se torna Tefé.",
    period: "15 de junho de 1855 · Cidade de Tefé", dateLabel: "15 de junho de 1855",
    summary: "Elevação à categoria de cidade e mudança de nome, aguardando referência documental.",
    lead: "O dia 15 de junho de 1855 marca a elevação de Tefé à categoria de cidade no percurso histórico deste projeto.",
    content: ["A mudança de nome e o processo administrativo ganham uma linha do tempo própria. A origem e a etimologia de “Tefé” aguardam referência bibliográfica verificável."],
    category: "Administração e política", relatedPeople: [], relatedPlaces: ["tefe"], sources: [], visualCredits: [], researchStatus: "under-investigation",
  },
  {
    id: "desenvolvimento", chapter: 5, shortTitle: "Educação e cidade", title: "Uma cidade feita de muitos lugares.",
    period: "Educação, religião e desenvolvimento urbano", dateLabel: "Séculos XIX–XX · em pesquisa",
    summary: "Igrejas, escolas, espaços públicos e transformações urbanas sem cronologia publicada nesta versão.",
    lead: "Igrejas, escolas e espaços públicos guardam camadas de construção, mudança e convivência.",
    content: ["Este capítulo acompanha transformações urbanas e a memória da educação sem antecipar datas ou biografias ainda não documentadas.", "A Igreja Matriz de Santa Teresa d’Ávila, o Seminário São José, escolas históricas e edifícios públicos são linhas de pesquisa. A história do prédio da atual Câmara Municipal também precisa ser confirmada."],
    category: "Educação", relatedPeople: ["corinto-borges-passanha", "antidio-borges-passanha", "eduardo-sa", "eduardo-ribeiro"], relatedPlaces: ["igreja-matriz-santa-teresa", "seminario-sao-jose", "escolas-historicas"], sources: [], visualCredits: [], researchStatus: "under-investigation",
  },
  {
    id: "ciencia", chapter: 6, shortTitle: "Ciência e floresta", title: "A floresta também é lugar de pesquisa.",
    period: "Tefé e a pesquisa científica", dateLabel: "1990 e 1999 · marcos a validar",
    summary: "Projeto Mamirauá, conservação e pesquisa científica no Médio Solimões, com marcos ainda pendentes de validação.",
    lead: "O Médio Solimões reúne pesquisas sobre conservação ambiental, biodiversidade e comunidades tradicionais.",
    content: ["O briefing do projeto indica 1990 para a Estação Ecológica e o Projeto Mamirauá e 1999 para a criação do Instituto de Desenvolvimento Sustentável Mamirauá. Esses marcos continuam sinalizados para validação documental antes de publicação."],
    category: "Ciência e meio ambiente", relatedPeople: [], relatedPlaces: ["instituto-mamiraua"], sources: [], visualCredits: [], researchStatus: "under-investigation",
  },
  {
    id: "tefe-hoje", chapter: 7, shortTitle: "Tefé contemporânea", title: "A história continua em cada lembrança.",
    period: "Tefé contemporânea", dateLabel: "Presente",
    summary: "Transformações urbanas, fotografias e memórias culturais a reunir com autorização e contexto.",
    lead: "A cidade muda, as fotografias se acumulam e novas histórias passam de uma geração para a outra.",
    content: ["O capítulo contemporâneo vai aproximar imagens de hoje, registros de outras épocas e relatos de quem viveu essas transformações. Todo material visual deverá vir acompanhado de autoria, origem e condições de uso."],
    category: "Cultura", relatedPeople: [], relatedPlaces: ["tefe"], sources: [], visualCredits: [], researchStatus: "under-investigation",
  },
];

export function getEvent(id: string): HistoricalEvent | undefined {
  return events.find((event) => event.id === id);
}
