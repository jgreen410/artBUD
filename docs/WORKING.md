# Art Bud Working Document

Updated: 2026-03-30
Owner: solo build in progress

## Rule For Every Major Step

Each major step is only considered closed when all four are done:

1. The feature is implemented.
2. End-to-end verification is run on a simulator or device against the current Supabase project.
3. The test result is logged in this document with pass, fail, or blocker details.
4. The next step is approved before work continues.

Until an automated E2E harness exists, "end-to-end" means a full manual smoke test through the real app flow in Expo, not just typechecking.

## Current Reality

- Steps 1 through 7 are implemented.
- Step 8 is implemented in code and passed backend-backed smoke validation.
- Step 9 is implemented in code and passed backend-backed smoke validation.
- Step 10 is implemented in code and passed backend-backed smoke validation.
- Step 11 is implemented in code and passed backend-backed smoke validation.
- Step 12 is implemented in code and passed backend-backed smoke validation.
- Step 13 is implemented in code and passed backend-backed smoke validation.
- Step 14 is implemented in code and passed backend-backed smoke validation.
- Static validation has been run after each completed step.
- True end-to-end runtime verification has not yet been completed for steps 1 through 7.
- This document is now the source of truth for build status, blockers, and test evidence.

## Repository Setup

- 2026-03-30: local Git repository initialized on `main`
- repository metadata added: `README.md`, `.gitattributes`, and updated `.gitignore`
- sensitive local files remain ignored, including `.env` and `supabase/.temp/`
- project files are staged for the first commit
- first commit and GitHub remote push are still pending because this machine has no Git author identity configured and no direct GitHub repo-creation tooling installed

## Completed Work

### Step 1: Expo + TypeScript + Router Scaffold

Status: complete

Delivered:
- Expo managed app scaffold
- Expo Router entry and root layout wiring
- Strict TypeScript config
- Core dependency install for Supabase, Zustand, TanStack Query, Expo Image, fonts, haptics, and FlashList

Validation run:
- `npm run typecheck` -> pass
- `npx expo install --check` -> pass

E2E status:
- Not yet run

### Step 2: Theme System + Font Direction

Status: complete

Delivered:
- `lib/theme.ts` design token system
- Local font selection from `fonts/` archives
- Font loading and preview wiring
- Chosen font roles for brand, display, editorial accent, and body copy

Validation run:
- `npm run typecheck` -> pass
- `npx expo install --check` -> pass

E2E status:
- Not yet run

### Step 3: Supabase Client Setup

Status: complete

Delivered:
- `lib/supabase.ts` client configuration
- secure native session persistence
- auth refresh binding to app lifecycle
- `.env.example` configuration template

Validation run:
- `npm run typecheck` -> pass
- `npx expo install --check` -> pass

E2E status:
- Not yet run

### Step 4: Database Migration + Seed Path

Status: complete

Delivered:
- full schema migration in `supabase/migrations/20260329230000_art_bud_core.sql`
- RLS, triggers, indexes, storage buckets, and community seed data
- server-side demo data seeding script for users, posts, follows, likes, comments

Validation run:
- `npm run typecheck` -> pass
- `node --check supabase/scripts/seed-demo-data.mjs` -> pass

E2E status:
- Not yet run

### Step 5: Reusable UI Components

Status: complete

Delivered:
- `Button`, `Card`, `Tag`, `Avatar`, `Input`, `Badge`
- themed preview wiring

Validation run:
- `npm run typecheck` -> pass
- `npx expo install --check` -> pass

E2E status:
- Not yet run

### Step 6: Auth Flow

Status: complete

Delivered:
- welcome, login, signup, onboarding route structure
- auth bootstrap and protected routing
- email/password, Google OAuth, Apple sign-in, phone OTP flow wiring
- persistent auth state via store and Supabase session handling

Validation run:
- `npm run typecheck` -> pass
- `npx expo install --check` -> pass

E2E status:
- Not yet run

Notes:
- Google, Apple, and phone auth still require dashboard-side provider setup and native config verification.

### Step 7: Home Feed

Status: complete

Delivered:
- Pinterest-style 2-column masonry feed
- community filter chips
- pull-to-refresh and infinite pagination wiring
- post card tap-through to placeholder post detail route

