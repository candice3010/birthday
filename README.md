# Invitation d'anniversaire 3D

Site d'invitation cinématographique : scène 3D pilotée par le scroll (Next.js, React Three Fiber, drei, postprocessing, GSAP ScrollTrigger, Lenis) et formulaire RSVP enregistré dans Supabase.

## Personnaliser

Toutes les informations sont dans **un seul fichier** : [`src/config/event.ts`](src/config/event.ts)
(prénom, âge, date/heure, lieu, dress code, programme, nombre de bougies, contact de secours…).

## Lancer en local

```bash
npm install
cp .env.example .env.local   # puis renseignez les clés Supabase (facultatif)
npm run dev                  # http://localhost:3000
```

Sans clés Supabase, le site fonctionne : le formulaire affiche un message invitant à vous contacter directement.

## Supabase (RSVP)

1. Créez un projet sur [supabase.com](https://supabase.com).
2. Dans **SQL Editor**, exécutez [`supabase/migrations/20261004000000_create_rsvps.sql`](supabase/migrations/20261004000000_create_rsvps.sql)
   (ou `supabase db push` avec la CLI). La table `rsvps` accepte les insertions publiques mais **interdit toute lecture** via l'API.
3. Dans **Project Settings → API**, copiez l'URL et la clé `anon` publique dans `.env.local` :
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
   ```
4. Les réponses se consultent dans **Table Editor → rsvps** du dashboard.

## Déployer sur Vercel

Importez le dépôt sur [vercel.com/new](https://vercel.com/new), ajoutez les deux variables d'environnement ci-dessus, puis déployez.
Après toute modification des variables, relancez un déploiement (elles sont intégrées au build).

## Structure

| Chemin | Rôle |
| --- | --- |
| `src/config/event.ts` | Toutes les infos personnelles |
| `src/app/page.tsx` | Sections : accueil, date & lieu, programme, RSVP |
| `src/app/actions.ts` | Server Action RSVP (validation + anti-spam) |
| `src/app/calendar.ics/route.ts` | Fichier « Ajouter au calendrier » |
| `src/components/Experience.tsx` | Lenis + GSAP ScrollTrigger → caméra |
| `src/components/three/` | Scène 3D procédurale (ballons, confettis, gâteau, textes 3D, effets) |
| `public/fonts/gentilis_bold.json` | Police 3D (générée par `scripts/subset-font.mjs`) |

## Performance et accessibilité

- Qualité adaptée automatiquement : sur mobile / petites machines, pas de reflets temps réel ni de profondeur de champ, moins de particules, résolution réduite (et ajustée en continu selon les FPS).
- `prefers-reduced-motion` : pas de scroll lissé ni de travellings (coupes franches), particules figées.
- Navigation clavier, lien d'évitement, libellés de formulaire, contraste élevé, textes 3D doublés en HTML pour les lecteurs d'écran.
- Sans WebGL : fond dégradé, tout le contenu reste lisible.
