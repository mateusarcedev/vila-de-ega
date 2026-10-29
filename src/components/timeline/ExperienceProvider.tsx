"use client";

import { createContext, useCallback, useContext, useState } from "react";
import type { ReactNode } from "react";

type NavigationMode = "guided" | "free";
interface ExperienceContextValue {
  mode: NavigationMode;
  setMode: (mode: NavigationMode) => void;
  activeId: string;
  setActiveId: (id: string) => void;
  jumpTo: (id: string) => void;
  returnToTimeline: () => void;
}

const ExperienceContext = createContext<ExperienceContextValue | null>(null);

export function ExperienceProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<NavigationMode>("guided");
  const [activeId, setActiveId] = useState("antes-da-cidade");

  const jumpTo = useCallback((id: string) => {
    const target = document.getElementById(id);
    if (!target) return;
    if (target.matches("[data-history-chapter]")) setActiveId(id);
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    target.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
    window.history.replaceState(null, "", `#${id}`);
  }, []);

  const returnToTimeline = useCallback(() => {
    const root = document.querySelector<HTMLElement>("[data-spatial-timeline]");
    if (!root) return;
    const markers = Array.from(root.querySelectorAll<HTMLButtonElement>("[data-timeline-marker]"));
    const index = Math.max(0, markers.findIndex((marker) => marker.dataset.timelineMarker === activeId));
    const progress = markers.length > 1 ? index / (markers.length - 1) : 0;
    const travel = Math.max(0, root.offsetHeight - window.innerHeight);
    const top = window.scrollY + root.getBoundingClientRect().top + progress * travel;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.history.replaceState(null, "", "#linha-do-tempo");
    window.scrollTo({ top, behavior: reduceMotion ? "auto" : "smooth" });
  }, [activeId]);

  return (
    <ExperienceContext.Provider value={{ mode, setMode, activeId, setActiveId, jumpTo, returnToTimeline }}>
      <div data-mode={mode}>{children}</div>
    </ExperienceContext.Provider>
  );
}

export function useExperience() {
  const context = useContext(ExperienceContext);
  if (!context) throw new Error("useExperience precisa estar dentro de ExperienceProvider.");
  return context;
}
