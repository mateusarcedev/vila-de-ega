"use client";

import Link from "next/link";
import { useExperience } from "./ExperienceProvider";

export function ReturnToTimelineLink() {
  const { returnToTimeline } = useExperience();
  return <Link href="#linha-do-tempo" onClick={(event) => { event.preventDefault(); returnToTimeline(); }}>Voltar à cronologia 3D ↑</Link>;
}
