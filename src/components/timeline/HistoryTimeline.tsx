import { events } from "@/content/events";
import { scenesByEvent } from "@/content/scenes";
import { HistoryChapter } from "./HistoryChapter";
import { TimelineRuntime } from "./TimelineRuntime";
import { SpatialTimelineExperience } from "./SpatialTimelineExperience";
import styles from "./HistoryTimeline.module.css";

export function HistoryTimeline() {
  return (
    <section className={styles.shell} aria-label="Linha do tempo histórica">
      <SpatialTimelineExperience events={events} />
      <TimelineRuntime>
        <div className={styles.chapters}>
          {events.map((event) => <HistoryChapter key={event.id} event={event} scene={scenesByEvent[event.id]} />)}
        </div>
      </TimelineRuntime>
    </section>
  );
}
