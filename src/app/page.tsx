import { Countdown } from "@/components/Countdown";
import { Experience } from "@/components/Experience";
import { RsvpForm } from "@/components/RsvpForm";
import { event } from "@/config/event";
import { formattedDate, formattedTime } from "@/lib/format";
import { isSupabaseConfigured } from "@/lib/supabase";

const nav = [
  { href: "#infos", label: "Infos" },
  { href: "#programme", label: "Programme" },
];

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-3 flex items-center gap-3 text-xs font-medium uppercase tracking-[0.32em] text-gold">
      <span aria-hidden="true" className="h-px w-8 bg-gold/60" />
      {children}
    </p>
  );
}

function Icon({ path }: { path: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="mt-0.5 h-5 w-5 shrink-0 text-gold" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path strokeLinecap="round" strokeLinejoin="round" d={path} />
    </svg>
  );
}

const icons = {
  calendar:
    "M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5",
  clock: "M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z",
  pin: "M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z",
  sparkles:
    "M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z",
};

const secondaryButton =
  "inline-flex min-h-11 cursor-pointer items-center justify-center rounded-full border border-champagne/30 px-5 py-2 text-sm font-medium text-champagne transition-colors duration-200 hover:border-gold hover:bg-gold/10";

export default function Home() {
  return (
    <Experience>
      <a
        href="#rsvp"
        className="sr-only z-50 rounded-full bg-gold px-4 py-2 font-medium text-night focus:not-sr-only focus:fixed focus:top-4 focus:left-4"
      >
        Aller directement au formulaire de réponse
      </a>

      <header className="fixed inset-x-4 top-4 z-40 mx-auto flex max-w-6xl items-center justify-between gap-4 rounded-full glass px-4 py-2 sm:px-6">
        <a href="#accueil" className="font-display text-xl tracking-wide text-champagne" aria-label="Retour à l'accueil">
          {event.firstName.charAt(0)}
          <span className="text-gold"> · </span>
          {event.age}
        </a>
        <nav aria-label="Navigation principale">
          <ul className="flex items-center gap-1 sm:gap-2">
            {nav.map((item) => (
              <li key={item.href} className="hidden sm:block">
                <a
                  href={item.href}
                  className="inline-flex min-h-11 items-center rounded-full px-4 text-sm text-muted transition-colors duration-200 hover:text-champagne"
                >
                  {item.label}
                </a>
              </li>
            ))}
            <li>
              <a
                href="#rsvp"
                className="inline-flex min-h-11 items-center rounded-full bg-gold px-5 text-sm font-semibold text-night transition-[filter] duration-200 hover:brightness-110"
              >
                Répondre
              </a>
            </li>
          </ul>
        </nav>
      </header>

      <main>
        {/* 1 — Accueil */}
        <section
          id="accueil"
          data-station
          aria-labelledby="titre-accueil"
          className="relative flex min-h-svh flex-col items-center justify-end px-4 pb-14 text-center"
        >
          <h1 id="titre-accueil" className="sr-only">
            {event.firstName} fête ses {event.age} ans
          </h1>
          <p className="font-display text-2xl italic text-champagne sm:text-3xl">{event.tagline}</p>
          <p className="mt-2 text-sm uppercase tracking-[0.3em] text-muted">
            <span className="whitespace-nowrap">{formattedDate}</span>
            <span aria-hidden="true"> · </span>
            <span className="whitespace-nowrap">{formattedTime}</span>
          </p>
          <a href="#infos" className="mt-10 flex flex-col items-center gap-3 text-xs uppercase tracking-[0.3em] text-muted">
            Faites défiler
            <span aria-hidden="true" className="scroll-cue relative block h-12 w-px overflow-hidden bg-champagne/15" />
          </a>
        </section>

        {/* 2 — Date & lieu */}
        <section
          id="infos"
          data-station
          aria-labelledby="titre-infos"
          className="flex min-h-[150svh] items-center px-4 py-24 sm:px-8"
        >
          <div data-reveal className="glass mx-auto w-full max-w-md rounded-3xl p-6 sm:p-8 md:mr-[6vw] lg:mr-[10vw]">
            <Eyebrow>Rendez-vous</Eyebrow>
            <h2 id="titre-infos" className="font-display text-4xl leading-tight text-gilded sm:text-5xl">
              Date &amp; lieu
            </h2>

            <dl className="mt-6 space-y-4 text-base leading-relaxed">
              <div className="flex gap-3">
                <Icon path={icons.calendar} />
                <div>
                  <dt className="sr-only">Date</dt>
                  <dd className="capitalize">{formattedDate}</dd>
                </div>
              </div>
              <div className="flex gap-3">
                <Icon path={icons.clock} />
                <div>
                  <dt className="sr-only">Heure</dt>
                  <dd>À partir de {formattedTime}</dd>
                </div>
              </div>
              <div className="flex gap-3">
                <Icon path={icons.pin} />
                <div>
                  <dt className="sr-only">Lieu</dt>
                  <dd>
                    <span className="block font-medium text-champagne">{event.venue.name}</span>
                    <span className="block">{event.venue.address}</span>
                    <span className="block">{event.venue.city}</span>
                    <span className="mt-1 block text-sm text-muted">{event.venue.details}</span>
                  </dd>
                </div>
              </div>
              {event.dressCode && (
                <div className="flex gap-3">
                  <Icon path={icons.sparkles} />
                  <div>
                    <dt className="sr-only">Dress code</dt>
                    <dd>{event.dressCode}</dd>
                  </div>
                </div>
              )}
            </dl>

            <div className="mt-6">
              <Countdown />
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <a href={event.venue.mapUrl} target="_blank" rel="noopener noreferrer" className={secondaryButton}>
                Itinéraire<span className="sr-only"> (nouvel onglet)</span>
              </a>
              <a href="/calendar.ics" download className={secondaryButton}>
                Ajouter au calendrier
              </a>
            </div>
          </div>
        </section>

        {/* 3 — Programme */}
        <section
          id="programme"
          data-station
          aria-labelledby="titre-programme"
          className="flex min-h-[150svh] items-center px-4 py-24 sm:px-8"
        >
          <div data-reveal className="glass mx-auto w-full max-w-md rounded-3xl p-6 sm:p-8 md:mr-[6vw] lg:mr-[10vw]">
            <Eyebrow>La soirée</Eyebrow>
            <h2 id="titre-programme" className="font-display text-4xl leading-tight text-gilded sm:text-5xl">
              Programme
            </h2>
            <ol className="relative mt-8 space-y-6 border-l border-gold/30 pl-6">
              {event.schedule.map((item) => (
                <li key={item.time + item.title} className="relative">
                  <span aria-hidden="true" className="absolute top-1.5 -left-[29px] h-2.5 w-2.5 rounded-full bg-gold shadow-[0_0_12px_rgba(233,194,122,0.9)]" />
                  <p className="font-display text-xl text-gold tabular-nums">
                    <time>{item.time}</time>
                  </p>
                  <h3 className="text-lg font-medium text-ink">{item.title}</h3>
                  <p className="text-sm leading-relaxed text-muted">{item.description}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* 4 — RSVP */}
        <section
          id="rsvp"
          data-station
          aria-labelledby="titre-rsvp"
          className="flex min-h-[150svh] items-end px-4 pt-24 pb-16 sm:px-8"
        >
          <div data-reveal className="glass mx-auto w-full max-w-xl rounded-3xl p-6 sm:p-10">
            <Eyebrow>Répondez s&apos;il vous plaît</Eyebrow>
            <h2 id="titre-rsvp" className="font-display text-4xl leading-tight text-gilded sm:text-5xl">
              Serez-vous là ?
            </h2>
            <p className="mt-3 mb-8 text-base leading-relaxed text-muted">
              Merci de répondre avant {event.rsvpDeadline} pour que la fête soit parfaite.
            </p>
            <RsvpForm enabled={isSupabaseConfigured} />
          </div>
        </section>
      </main>

      <footer className="relative px-4 pb-10 text-center text-sm text-muted">
        Avec amour — {event.firstName}, {event.age} ans
      </footer>
    </Experience>
  );
}
