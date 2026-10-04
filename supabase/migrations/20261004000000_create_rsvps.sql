-- Table des réponses des invités (RSVP)
create table if not exists public.rsvps (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  name        text not null check (char_length(btrim(name)) between 1 and 100),
  attending   boolean not null,
  guests      smallint not null default 0 check (guests between 0 and 10),
  message     text check (message is null or char_length(message) <= 1000)
);

comment on table public.rsvps is 'Réponses au formulaire RSVP du site d''anniversaire.';

-- Row Level Security : insertion publique autorisée, lecture interdite.
alter table public.rsvps enable row level security;

-- Seule l'insertion est accordée aux rôles publics (aucun SELECT / UPDATE / DELETE).
revoke all on table public.rsvps from anon, authenticated;
grant insert on table public.rsvps to anon, authenticated;

drop policy if exists "Insertion publique des RSVP" on public.rsvps;
create policy "Insertion publique des RSVP"
  on public.rsvps
  for insert
  to anon, authenticated
  with check (true);

-- Aucune policy SELECT : personne ne peut lire les réponses via l'API publique.
-- Pour les consulter : Table Editor du dashboard Supabase (rôle service / postgres).
