"use client";

import Link from "next/link";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useCallback, useEffect, useRef, useState } from "react";
import { useExperience } from "@/components/timeline/ExperienceProvider";
import { openingBook } from "@/content/scenes";
import { OpeningBookExperience } from "@/components/scenes/OpeningBookExperience";
import { HeroActions } from "./HeroActions";
import styles from "./HomeHero.module.css";

export function HomeHero() {
  const root = useRef<HTMLElement>(null);
  const { jumpTo } = useExperience();
  const [opening, setOpening] = useState(false);
  const [opened, setOpened] = useState(false);
  const [closing, setClosing] = useState(false);
  const [paused, setPaused] = useState(false);
  const enterTimer = useRef<number | null>(null);

  useEffect(() => () => { if (enterTimer.current) window.clearTimeout(enterTimer.current); }, []);

  const startJourney = useCallback(() => {
    if (opened) {
      jumpTo("linha-do-tempo");
      return;
    }
    if (enterTimer.current) window.clearTimeout(enterTimer.current);
    setClosing(false);
    setPaused(false);
    setOpening(true);
  }, [jumpTo, opened]);

  const finishOpening = useCallback(() => {
    setOpening(false);
    setOpened(true);
    setClosing(false);
    if (enterTimer.current) window.clearTimeout(enterTimer.current);
    enterTimer.current = window.setTimeout(() => jumpTo("linha-do-tempo"), 1150);
  }, [jumpTo]);

  const reverseBook = useCallback(() => {
    if (enterTimer.current) window.clearTimeout(enterTimer.current);
    setOpening(false);
    setOpened(false);
    setPaused(false);
    setClosing(true);
  }, []);

  const finishClosing = useCallback(() => {
    setClosing(false);
    setOpening(false);
    setOpened(false);
    setPaused(false);
  }, []);

  const togglePlayback = useCallback(() => setPaused((value) => !value), []);

  useGSAP(() => {
    const element = root.current;
    if (!element || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const intro = gsap.timeline({ defaults: { ease: "power2.out" } });
    intro
      .fromTo("[data-hero-kicker]", { y: 10 }, { y: 0, duration: 0.55 })
      .fromTo("[data-hero-title]", { y: 24, rotateX: -3 }, { y: 0, rotateX: 0, duration: 0.9 }, "<0.04")
      .fromTo("[data-hero-support]", { y: 12 }, { y: 0, duration: 0.65 }, "<0.12")
      .fromTo("[data-hero-actions]", { y: 10 }, { y: 0, duration: 0.55 }, "<0.08");
  }, { scope: root });

  return (
    <section ref={root} className={styles.hero} id="inicio" aria-labelledby="hero-title">
      <div className={styles.topline}>
        <p data-hero-kicker>Um museu digital do Médio Solimões</p>
        <span>Arquivo vivo <i aria-hidden="true">·</i> 07 capítulos</span>
      </div>
      <div className={styles.composition}>
        <div className={styles.copy}>
          <p className={styles.kicker}>Tefé · Amazonas <span aria-hidden="true">/</span> Histórias e território</p>
          <h1 id="hero-title" data-hero-title>Memórias<br /><em>de Tefé</em></h1>
          <p className={styles.tagline}>Histórias que o tempo não levou.</p>
          <div className={styles.support} data-hero-support>
            <span className={styles.chapterIndex} aria-hidden="true">01</span>
            <p>Antes de ser cidade, Tefé já era território, memória e história.</p>
          </div>
          <div className={styles.actions} data-hero-actions>
            <HeroActions onStartJourney={startJourney} opening={opening} opened={opened} />
          </div>
        </div>

        <div className={styles.sceneStage} aria-label="Livro artístico tridimensional de Memórias de Tefé">
          <span className={styles.depthPlate} data-hero-depth aria-hidden="true" />
          <span className={styles.stageIndex} aria-hidden="true">I</span>
          <div className={styles.sceneSurface}>
            <OpeningBookExperience
              scene={openingBook}
              opening={opening}
              opened={opened}
              closing={closing}
              paused={paused}
              onOpened={finishOpening}
              onClosed={finishClosing}
              onPauseToggle={togglePlayback}
              onReverse={reverseBook}
              scrollRoot={root}
            />
          </div>
          <p className={styles.stageCaption}><span>Livro-Atlas artístico</span><span>Abertura interativa</span></p>
        </div>
      </div>
      <div className={styles.bottomline}>
        <span>Memória, paisagem e passagem do tempo</span>
        <Link className={styles.scroll} href="#portais"><span>Desça para começar</span><span aria-hidden="true">↓</span></Link>
      </div>
    </section>
  );
}
