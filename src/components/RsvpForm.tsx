"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { type RsvpState, submitRsvp } from "@/app/actions";
import { event } from "@/config/event";

const initialState: RsvpState = { status: "idle", message: "" };

const inputClass =
  "w-full rounded-xl border border-champagne/20 bg-night/60 px-4 py-3 text-base text-ink placeholder:text-muted/60 transition-colors duration-200 hover:border-champagne/40 focus:border-gold focus:outline-none aria-[invalid=true]:border-danger";

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} className="mt-2 text-sm text-danger">
      {message}
    </p>
  );
}

export function RsvpForm({ enabled }: { enabled: boolean }) {
  const [state, formAction, pending] = useActionState(submitRsvp, initialState);
  const [name, setName] = useState("");
  const [attending, setAttending] = useState<"yes" | "no" | null>(null);
  const [guests, setGuests] = useState("0");
  const [message, setMessage] = useState("");
  const statusRef = useRef<HTMLDivElement>(null);
  const errors = state.fieldErrors ?? {};

  useEffect(() => {
    if (state.status !== "idle") statusRef.current?.focus();
  }, [state]);

  if (state.status === "success") {
    return (
      <div
        ref={statusRef}
        tabIndex={-1}
        role="status"
        className="rounded-2xl border border-gold/30 bg-gold/10 p-6 text-center"
      >
        <svg aria-hidden="true" viewBox="0 0 24 24" className="mx-auto mb-3 h-10 w-10 text-gold" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        </svg>
        <p className="font-display text-2xl text-champagne">{state.message}</p>
      </div>
    );
  }

  return (
    <form action={formAction} noValidate className="space-y-6">
      {!enabled && (
        <div role="note" className="rounded-xl border border-rose/30 bg-rose/10 p-4 text-sm leading-relaxed text-ink">
          Le formulaire en ligne n&apos;est pas encore activé. {event.contact.label}.
        </div>
      )}

      {/* Champ piège anti-spam, invisible pour les humains. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor="website">Ne pas remplir</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div>
        <label htmlFor="name" className="mb-2 block text-sm font-medium text-champagne">
          Votre nom <span aria-hidden="true">*</span>
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          maxLength={100}
          autoComplete="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Prénom et nom"
          className={inputClass}
          aria-invalid={Boolean(errors.name)}
          aria-describedby={errors.name ? "name-error" : undefined}
        />
        <FieldError id="name-error" message={errors.name} />
      </div>

      <fieldset aria-describedby={errors.attending ? "attending-error" : undefined}>
        <legend className="mb-2 block text-sm font-medium text-champagne">
          Serez-vous des nôtres ? <span aria-hidden="true">*</span>
        </legend>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {(
            [
              ["yes", "Oui, avec joie"],
              ["no", "Je ne pourrai pas"],
            ] as const
          ).map(([value, label]) => (
            <label
              key={value}
              className="flex min-h-12 cursor-pointer items-center gap-3 rounded-xl border border-champagne/20 bg-night/60 px-4 py-3 transition-colors duration-200 hover:border-champagne/40 has-[:checked]:border-gold has-[:checked]:bg-gold/10 has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-gold-strong"
            >
              <input
                type="radio"
                name="attending"
                value={value}
                required
                checked={attending === value}
                className="h-4 w-4 accent-[#e9c27a] focus-visible:outline-none"
                onChange={() => setAttending(value)}
              />
              <span>{label}</span>
            </label>
          ))}
        </div>
        <FieldError id="attending-error" message={errors.attending} />
      </fieldset>

      <div>
        <label htmlFor="guests" className="mb-2 block text-sm font-medium text-champagne">
          Nombre d&apos;accompagnants
        </label>
        <select
          id="guests"
          name="guests"
          value={guests}
          onChange={(e) => setGuests(e.target.value)}
          disabled={attending === "no"}
          className={`${inputClass} cursor-pointer disabled:cursor-not-allowed disabled:opacity-50`}
          aria-invalid={Boolean(errors.guests)}
          aria-describedby={errors.guests ? "guests-error" : "guests-hint"}
        >
          {Array.from({ length: event.maxGuests + 1 }, (_, n) => (
            <option key={n} value={n}>
              {n === 0 ? "Je viens seul·e" : `+ ${n}`}
            </option>
          ))}
        </select>
        <p id="guests-hint" className="mt-2 text-sm text-muted">
          Sans vous compter. Jusqu&apos;à {event.maxGuests} personnes.
        </p>
        <FieldError id="guests-error" message={errors.guests} />
      </div>

      <div>
        <label htmlFor="message" className="mb-2 block text-sm font-medium text-champagne">
          Un petit mot <span className="font-normal text-muted">(facultatif)</span>
        </label>
        <textarea
          id="message"
          name="message"
          rows={3}
          maxLength={1000}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Allergies, chanson préférée, mot doux…"
          className={`${inputClass} resize-y`}
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? "message-error" : undefined}
        />
        <FieldError id="message-error" message={errors.message} />
      </div>

      <div ref={statusRef} tabIndex={-1} aria-live="polite" className="focus:outline-none">
        {state.message && (
          <p className={`text-sm ${state.status === "error" ? "text-danger" : "text-rose"}`}>{state.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={pending || !enabled}
        className="inline-flex min-h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#f2d08f] via-gold to-[#d99a8c] px-8 py-3 font-semibold tracking-wide text-night shadow-[0_10px_40px_-10px_rgba(233,194,122,0.6)] transition-[filter,box-shadow] duration-200 hover:brightness-110 hover:shadow-[0_14px_50px_-10px_rgba(233,194,122,0.8)] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending && (
          <svg aria-hidden="true" className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeOpacity="0.25" strokeWidth="3" />
            <path d="M22 12a10 10 0 0 0-10-10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
          </svg>
        )}
        {pending ? "Envoi en cours…" : "Envoyer ma réponse"}
      </button>
    </form>
  );
}
