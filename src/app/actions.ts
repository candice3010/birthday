"use server";

import { event } from "@/config/event";
import { getSupabase } from "@/lib/supabase";

export type RsvpState = {
  status: "idle" | "success" | "error" | "unavailable";
  message: string;
  fieldErrors?: Partial<Record<"name" | "attending" | "guests" | "message", string>>;
};

export async function submitRsvp(_prev: RsvpState, formData: FormData): Promise<RsvpState> {
  // Champ piège invisible : les robots le remplissent, les humains non.
  if (String(formData.get("website") ?? "").trim() !== "") {
    return { status: "success", message: "Merci, votre réponse a bien été enregistrée !" };
  }

  const name = String(formData.get("name") ?? "").trim();
  const attendingRaw = formData.get("attending");
  const guests = Number(formData.get("guests") ?? 0);
  const message = String(formData.get("message") ?? "").trim();

  const fieldErrors: RsvpState["fieldErrors"] = {};
  if (name.length === 0) fieldErrors.name = "Indiquez votre nom.";
  else if (name.length > 100) fieldErrors.name = "100 caractères maximum.";
  if (attendingRaw !== "yes" && attendingRaw !== "no") {
    fieldErrors.attending = "Dites-nous si vous serez présent·e.";
  }
  if (!Number.isInteger(guests) || guests < 0 || guests > event.maxGuests) {
    fieldErrors.guests = `Entre 0 et ${event.maxGuests} accompagnants.`;
  }
  if (message.length > 1000) fieldErrors.message = "1000 caractères maximum.";

  if (Object.keys(fieldErrors).length > 0) {
    return { status: "error", message: "Merci de corriger les champs indiqués.", fieldErrors };
  }

  const supabase = getSupabase();
  if (!supabase) {
    return {
      status: "unavailable",
      message: `Les réponses en ligne ne sont pas encore activées. ${event.contact.label}.`,
    };
  }

  const attending = attendingRaw === "yes";
  const { error } = await supabase.from("rsvps").insert({
    name,
    attending,
    guests: attending ? guests : 0,
    message: message || null,
  });

  if (error) {
    console.error("[rsvp] insertion Supabase échouée :", error.message);
    return {
      status: "error",
      message: `Oups, l'envoi a échoué. Réessayez dans un instant ou ${event.contact.label.toLowerCase()}.`,
    };
  }

  return {
    status: "success",
    message: attending
      ? `Merci ${name} ! Votre présence est confirmée, on a hâte de vous voir.`
      : `Merci ${name} pour votre réponse, vous allez nous manquer !`,
  };
}