Validation run:
- `npm run typecheck` -> pass
- `npx expo install --check` -> pass

E2E status:
- Not yet run

## Remaining Build Steps

### Step 8: Post Detail

Status: implemented, backend smoke passed, device UI E2E pending

Delivered:
- full post detail screen with swipeable artwork gallery
- artist row with follow and route-through to artist profile
- optimistic like toggle
- comments list and bottom composer
- pull-to-refresh on the detail screen
- placeholder artist route added so author taps are not dead links yet
- post/feed cache normalization tightened to safely handle Supabase relation shapes

Validation run:
- `npm run typecheck` -> pass
- `npx expo install --check` -> pass
- `npx expo export --platform web` -> pass
- `npx supabase db push -p ... --yes` -> pass
- `npm run seed:demo` -> pass
- authenticated Step 8 smoke script against live Supabase -> pass

E2E status:
- Backend-backed smoke passed
- Manual device or simulator UI pass still pending

Notes:
- The first live rerun exposed a real schema bug: counter trigger functions were not `security definer`, so RLS prevented `likes_count` and `comments_count` updates.
- That defect was fixed in `supabase/migrations/20260330052000_fix_counter_trigger_security.sql` and pushed successfully before the final rerun.
- The backend smoke covered sign-in, post detail read, comments read, like on and off, follow on and off, comment create and cleanup, and sign-out.

### Step 9: Create Post

Status: implemented, backend smoke passed, device UI E2E pending

Delivered:
- full create-post screen with gallery and camera entry points
- image preview strip with removal controls
- title and description inputs
- joined-community-only selector
- medium and subject multi-select tags
- Supabase storage upload helper for post images
- post creation mutation with route-through to the new post detail screen

Validation run:
- `npm run typecheck` -> pass
- `npx expo install --check` -> pass
- `npx expo export --platform web` -> pass
- authenticated Step 9 smoke script against live Supabase -> pass

E2E status:
- Backend-backed smoke passed
- Manual device or simulator UI pass still pending

Notes:
- The backend smoke covered sign-in, joined-community lookup, storage upload to `post-images`, post insert, read-back of the new post with author and community relations, feed visibility check, and cleanup of the temporary post and storage object.
- The literal in-app image picker and camera path still need a manual device or simulator pass.

### Step 10: Artist Profile

Status: implemented, backend smoke passed, device UI E2E pending

Delivered:
- real artist profile screen on `app/artist/[id].tsx`
- real own-profile tab on `app/(tabs)/profile.tsx`
- reusable profile header, social links row, and portfolio grid components
- profile data, stats, and portfolio hooks
- follower-count invalidation after follow or unfollow

Validation run:
- `npm run typecheck` -> pass
- `npx expo install --check` -> pass
- `npx expo export --platform web` -> pass
- authenticated Step 10 smoke script against live Supabase -> pass

E2E status:
- Backend-backed smoke passed
- Manual device or simulator UI pass still pending

Notes:
- The backend smoke covered own-profile read, artist-profile read, portfolio query, follower-count changes across follow and unfollow, and stats queries.
- The literal in-app tap-through from post detail to artist profile and from the profile tab still needs a manual device or simulator pass.

### Step 11: Communities Hub

Status: implemented, backend smoke passed, device UI E2E pending

Delivered:
- live communities hub in `app/(tabs)/communities.tsx`
- launched versus coming-soon sections
- search filtering across name, slug, and description
- join or joined toggle with optimistic cache updates
- reusable `CommunityCard` and `CommunityGrid` components
- temporary `app/community/[id].tsx` route so community card taps are already wired

Validation run:
- `npm run typecheck` -> pass
- `npx expo install --check` -> pass
- `npx expo export --platform web` -> pass
- authenticated Step 11 smoke script against live Supabase -> pass

E2E status:
- Backend-backed smoke passed
- Manual device or simulator UI pass still pending

Notes:
- The backend smoke covered all-community reads, launched versus future counts, joined-community lookup, leave and rejoin cycle, and `member_count` trigger verification.
- The literal in-app search interaction, join button tap path, and card navigation still need a manual device or simulator pass.
- Community detail is still a placeholder route until Step 12 replaces it with the filtered feed.

### Step 12: Community Detail

