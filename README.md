# Memórias de Tefé

Aplicação do museu digital **Memórias de Tefé — Histórias que o tempo não levou**. Os quatro arquivos do protótipo estático foram preservados em `prototype-original/`; a aplicação Next.js vive em `src/`.

## Executar localmente

Requer Node.js 20.9 ou superior.

```sh
npm install
npm run dev
```

Abra `http://localhost:3000`.

Comandos de validação:

```sh
npm run typecheck
npm run lint
npm run build
```

Para os testes no browser, instale o Chromium do Playwright e execute o build antes:

```sh
npx playwright install chromium
npm run build
npm run test:e2e
```

## Estrutura

- `src/app/`: App Router, layout e fichas de história, personagens e lugares.
- `src/content/`: acontecimentos, personagens e lugares em dados tipados.
- `src/components/timeline/`: portais, exposição 3D, alternância de modos, rolagem narrativa e capítulos.
- `src/components/scenes/`: `HistoricalSceneSlot` e renderer 3D separado por carregamento dinâmico.
- `src/components/historical/`: cartões e apresentação de fontes e fichas.
- `src/app/globals.css` e arquivos `*.module.css`: tokens, estilos base e módulos de componentes.
- `assets/3d-source/`: arquivos Blender autorais e editáveis das cenas 3D.
- `public/scenes/`: modelos GLB e pôsteres gerados das cenas artísticas.

## Cronologia 3D e livro de abertura

A homepage abre um modelo Blender de livro artístico (revisão 9). A sequência sincroniza clipes de capa, folhas flexíveis e lombada por um único progresso GSAP, com controles para pausar, retomar e reverter. A cronologia apresenta um expositor 3D com sete marcadores ligados aos IDs em `src/content/events.ts`; a rolagem nativa e os seletores acessíveis controlam a mesma câmera. A cena carrega sob demanda e usa pôster quando WebGL, desempenho ou preferência de movimento pedem uma alternativa.

O expositor é cenográfico e curatorial: não contém mapas, relevo, rios ou edificações históricas. Arquitetura, diagnóstico do livro e fontes oficiais candidatas a dados cartográficos estão em [`docs/linha-do-tempo-3d.md`](docs/linha-do-tempo-3d.md). As capturas e o vídeo da validação ficam em `docs/evidence/`.

## Conteúdo e acervo

Novos acontecimentos entram em `src/content/events.ts`. Atributos de pesquisa usam `documented`, `under-investigation`, `oral-tradition` ou `artistic-reconstruction`; referências devem ser adicionadas ao próprio registro e nunca presumidas. Pessoas e lugares têm estruturas equivalentes em `people.ts` e `places.ts`.

O componente `HistoricalSceneSlot` recebe `sceneId`, `title`, `description`, `aspectRatio`, `poster`, `modelUrl`, `status`, `credits` e `sources`. Sem um recurso aprovado, exibe um espaço editorial reservado. Uma cena GLB só tenta carregar o pacote 3D quando `status` for `available` e `modelUrl` estiver preenchido. Pôsteres devem ser arquivos locais em `public/` com créditos e licença registrados.

## Migração e limites atuais

A homepage e os capítulos não usam desenhos vetoriais e CSS para representar paisagens, embarcações, igrejas, cidade ou mapas. As únicas cenas incluídas são o livro artístico e o expositor cronológico; nenhuma representa um artefato ou lugar histórico. Fichas sem referência permanecem sinalizadas como investigação. Não há fotografias ou documentos históricos incorporados nesta versão.
