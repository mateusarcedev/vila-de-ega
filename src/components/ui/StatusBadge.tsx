import type { ResearchStatus } from "@/types/history";
import { statusLabels } from "@/lib/status";
import styles from "./StatusBadge.module.css";

export function StatusBadge({ status }: { status: ResearchStatus }) {
  return <span className={`${styles.badge} ${styles[status]}`}>{statusLabels[status]}</span>;
}