Status: implemented, backend smoke passed, device UI E2E pending

Delivered:
- live community detail screen in `app/community/[id].tsx`
- real community hero header with cover image, badges, description, and join toggle
- filtered masonry feed using the existing post query path
- pull-to-refresh and infinite loading in the community-specific feed
- card route-through to post detail
- focused `useCommunity` query for direct community reads

Validation run:
- `npm run typecheck` -> pass
- `npx expo install --check` -> pass
- `npx expo export --platform web` -> pass
- authenticated Step 12 smoke script against live Supabase -> pass

E2E status:
- Backend-backed smoke passed
- Manual device or simulator UI pass still pending

Notes:
- The backend smoke covered community read, filtered post feed read, membership leave or rejoin counter updates from the detail route context, and post-card routing data read-back.
- The literal in-app back navigation, join button tap path, and masonry post browsing still need a manual device or simulator pass.

### Step 13: Community Feed Tab

Status: implemented, backend smoke passed, device UI E2E pending

Delivered:
- live joined-communities feed tab in `app/(tabs)/my-feed.tsx`
- joined-community filter chips with `All Joined` mode and single-community mode
- empty state that routes to the communities hub when the user has not joined anything
- joined-feed-specific store state for selected chip and scroll offset
- multi-community posts query path for the joined feed

Validation run:
- `npm run typecheck` -> pass
- `npx expo install --check` -> pass
- `npx expo export --platform web` -> pass
- authenticated Step 13 smoke script against live Supabase -> pass

E2E status:
- Backend-backed smoke passed
- Manual device or simulator UI pass still pending

Notes:
- The backend smoke covered joined-community lookup, all-joined feed reads, selected joined-community feed reads, and feed-card relation data for author and community previews.
- The literal in-app chip switching, empty-state button path, and masonry browsing still need a manual device or simulator pass.

### Step 14: Polish

Status: implemented, backend smoke passed, device UI E2E pending

Delivered:
- shared warm-error translation in `utils/errors.ts` so user-facing surfaces avoid raw backend jargon
- masonry skeleton loading states for feed-based screens
- post-detail skeletons plus comment-thread skeletons
- profile skeleton states for own-profile and artist-profile screens
- communities-hub skeleton state and keyboard dismissal handling for the search surface
- keyboard dismissal cleanup on post detail and create-post
- success haptic feedback on comment submission
- retry actions added on profile error states

Validation run:
- `npm run typecheck` -> pass
- `npx expo install --check` -> pass
- `npx expo export --platform web` -> pass
- authenticated Supabase smoke test for polished feed, profile, community, and comment flows -> pass

E2E status:
- Backend-backed smoke passed
- Manual device or simulator UI pass still pending

Notes:
- The backend smoke covered demo-user sign-in, feed read, post-detail read, profile read, community read, comment create and cleanup, and membership toggle with restoration to the original state.
- This step mostly changed presentation and interaction quality, so the remaining risk is primarily visual or UX behavior that still needs a literal in-app simulator or device pass.

## Current Blockers And Prerequisites

- Core migration is now applied to the live project.
- Demo content is now seeded in the live project.
- A manual simulator or device UI smoke pass is still needed if each step must be closed with literal in-app interaction rather than backend-backed scripted validation.
- The service-role key should be rotated because it was shared outside local secret storage.
- No automated E2E harness exists yet. Manual smoke testing is required until one is added.

## E2E Definition For This Project

For each upcoming step, E2E verification should cover the real user path touched by the feature. At minimum:

1. Start the app in Expo and open it on a simulator or device.
2. Exercise the affected flow from navigation entry to successful completion.
3. Verify data reads and writes against Supabase where applicable.
4. Verify loading, empty, and error states when the feature includes them.
5. Record the exact result in this document before moving on.

## Test Log

### 2026-03-30

Scope:
- Steps 1 through 7

Executed:
- `npm run typecheck`
- `npx expo install --check`
- `node --check supabase/scripts/seed-demo-data.mjs`

Result:
- Static validation passed
- End-to-end validation not yet completed

### 2026-03-30

Scope:
- Step 8

