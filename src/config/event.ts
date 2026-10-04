/**
 * ─────────────────────────────────────────────────────────────
 *  CONFIGURATION DE L'ANNIVERSAIRE
 *  C'est le SEUL fichier à modifier pour personnaliser le site.
 * ─────────────────────────────────────────────────────────────
 */

export const event = {
  /** Prénom affiché en 3D sur l'accueil. */
  firstName: "Camille",

  /** Âge fêté (affiché en 3D). */
  age: 30,

  /** Petite phrase d'accroche au-dessus du prénom. */
  tagline: "Vous êtes invité·e à célébrer",

  /** Date et heure de début au format ISO, avec le fuseau horaire. */
  startsAt: "2026-12-12T19:30:00+01:00",

  /** Heure de fin (pour l'ajout au calendrier). */
  endsAt: "2026-12-13T03:00:00+01:00",

  /** Fuseau horaire utilisé pour l'affichage. */
  timeZone: "Europe/Paris",

  /** Date limite de réponse (texte libre). */
  rsvpDeadline: "le 28 novembre",

  venue: {
    name: "La Maison des Lumières",
    address: "12 rue des Étoiles",
    city: "75003 Paris",
    /** Indications pratiques (accès, parking, code…). */
    details: "Métro Arts et Métiers (lignes 3 et 11). Sonnez à « Lumières », 2ᵉ étage.",
    /** Lien vers la carte (Google Maps, Apple Plans…). */
    mapUrl: "https://www.google.com/maps/search/?api=1&query=12+rue+des+Etoiles+75003+Paris",
  },

  /** Code vestimentaire (laisser vide "" pour le masquer). */
  dressCode: "Chic & paillettes — une touche dorée est bienvenue",

  /** Programme de la soirée, dans l'ordre. */
  schedule: [
    { time: "19:30", title: "Accueil & cocktails", description: "Bulles, mocktails et premières retrouvailles." },
    { time: "20:30", title: "Dîner", description: "Buffet de saison et petites douceurs salées." },
    { time: "22:00", title: "Le gâteau", description: "Bougies, vœux et quelques mots doux." },
    { time: "22:30", title: "On danse", description: "DJ set jusqu'au bout de la nuit." },
    { time: "02:00", title: "Dernier verre", description: "Douceurs de fin de soirée avant le retour." },
  ],

  /** Nombre maximum d'accompagnants proposé dans le formulaire. */
  maxGuests: 4,

  /** Contact affiché si le formulaire en ligne n'est pas disponible. */
  contact: {
    label: "Écrivez-moi par SMS au 06 00 00 00 00",
  },

  /** Nombre de bougies sur le gâteau 3D (limité à 12 pour la lisibilité). */
  candles: 7,
} as const;

export type EventConfig = typeof event;
