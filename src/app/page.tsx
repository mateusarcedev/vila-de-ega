import { HomeHero } from "@/components/home/HomeHero";
import { PortalSection } from "@/components/home/PortalSection";
import { RecordsSection } from "@/components/home/RecordsSection";
import { HistoryTimeline } from "@/components/timeline/HistoryTimeline";
import { ExperienceProvider } from "@/components/timeline/ExperienceProvider";

export default function HomePage() {
  return (
    <main id="conteudo">
      <ExperienceProvider>
        <HomeHero />
        <PortalSection />
        <HistoryTimeline />
      </ExperienceProvider>
      <RecordsSection />
    </main>
  );
}
