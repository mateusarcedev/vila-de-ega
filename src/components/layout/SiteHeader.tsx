"use client";

import Link from "next/link";
import { useState } from "react";
import styles from "./SiteHeader.module.css";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  return (
    <header className={styles.header}>
      <Link className={styles.brand} href="/" aria-label="Memórias de Tefé, início" onClick={() => setOpen(false)}>
        <svg className={styles.flag} viewBox="0 0 42 28" role="img" aria-label="Bandeira de Tefé">
          <rect width="42" height="9.34" fill="#008c45" /><rect y="9.33" width="42" height="9.34" fill="#fff" /><rect y="18.66" width="42" height="9.34" fill="#f1e900" />
          <path d="M21 4.8 34.2 24H7.8Z" fill="#092d83" />
          <g fill="#fff"><path d="m21 10.2.7 1.5 1.7.2-1.2 1.1.3 1.7-1.5-.8-1.5.8.3-1.7-1.2-1.1 1.7-.2z"/><path d="m16 15.5.55 1.1 1.2.2-.88.85.2 1.25L16 18.3l-1.1.6.2-1.25-.9-.85 1.25-.2z"/><path d="m25.6 15 .55 1.2 1.35.15-1 .95.24 1.35-1.14-.65-1.18.65.23-1.35-.98-.95 1.35-.15z"/></g>
        </svg>
        <span>Memórias <em>de Tefé</em></span>
      </Link>
      <button type="button" className={styles.menu} aria-expanded={open} aria-controls="site-nav" onClick={() => setOpen((value) => !value)}>
        {open ? "Fechar" : "Menu"}<span aria-hidden="true">{open ? "×" : "☰"}</span>
      </button>
      <nav id="site-nav" className={`${styles.nav} ${open ? styles.open : ""}`} aria-label="Navegação principal">
        <Link href="/#linha-do-tempo" onClick={() => setOpen(false)}>A história</Link>
        <Link href="/#lugares" onClick={() => setOpen(false)}>Lugares</Link>
        <Link href="/#vozes" onClick={() => setOpen(false)}>Vozes</Link>
      </nav>
    </header>
  );
}
