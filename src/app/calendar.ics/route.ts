import { event } from "@/config/event";

const toIcsDate = (iso: string) =>
  new Date(iso).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");

const escape = (text: string) => text.replace(/([,;\\])/g, "\\$1").replace(/\n/g, "\\n");

export function GET() {
  const location = `${event.venue.name}, ${event.venue.address}, ${event.venue.city}`;
  const body = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//anniversaire//FR",
    "CALSCALE:GREGORIAN",
    "BEGIN:VEVENT",
    `UID:anniversaire-${toIcsDate(event.startsAt)}@invitation`,
    `DTSTAMP:${toIcsDate(event.startsAt)}`,
    `DTSTART:${toIcsDate(event.startsAt)}`,
    `DTEND:${toIcsDate(event.endsAt)}`,
    `SUMMARY:${escape(`Anniversaire de ${event.firstName} — ${event.age} ans`)}`,
    `LOCATION:${escape(location)}`,
    `DESCRIPTION:${escape(event.dressCode ? `Dress code : ${event.dressCode}` : "")}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");

  return new Response(body, {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": 'attachment; filename="anniversaire.ics"',
    },
  });
}
