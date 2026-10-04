import { event } from "@/config/event";

const start = new Date(event.startsAt);

/** « samedi 12 décembre 2026 » */
export const formattedDate = new Intl.DateTimeFormat("fr-FR", {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: event.timeZone,
}).format(start);

/** « 19 h 30 » */
export const formattedTime = new Intl.DateTimeFormat("fr-FR", {
  hour: "2-digit",
  minute: "2-digit",
  timeZone: event.timeZone,
})
  .format(start)
  .replace(":", " h ");

/** « 12.12 » — affiché en 3D. */
export const shortDate = new Intl.DateTimeFormat("fr-FR", {
  day: "2-digit",
  month: "2-digit",
  timeZone: event.timeZone,
})
  .format(start)
  .replace("/", ".");
