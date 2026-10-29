"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import type { CSSProperties, RefObject } from "react";
import type { HistoricalScene } from "@/types/history";
import { SceneErrorBoundary } from "./SceneErrorBoundary";
import styles from "./OpeningBookExperience.module.css";

const BookSceneCanvas = dynamic(() => import("./BookSceneCanvas"), {
  ssr: false,
  loading: () => <div className={styles.loading} role="status">Preparando o livro tridimensional…</div>,
});

type SceneMode = "checking" | "interactive" | "static";
type StaticReason = "reduced-motion" | "low-performance" | "webgl-unavailable" | "manual";

interface Props {
  scene: HistoricalScene;
  opening: boolean;
  opened: boolean;
  closing: boolean;
  paused: boolean;
  onOpened: () => void;
  onClosed: () => void;
  onPauseToggle: () => void;
  onReverse: () => void;
  scrollRoot: RefObject<HTMLElement | null>;
}

const staticMessage: Record<StaticReason, string> = {
  "reduced-motion": "Imagem estática por preferência de movimento reduzido.",
  "low-performance": "Imagem estática para preservar o desempenho do dispositivo.",
  "webgl-unavailable": "Imagem estática · a cena 3D não está disponível neste navegador.",
  manual: "Apresentação estática do modelo tridimensional.",
};

export function OpeningBookExperience({ scene, opening, opened, closing, paused, onOpened, onClosed, onPauseToggle, onReverse, scrollRoot }: Props) {
  const [mode, setMode] = useState<SceneMode>("checking");
  const [staticReason, setStaticReason] = useState<StaticReason>("webgl-unavailable");
  const [sceneReady, setSceneReady] = useState(false);
  const [visible, setVisible] = useState(true);
  const stageRef = useRef<HTMLDivElement>(null);
  const didFinishFallback = useRef(false);

  const reportProgress = useCallback((value: number) => {
    if (stageRef.current) stageRef.current.dataset.openingProgress = value.toFixed(3);
  }, []);

  const markSceneReady = useCallback(() => setSceneReady(true), []);
  const markSceneUnavailable = useCallback(() => {
    setStaticReason("webgl-unavailable");
    setSceneReady(false);
    setMode("static");
  }, []);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      const nav = navigator as Navigator & {
        deviceMemory?: number;
        connection?: { saveData?: boolean };
      };

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        setStaticReason("reduced-motion");
        setMode("static");
        return;
      }

      const lowPerformance = nav.connection?.saveData === true
        || (nav.deviceMemory !== undefined && nav.deviceMemory <= 2)
        || nav.hardwareConcurrency <= 2;

      if (lowPerformance) {
        setStaticReason("low-performance");
        setMode("static");
        return;
      }

      const probe = document.createElement("canvas");
      let supported = false;
      try {
        const context = probe.getContext("webgl2", { alpha: true, antialias: false });
        supported = Boolean(context);
        context?.getExtension("WEBGL_lose_context")?.loseContext();
      } catch {
        supported = false;
      }

      setStaticReason("webgl-unavailable");
      setMode(supported ? "interactive" : "static");
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (mode !== "static" || !opening || didFinishFallback.current) return;
    didFinishFallback.current = true;
    onOpened();
  }, [mode, onOpened, opening]);

  useEffect(() => {
    if (mode !== "static" || !closing) return;
    didFinishFallback.current = false;
    onClosed();
  }, [closing, mode, onClosed]);

  useEffect(() => {
    const element = stageRef.current;
    if (!element || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(([entry]) => {
      element.dataset.visible = entry.isIntersecting ? "true" : "false";
      setVisible(entry.isIntersecting);
    }, { rootMargin: "120px" });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const useStaticImage = () => {
    didFinishFallback.current = false;
    setStaticReason("manual");
    setSceneReady(false);
    setMode("static");
  };

  const ratioStyle = { "--scene-aspect": scene.aspectRatio ?? "16 / 10" } as CSSProperties;

  return (
    <figure className={styles.figure} data-scene-id={scene.sceneId}>
      <div
        ref={stageRef}
        className={styles.viewport}
        data-opening-book-stage
        data-opening-mode={mode}
        data-opening-state={closing ? "closing" : paused ? "paused" : opened ? "opened" : opening ? "opening" : "closed"}
        style={ratioStyle}
        role={mode === "interactive" ? "group" : undefined}
        tabIndex={mode === "interactive" ? 0 : undefined}
        aria-label={mode === "interactive" ? "Livro 3D interativo. Use as setas para mudar o ângulo." : undefined}
      >
        {(opened ? scene.openPoster : scene.poster) && (
          <Image
            className={`${styles.poster} ${mode === "interactive" && sceneReady ? styles.posterHidden : ""}`}
            src={(opened ? scene.openPoster : scene.poster)!}
            alt={mode === "interactive" && sceneReady ? "" : opened ? "Livro-Atlas artístico aberto, em imagem estática do modelo 3D" : "Livro-Atlas artístico fechado, em imagem estática do modelo 3D"}
            fill
            priority
            sizes="(max-width: 760px) 90vw, 48vw"
          />
        )}

        {mode === "checking" && <div className={styles.loading} role="status">Preparando a experiência…</div>}

        {mode === "interactive" && scene.modelUrl && (
          <SceneErrorBoundary onError={() => { setStaticReason("webgl-unavailable"); setSceneReady(false); setMode("static"); }}>
            <Suspense fallback={<div className={styles.loading} role="status">Carregando o modelo 3D…</div>}>
              <BookSceneCanvas
                modelUrl={scene.modelUrl}
                opening={opening}
                opened={opened}
                closing={closing}
                paused={paused}
                visible={visible}
                scrollRoot={scrollRoot}
                onReady={markSceneReady}
                onOpened={onOpened}
                onClosed={onClosed}
                onProgress={reportProgress}
                onUnavailable={markSceneUnavailable}
              />
            </Suspense>
          </SceneErrorBoundary>
        )}

        {mode === "interactive" && <p className={styles.instructions}>Mova o cursor, arraste ou use as setas para observar</p>}
        {mode === "static" && <p className={styles.staticNote}>{staticMessage[staticReason]}</p>}
        {mode === "interactive" && (opening || closing || paused || opened) && (
          <div className={styles.playbackControls} aria-label="Controles da animação do livro">
            {(opening || closing || paused) && <button type="button" onClick={onPauseToggle}>{paused ? "Retomar movimento" : "Pausar movimento"}</button>}
            <button type="button" onClick={onReverse}>{closing ? "Fechar livro…" : "Reverter abertura"}</button>
            {opened && <button type="button" onClick={onOpened}>Continuar para a linha do tempo ↘</button>}
          </div>
        )}
      </div>

      <figcaption className={styles.caption}>
        <span>{scene.description}</span>
        {mode === "interactive" && <button type="button" onClick={useStaticImage}>Usar imagem estática</button>}
        {scene.credits.length > 0 && (
          <details>
            <summary>Créditos do modelo</summary>
            <ul>
              {scene.credits.map((credit, index) => (
                <li key={`${scene.sceneId}-credit-${index}`}>
                  {[credit.creator, credit.collection, credit.date, credit.license, credit.notes].filter(Boolean).join(" · ")}
                </li>
              ))}
            </ul>
          </details>
        )}
      </figcaption>
    </figure>
  );
}
