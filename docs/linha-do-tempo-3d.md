# Memórias de Tefé — primeira cronologia tridimensional

## Decisões desta fatia

- `SpatialTimelineExperience` é o trecho espacial da linha do tempo. O `ScrollTrigger` acompanha apenas esse elemento, sem pin e sem capturar a rolagem vertical da página. O trecho tem altura natural de 255svh (245svh em telas pequenas); rolar, escolher um marcador ou usar anterior/próximo alimenta o mesmo progresso cronológico.
- `SpatialTimelineCanvas` carrega o GLB sob demanda e segue esse progresso com uma câmera Three.js. Os sete seletores HTML são controles acessíveis por teclado; clicar num objeto 3D também seleciona seu capítulo. O texto, as fontes e a sinalização de pesquisa continuam fora do Canvas.
- `TimelineRail` deixou de ser montado. A alternância entre viagem guiada e exploração livre continua em `ModeSwitch`, antes da cronologia. Cada capítulo ganhou o retorno “Voltar à cronologia 3D”, que volta ao marco selecionado.
- O modelo `tefe-timeline-display.glb` é uma estrutura artística de exposição em madeira, esmalte e latão. Os sete marcadores são organizadores editoriais, não lugares nem acontecimentos materiais reconstruídos. Não há mapa, hidrografia ou arquitetura histórica na peça.
- WebGL incompatível, aparelhos em modo de economia/baixa capacidade e `prefers-reduced-motion` usam o pôster renderizado do próprio modelo. Os controles de seleção e leitura continuam disponíveis.

## Auditoria do livro original

O primeiro GLB tinha uma caixa de páginas (`HERO_PageBlock`), cinco folhas/placas de oito vértices embutidas no bloco e uma lombada em forma de caixa estática. Os dois clipes originais animavam apenas rotações rígidas e lineares; a lombada não acompanhava a abertura. O componente React também solicitava `RIG_PageTurnHinge`, nome ausente no GLB, e por isso deixava de controlar o novo rig.

O arquivo Blender está na revisão 9, atualizado no Blender 5.2 via 3D Jutsu. A capa conserva a dobradiça na encadernação. Três folhas distintas têm malha subdividida (950 vértices por folha) e shape keys de flexão. A lombada é uma malha curva subdividida (1.218 vértices) com flexão própria. O bloco continua dando volume ao miolo; as folhas individuais têm espessura de papel, não espessura de placa. O GLB exporta oito ações independentes a 30 fps, amostradas ao longo de 140 quadros (4,63 s): rotação da capa, rotação e flexão de cada folha, e flexão da lombada. Na revisão 9, cada folha também levanta e assenta com uma altura própria para permanecer visível sobre a capa aberta.

O React Three Fiber prepara essas ações em repouso e o GSAP move um progresso único de 0 a 1. Assim é possível pausar, retomar ou reverter do ponto visível, sem reiniciar os clipes. A câmera aproxima nos primeiros 9%, abre o enquadramento enquanto a capa se ergue, aproxima novamente à medida que as folhas assentam e recua levemente no fim. A escala do modelo no hero foi aumentada para torná-lo protagonista. Fora da abertura, o movimento discreto de ponteiro/setas permanece disponível.

Na inspeção visual foram comparados os estados fechado, 25%, 50%, 75% e aberto, além do vídeo contínuo. O primeiro enquadramento intermediário cortava a capa; o caminho de câmera foi revisto para mantê-la inteira durante a subida. As folhas mostram curvatura nos quadros intermediários e terminam visíveis no lado aberto. Nos quadros amostrados não foi observada interseção perceptível entre as folhas e a capa. A interação por ponteiro, teclado, pausa, retomada e reversão foi verificada no browser.

## Arquivos 3D

| Cena | Fonte Blender | GLB entregue ao navegador | Render de fallback |
| --- | --- | --- | --- |
| Livro de abertura | `assets/3d-source/tefe-opening-atlas.blend` | `public/scenes/models/tefe-opening-atlas.glb` | `public/scenes/posters/tefe-opening-atlas.png` e `tefe-opening-atlas-open.png` |
| Cronologia curatorial | `assets/3d-source/tefe-timeline-display.blend` | `public/scenes/models/tefe-timeline-display.glb` | `public/scenes/posters/tefe-timeline-display.png` |

Os fontes Blender são cenas artísticas originais, não artefatos históricos. Os nomes dos marcadores e seus vínculos aos IDs do conteúdo são parte do contrato de exportação. O peso atual dos GLBs está próximo de 0,96 MB (livro) e 1,23 MB (expositor), antes de eventuais compressões de entrega.

## Cartografia 3D futura

A estrutura atual não contém dados geográficos. Para uma cena cartográfica verificável, a próxima fase deve guardar, com cada camada, o órgão produtor, edição/data, escala ou resolução, sistema de referência espacial, licença/condições de uso e data de consulta. A camada geográfica web deverá ser construída a partir dos dados originais e transformações documentadas; Blender poderá receber um recorte derivado e versionado, nunca uma forma desenhada à mão apresentada como relevo ou rio real.

Fontes oficiais a avaliar para um primeiro mapa do Médio Solimões:

- [Malhas Territoriais do IBGE](https://www.ibge.gov.br/geociencias/organizacao-do-territorio/malhas-territoriais/15774-malhas.html) — referência para limites administrativos e localização municipal; escolher explicitamente a edição adequada ao recorte.
- [Bases Cartográficas Contínuas do Brasil, IBGE](https://www.ibge.gov.br/geociencias/cartas-e-mapas/bases-cartograficas-continuas.html) — inclui camadas de referência, como hidrografia, em produtos com escala e especificação publicadas.
- [Base Hidrográfica Ottocodificada Multiescalas, ANA](https://www.gov.br/ana/pt-br/assuntos/noticias-e-eventos/noticias/base-de-dados-geoespaciais-da-ana-permite-gestao-mais-eficiente-das-bacias-hidrograficas/) e [catálogo de metadados da BHO6](https://metadados.snirh.gov.br/geonetwork/srv/por/catalog.search#/metadata/32e309da-a8c1-443f-90ac-0cd79ce6a33d) — avaliar cobertura, escala, licença, data e atributos antes de derivar uma camada visual.

Mapas históricos de períodos coloniais exigem uma fonte documental distinta, referência bibliográfica/arquivística, procedência e análise de divergências. Nenhuma linha atual de rio pode ser apresentada como traçado histórico.

## Evidências de validação

As capturas dos estados do livro e os metadados de progresso estão em `docs/evidence/book-opening-after/`. A gravação WebM mostra a abertura e a navegação aos marcos de Ega e Tefé em `docs/evidence/book-opening-after.webm`; a captura usou Chromium/SwiftShader em 960 × 600, 177 quadros e 12,85 segundos (aproximadamente 14 fps). Capturas de desktop e mobile da cronologia estão em `docs/evidence/timeline-desktop.png` e `docs/evidence/timeline-mobile.png`. Os testes também confirmaram seleção móvel sem overflow e uso dos pôsteres sob `prefers-reduced-motion`.
