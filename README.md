# Art Bud

Art Bud is a mobile-first artist community app built with Expo, React Native, TypeScript, and Supabase.

The current MVP includes:

- authentication and onboarding
- a Pinterest-style home feed
- joined-community feed filtering
- post detail, likes, comments, and follows
- artist profiles and portfolio grids
- communities hub and community detail feeds
- create-post flow with Supabase Storage uploads

## Stack

- Expo + React Native
- Expo Router
- TypeScript
- Supabase
- Zustand
- TanStack Query
- `expo-image`

## Project Structure

```text
app/                Expo Router screens
components/         UI and feature components
hooks/              data and mutation hooks
lib/                theme, Supabase client, types
stores/             Zustand stores
supabase/           migrations, seed files, scripts
docs/WORKING.md     build progress and testing log
```

## Local Setup

1. Install dependencies:

```bash
npm install
```

2. Create a local env file from `.env.example` and add:

```env
EXPO_PUBLIC_SUPABASE_URL=...
EXPO_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
```

3. Start the app:

```bash
npm start
```

## Useful Commands

```bash
npm run typecheck
npm run seed:demo
npx expo export --platform web
```

## Backend

Supabase SQL migrations live in `supabase/migrations/`.

Demo seed data is created with:

```bash
npm run seed:demo
```

## Build Status

Current implementation and test status are tracked in [docs/WORKING.md](docs/WORKING.md).
