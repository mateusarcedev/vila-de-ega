"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef } from "react";
import type { ReactNode } from "react";
import { useExperience } from "./ExperienceProvider";
import styles from "./TimelineRuntime.module.css";

export function TimelineRuntime({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  const { setActiveId } = useExperience();

  useEffect(() => {
    const id = decodeURIComponent(window.location.hash.slice(1));
    if (id && document.getElementById(id)?.matches("[data-history-chapter]")) setActiveId(id);
  }, [setActiveId]);

  useGSAP(() => {
    gsap.registerPlugin(ScrollTrigger);
    const scope = root.current;
    if (!scope) return;
    const chapters = gsap.utils.toArray<HTMLElement>("[data-history-chapter]", scope);
    const bar = scope.querySelector<HTMLElement>("[data-progress-fill]");

    chapters.forEach((chapter) => {
      ScrollTrigger.create({
        trigger: chapter,
        start: "top 52%",
        end: "bottom 52%",
        onEnter: () => { chapter.dataset.active = "true"; setActiveId(chapter.id); },
        onEnterBack: () => { chapter.dataset.active = "true"; setActiveId(chapter.id); },
        onLeave: () => { chapter.dataset.active = "false"; },
        onLeaveBack: () => { chapter.dataset.active = "false"; },
      });
    });

    ScrollTrigger.create({
      trigger: scope,
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => {
        if (bar) bar.style.transform = `scaleX(${self.progress})`;
        scope.style.setProperty("--timeline-progress", `${self.progress * 100}%`);
      },
    });

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!reducedMotion) {
      chapters.forEach((chapter) => {
        const heading = chapter.querySelector<HTMLElement>("[data-reveal-heading]");
        if (heading) gsap.fromTo(heading, { y: 18, rotateX: -2 }, {
          y: 0, rotateX: 0, duration: 0.75, ease: "power3.out", immediateRender: false,
          scrollTrigger: { trigger: chapter, start: "top 72%", once: true },
        });
        const dateMarker = chapter.querySelector<HTMLElement>("[data-time-marker]");
        if (dateMarker) gsap.fromTo(dateMarker, { y: 22, rotateX: -7 }, {
          y: 0, rotateX: 0, duration: 0.85, ease: "power3.out", immediateRender: false,
          scrollTrigger: { trigger: chapter, start: "top 70%", once: true },
        });
      });
    }
  }, { scope: root, dependencies: [setActiveId] });

  return (
    <div ref={root} className={styles.runtime}>
      <div className={styles.progress} aria-hidden="true"><span data-progress-fill /></div>
      {children}
    </div>
  );
}
