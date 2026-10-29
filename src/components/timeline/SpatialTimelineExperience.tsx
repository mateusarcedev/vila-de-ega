"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { MutableRefObject } from "react";
import { useExperience } from "./ExperienceProvider";
import type { HistoricalEvent } from "@/types/history";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { SceneErrorBoundary } from "@/components/scenes/SceneErrorBoundary";
import styles from "./SpatialTimelineExperience.module.css";

const SpatialTimelineCanvas = dynamic(() => import("./SpatialTimelineCanvas"), {
  ssr: false,
  loading: () => <div className={styles.loading} role="status">Preparando a exposição tridimensional…</div>,
});

interface Props { events: HistoricalEvent[]; }
type DisplayMode = "checking" | "interactive" | "static";

export function SpatialTimelineExperience({ events }: Props) {
  const root = useRef<HTMLElement>(null);
  const sceneFrame = useRef<HTMLDivElement>(null);
  const progress = useRef(0);
  const previousIndex = useRef(-1);
  const pendingSelection = useRef<number | null>(null);
  const [displayMode, setDisplayMode] = useState<DisplayMode>("checking");
  const [sceneVisible, setSceneVisible] = useState(false);
  const { activeId, setActiveId, jumpTo, mode } = useExperience();
  const activeIndex = Math.max(0, events.findIndex((event) => event.id === activeId));
  const activeEvent = events[activeIndex] ?? events[0];
  const visualIndex = useMemo(() => ({
    "antes-da-cidade": "01", missoes: "02", "vila-de-ega": "03", "cidade-de-tefe": "04",
    desenvolvimento: "05", ciencia: "06", "tefe-hoje": "07",
  }), []);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      const nav = navigator as Navigator & { deviceMemory?: number; connection?: { saveData?: boolean } };
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const lowPerformance = nav.connection?.saveData === true
        || (nav.deviceMemory !== undefined && nav.deviceMemory <= 2)
        || (nav.hardwareConcurrency !== undefined && nav.hardwareConcurrency <= 2);
      let supported = false;
      try { supported = Boolean(document.createElement("canvas").getContext("webgl2", { alpha: true, antialias: false })); }
      catch { supported = false; }
      setDisplayMode(supported && !reduced && !lowPerformance ? "interactive" : "static");
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    const interruptProgrammaticTravel = (event: Event) => {
      if (event.type === "keydown") {
        const key = (event as KeyboardEvent).key;
        if (!["ArrowDown", "ArrowUp", "PageDown", "PageUp", "Home", "End", " "].includes(key)) return;
      }
      pendingSelection.current = null;
    };
    window.addEventListener("wheel", interruptProgrammaticTravel, { passive: true });
    window.addEventListener("touchstart", interruptProgrammaticTravel, { passive: true });
    window.addEventListener("keydown", interruptProgrammaticTravel);
    return () => {
      window.removeEventListener("wheel", interruptProgrammaticTravel);
      window.removeEventListener("touchstart", interruptProgrammaticTravel);
      window.removeEventListener("keydown", interruptProgrammaticTravel);
    };
  }, []);

  useEffect(() => {
    const element = sceneFrame.current;
    if (!element || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(([entry]) => setSceneVisible(entry.isIntersecting), { rootMargin: "100px" });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useGSAP(() => {
    gsap.registerPlugin(ScrollTrigger);
    const element = root.current;
    if (!element) return;
    const trigger = ScrollTrigger.create({
      trigger: element,
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => {
        progress.current = self.progress;
        element.style.setProperty("--journey-progress", `${self.progress * 100}%`);
        const index = Math.round(self.progress * (events.length - 1));
        if (pendingSelection.current !== null && index !== pendingSelection.current) {
          setActiveId(events[pendingSelection.current].id);
          return;
        }
        pendingSelection.current = null;
        if (index !== previousIndex.current) {
          previousIndex.current = index;
          setActiveId(events[index].id);
        }
      },
    });
    ScrollTrigger.refresh();
    return () => trigger.kill();
  }, { scope: root, dependencies: [events, setActiveId] });

  const selectPeriod = useCallback((index: number) => {
    const element = root.current;
    if (!element) return;
    const bounded = Math.max(0, Math.min(events.length - 1, index));
    pendingSelection.current = bounded;
    const rect = element.getBoundingClientRect();
    const travel = Math.max(0, element.offsetHeight - window.innerHeight);
    const nextY = window.scrollY + rect.top + (bounded / (events.length - 1)) * travel;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: nextY, behavior: reduceMotion ? "auto" : "smooth" });
    setActiveId(events[bounded].id);
  }, [events, setActiveId]);

  const markUnavailable = useCallback(() => setDisplayMode("static"), []);
  const eventNumber = visualIndex[activeEvent.id as keyof typeof visualIndex] ?? String(activeEvent.chapter).padStart(2, "0");

  return (
    <section
      ref={root}
      id="linha-do-tempo"
      className={styles.experience}
      data-spatial-timeline
      data-mode={mode}
      aria-labelledby="spatial-timeline-title"
    >
      <div className={styles.sticky}>
        <header className={styles.header}>
          <div>
            <p className={styles.kicker}><span aria-hidden="true">◦</span> Exposição cronológica · Médio Solimões</p>
            <h2 id="spatial-timeline-title">A história em perspectiva</h2>
          </div>
          <p className={styles.modeLabel}>{mode === "guided" ? "Viagem guiada" : "Exploração livre"}<span> · role para avançar</span></p>
        </header>

        <div className={styles.spread}>
          <article className={styles.story} aria-live="polite" aria-atomic="true" data-active-event={activeEvent.id}>
            <p className={styles.chapterNo}>CAPÍTULO {eventNumber} <span>/{String(events.length).padStart(2, "0")}</span></p>
            <p className={styles.period}>{activeEvent.period}</p>
            <h3>{activeEvent.title}</h3>
            <p className={styles.summary}>{activeEvent.summary}</p>
            <StatusBadge status={activeEvent.researchStatus} />
            <button className={styles.readMore} type="button" onClick={() => { pendingSelection.current = null; jumpTo(activeEvent.id); }}>
              Ler este capítulo <span aria-hidden="true">↘</span>
            </button>
          </article>

          <div className={styles.sceneColumn}>
            <div ref={sceneFrame} className={styles.sceneFrame} data-timeline-scene data-display-mode={displayMode}>
              <span className={styles.sceneLabel}>Estrutura curatorial tridimensional</span>
              {displayMode === "static" && (
                <Image className={styles.poster} src="/scenes/posters/tefe-timeline-display.png" alt="Estrutura tridimensional da linha do tempo, com sete marcadores curatoriais" fill sizes="(max-width: 760px) 100vw, 68vw" priority={false} />
              )}
              {displayMode === "interactive" && sceneVisible && (
                <SceneErrorBoundary onError={markUnavailable}>
                  <SpatialTimelineCanvas events={events} progress={progress as MutableRefObject<number>} onSelect={selectPeriod} reducedMotion={false} />
                </SceneErrorBoundary>
              )}
              {(displayMode === "checking" || (displayMode === "interactive" && !sceneVisible)) && <div className={styles.loading} role="status">{displayMode === "checking" ? "Preparando a exposição tridimensional…" : "Estrutura curatorial · pronta para explorar"}</div>}
              <span className={styles.depthCaption}>Peça de exposição original · os marcadores organizam capítulos, não posições geográficas.</span>
            </div>
          </div>
        </div>

        <div className={styles.controls}>
          <div className={styles.controlHeading}>
            <span>Marcos da narrativa</span>
            <span aria-live="polite">{eventNumber} / {String(events.length).padStart(2, "0")}</span>
          </div>
          <nav className={styles.markers} aria-label="Selecionar período histórico">
            {events.map((event, index) => (
              <button
                key={event.id}
                type="button"
                data-timeline-marker={event.id}
                aria-pressed={activeEvent.id === event.id}
                aria-label={`Capítulo ${event.chapter}: ${event.shortTitle}, ${event.period}`}
                onClick={() => selectPeriod(index)}
              >
                <span className={styles.markerNumber}>{String(event.chapter).padStart(2, "0")}</span>
                <span className={styles.markerTitle}>{event.shortTitle}</span>
              </button>
            ))}
          </nav>
          <div className={styles.controlsFoot}>
            <button type="button" onClick={() => selectPeriod(activeIndex - 1)} disabled={activeIndex === 0}>← Anterior</button>
            <span className={styles.scrollHint}>Role a página para percorrer a cronologia</span>
            <button type="button" onClick={() => selectPeriod(activeIndex + 1)} disabled={activeIndex === events.length - 1}>Próximo →</button>
            <Link href="#portais">Trocar modo de navegação ↑</Link>
          </div>
        </div>
      </div>
      <span className={styles.progressTrack} aria-hidden="true"><i /></span>
    </section>
  );
}
