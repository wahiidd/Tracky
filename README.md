# Tracky

Suivi d'habitudes gamifié (XP, niveaux, badges) — app personnelle, React + Vite + Supabase.

## Setup

1. Copier `.env.local.example` vers `.env.local` et renseigner les clés d'un projet Supabase (supabase.com) :
   ```
   VITE_SUPABASE_URL=...
   VITE_SUPABASE_ANON_KEY=...
   ```
2. Exécuter `supabase/migrations/0001_init_schema.sql` puis `supabase/seed.sql` sur ce projet (éditeur SQL Supabase, ou CLI).
3. `npm install`
4. `npm run dev`

## Scripts

- `npm run dev` — serveur de dev
- `npm run build` — build de production (typecheck + bundle PWA)
- `npm test` — tests unitaires (Vitest)
- `npm run lint` — oxlint

## Déploiement

HTTPS requis pour que la PWA soit installable sur l'écran d'accueil iPhone (Vercel recommandé, voir le plan).
