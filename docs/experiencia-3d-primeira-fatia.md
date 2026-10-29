# Primeira experiência 3D — Memórias de Tefé

## Estado da entrega

A abertura usa um livro tridimensional artístico, com modelo e animação reais exportados de Blender 5.2 para GLB. O arquivo editável e a versão web ficam no repositório:

- `assets/3d-source/tefe-opening-atlas.blend` — cena Blender editável.
- `public/scenes/models/tefe-opening-atlas.glb` — modelo web, 824 KB.
- `public/scenes/posters/tefe-opening-atlas.png` — render PNG transparente, 1000 × 800, para fallback.

O modelo tem 28 malhas e cinco materiais PBR simples. A cena inclui capa frontal articulada, lombada, miolo, folhas, gravação tipográfica, filetes e luzes. Os clipes GLTF exportados chamam-se `RIG_CoverHinge` e `RIG_PageTurnHinge`; juntos duram aproximadamente 2,3 segundos. O objeto é uma peça artística contemporânea e não representa um livro histórico, mapa ou documento de acervo.

O Blender 5.4 alpha fornecido no computador não foi executado pelo shell WSL desta sessão. O arquivo foi criado e renderizado no ambiente Blender 5.2 conectado, depois baixado e inspecionado. O `.blend` pode ser aberto e revisado com a instalação local.

## Experiência implementada

- `OpeningBookExperience` verifica `prefers-reduced-motion`, suporte a WebGL 2, economia de dados e sinais básicos de baixo desempenho. Quando necessário, mantém o poster e conduz ao conteúdo sem bloquear a navegação.
- `BookSceneCanvas` carrega em um chunk cliente e só monta o Canvas quando a cena está disponível. Usa React Three Fiber, Drei `useGLTF`/`useAnimations`, iluminação real e os clipes do modelo.
- Ponteiro, arraste e setas do teclado alteram suavemente a orientação do livro, dentro de limites pequenos.
- O botão principal inicia a animação. GSAP aproxima a câmera por um instante, acompanha a abertura para enquadrar a dupla página e então leva a pessoa à linha do tempo. A navegação livre segue disponível sem abrir o livro.
- ScrollTrigger acompanha a rolagem do hero e conduz discretamente a câmera antes da abertura. O loop de renderização é pausado fora da área visível, exceto enquanto a animação está em curso.
- O poster renderizado do próprio modelo cobre movimento reduzido, WebGL indisponível, baixo desempenho, erro de carregamento ou escolha manual da imagem estática.

O canvas permanece restrito ao hero, onde há um modelo real. Three.js não é carregado pelos capítulos históricos. A linha do tempo mantém os links diretos, os dois modos de navegação e o estado do período ativo já existente.

## Limites históricos e próxima evolução

Os marcos de 1759 e 1855 continuam com o conteúdo e os espaços de recurso visual existentes. Ainda não há cena documental da Vila de Ega, fotografia licenciada ou cartografia histórica validada; portanto não foi acrescentada geometria histórica ou mapa fictício. ScrollTrigger continua revelando capítulos e datas, e a câmera 3D só se move onde há um objeto 3D real.

Para adicionar cenas históricas depois:

1. Produzir modelo Blender com origem, escala, créditos e fontes registrados.
2. Exportar GLB autocontido com poster estático do mesmo modelo.
3. Adicionar contrato de cena em `src/content/scenes.ts`.
4. Usar o `HistoricalSceneSlot` para uma visualização genérica ou criar um controlador narrativo quando a cena pedir câmera e movimento próprios.
5. Ligar movimentos a uma única linha ScrollTrigger por trecho; manter fallback estático e navegação por links.

## Base cartográfica a validar

As fontes abaixo são candidatas para contexto geográfico atual. Nenhuma delas, isoladamente, documenta a forma da Vila de Ega ou o curso histórico do rio em uma época específica.

- **IBGE, BC250, versão 2025:** referência regional para hidrografia, localidades e nomes geográficos; a escala 1:250.000 não serve para representar ruas ou quarteirões com precisão local. [Produto e documentação](https://www.ibge.gov.br/geociencias/cartas-e-mapas/bases-cartograficas-continuas/15759-brasil.html).
- **IBGE, Malha Municipal Digital 2025:** limite político-administrativo contemporâneo, em SIRGAS 2000; não deve ser tratado como limite histórico. [Produto e downloads](https://www.ibge.gov.br/geociencias/organizacao-do-territorio/malhas-territoriais/15774-malhas.html).
- **ANA, Base Hidrográfica Ottocodificada Multiescalas (BHO6):** rede hidrográfica nacional para análise contemporânea. Antes de usar, conferir cobertura, metadados e generalização do trecho do Médio Solimões. [Apresentação da ANA](https://www.gov.br/ana/pt-br/assuntos/noticias-e-eventos/noticias/base-de-dados-geoespaciais-da-ana-permite-gestao-mais-eficiente-das-bacias-hidrograficas/) e [registro no catálogo SNIRH](https://metadados.snirh.gov.br/geonetwork/srv/api/records/b228d007-6d68-46e5-b30d-a1e191b2b21f).

Para um mapa navegável de lugares, ainda será necessário reunir coordenadas verificadas para cada local, registrar datum, escala, data, método, incerteza e licença, e obter cartografia histórica com procedência para qualquer camada de época. Um modelo de terreno local para Tefé também não foi selecionado; não gerar relevo ou hidrografia por aproximação visual.

## Validação realizada

- `npm run typecheck` — aprovado.
- `npm run lint` — aprovado.
- `npm run build` — aprovado; rotas da homepage e dos registros foram geradas.
- `npm run test:e2e` — 11 aprovados e 1 ignorado. O caso ignorado é a checagem mobile no projeto desktop; a checagem correspondente passou no projeto mobile.
- Playwright em Chromium com WebGL por software (SwiftShader) — canvas montado e GLB carregado em viewports desktop (1440 × 960) e mobile (390 × 844); movimento de ponteiro alterou a orientação; “Iniciar viagem” concluiu a abertura e navegou para `#linha-do-tempo`; sem erros de runtime.
- Playwright sem WebGL — fallback do poster e da navegação testados junto com links diretos, alternância de modos, preservação do período, teclado, movimento reduzido e overflow horizontal mobile.
- Renderes do modelo fechado, em abertura e aberto foram inspecionados antes da exportação. O navegador foi conferido por screenshot no estado fechado, durante a abertura e aberto.

Os testes mobile usaram emulação de viewport e toque no Chromium, não um aparelho físico. O WebGL foi exercitado com renderização por software; a taxa de quadros ainda precisa ser observada em celulares intermediários reais.

## Próximas dependências

- Teste em aparelhos físicos Android/iOS de desempenho intermediário para ajustar qualidade, tamanho do modelo e consumo térmico.
- Uma cena histórica dos marcos só deve ser ligada quando houver material visual com procedência e fontes suficientes. O mapa de Vila de Ega permanece reservado.
- Para cartografia 3D, validar cobertura e licença dos dados do IBGE/ANA, obter coordenadas verificáveis dos lugares e registrar datum, escala, época e incerteza de cada camada. Dados atuais não reconstituem automaticamente a geografia histórica.
