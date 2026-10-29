import Link from "next/link";
import { StatusBadge } from "@/components/ui/StatusBadge";
import type { ResearchStatus } from "@/types/history";
import styles from "./RecordCard.module.css";

interface RecordCardProps {
  kind: string;
  href: string;
  title: string;
  detail: string;
  status: ResearchStatus;
  eyebrow?: string;
}

export function RecordCard({ kind, href, title, detail, status, eyebrow }: RecordCardProps) {
  return (
    <article className={styles.card}>
      <div className={styles.top}><span>{kind}</span><StatusBadge status={status} /></div>
      {eyebrow && <p className={styles.eyebrow}>{eyebrow}</p>}
      <h3><Link href={href}>{title}</Link></h3>
      <p className={styles.detail}>{detail}</p>
      <Link className={styles.link} href={href}>Abrir ficha <span aria-hidden="true">↗</span></Link>
    </article>
  );
}