Executed:
- `npm run typecheck`
- `npx expo install --check`
- `npx expo export --platform web`
- direct Supabase smoke query for `public.posts`
- `npx supabase init --yes`
- `npx supabase link --project-ref ... -p ... --yes`
- `npx supabase db push -p ... --yes`
- `npm run seed:demo`
- authenticated Supabase smoke test for post detail interactions
- follow-up `npx supabase db push -p ... --yes` after trigger fix migration

Result:
- Implementation and runtime bundling passed
- Live backend migration and demo seed passed
- First authenticated smoke run exposed a trigger and RLS defect on counter updates
- Trigger security patch was added and pushed
- Final authenticated smoke run passed for sign-in, post detail read, comments read, like on and off, follow on and off, comment create and cleanup, and sign-out
- Manual in-app simulator or device tap-through is still pending because it has not been automated from this terminal

### 2026-03-30

Scope:
- Step 9

Executed:
- `npm run typecheck`
- `npx expo install --check`
- `npx expo export --platform web`
- authenticated Supabase smoke test for create-post interactions

Result:
- Implementation and runtime bundling passed
- Authenticated backend smoke passed for joined-community lookup, storage upload, post insert, read-back, feed visibility, and cleanup
- Manual in-app simulator or device tap-through is still pending because it has not been automated from this terminal

### 2026-03-30

Scope:
- Step 10

Executed:
- `npm run typecheck`
- `npx expo install --check`
- `npx expo export --platform web`
- authenticated Supabase smoke test for profile interactions

Result:
- Implementation and runtime bundling passed
- Authenticated backend smoke passed for own-profile read, artist-profile read, portfolio reads, and follow or unfollow stats changes
- Manual in-app simulator or device tap-through is still pending because it has not been automated from this terminal

### 2026-03-30

Scope:
- Step 11

Executed:
- `npm run typecheck`
- `npx expo install --check`
- `npx expo export --platform web`
- authenticated Supabase smoke test for community hub interactions

Result:
- Implementation and runtime bundling passed
- Authenticated backend smoke passed for all-community reads, launched and future segmentation, joined-community lookup, and membership leave or rejoin counter updates
- Manual in-app simulator or device tap-through is still pending because it has not been automated from this terminal

### 2026-03-30

Scope:
- Step 12

Executed:
- `npm run typecheck`
- `npx expo install --check`
- `npx expo export --platform web`
- authenticated Supabase smoke test for community detail interactions

Result:
- Implementation and runtime bundling passed
- Authenticated backend smoke passed for community read, filtered feed reads, membership leave or rejoin cycle, and post-card routing data
- Manual in-app simulator or device tap-through is still pending because it has not been automated from this terminal

### 2026-03-30

Scope:
- Step 13

Executed:
- `npm run typecheck`
- `npx expo install --check`
- `npx expo export --platform web`
- authenticated Supabase smoke test for joined-feed interactions

Result:
- Implementation and runtime bundling passed
- Authenticated backend smoke passed for joined-community lookup, all-joined feed reads, selected-community feed reads, and feed-card relation data
- Manual in-app simulator or device tap-through is still pending because it has not been automated from this terminal

### 2026-03-30

Scope:
- Step 14

Executed:
- `npm run typecheck`
- `npx expo install --check`
- `npx expo export --platform web`
- authenticated Supabase smoke test for polished feed, profile, community, membership, and comment interactions

Result:
- Implementation and runtime bundling passed
- Authenticated backend smoke passed for demo-user sign-in, feed reads, community reads, profile reads, comment create and cleanup, and membership toggle or restore
- Manual in-app simulator or device tap-through is still pending because it has not been automated from this terminal

## Next Required Actions

1. Run a manual simulator or device tap-through for Step 8 and log the result here.
2. Run a manual simulator or device tap-through for Step 9 and log the result here.
3. Run a manual simulator or device tap-through for Step 10 and log the result here.
4. Run a manual simulator or device tap-through for Step 11 and log the result here.
5. Run a manual simulator or device tap-through for Step 12 and log the result here.
6. Run a manual simulator or device tap-through for Step 13 and log the result here.
7. Run a manual simulator or device tap-through for Step 14 and log the result here.
8. Rotate the service-role key, Supabase access token, and database password because they were shared outside local secret storage.
9. Configure `git user.name` and `git user.email`, then create or link the GitHub remote and push `main`.
