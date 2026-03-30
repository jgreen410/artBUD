# Art Bud Working Document

Updated: 2026-03-30
Owner: solo build in progress

## Rule For Every Major Step

Each major step is only considered closed when all four are done:

1. The feature is implemented.
2. End-to-end verification is run on a simulator or device against the current Supabase project.
3. The test result is logged in this document with pass, fail, or blocker details.
4. The next step is approved before work continues.

Static verification for regressions now includes `npm run test` in addition to `npm run typecheck`.

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
- The feed, community, tab-bar, and keyboard-input refinement pass is implemented in code and passed static validation.
- The login-screen video hero and auth-entry redesign is implemented in code and passed static validation.
- The login-screen hero now uses the four local clips in `assets/videos`, and the `artBUD` wordmark is animated as a handwritten reveal.
- The signed-out landing route `app/(auth)/welcome.tsx` now matches the new auth visual system instead of showing the older static panel.
- The auth hero now crossfades between local videos instead of hot-swapping a single player, and the brand wordmark has been rebuilt as `ART` + `bud`.
- The social auth flow now uses PKCE code exchange for Google and passes nonce plus authorization code for Apple native sign-in.
- Google and Apple entry buttons now intentionally show a `Coming Soon` popup on the auth screens instead of launching incomplete mobile OAuth flows.
- Phone auth is currently blocked by backend configuration: the live Supabase project returns `phone_provider_disabled`.
- Phone is now gated in the UI as `Coming Soon` too, leaving email as the only live auth method exposed in the app.
- Static validation has been run after each completed step.
- True end-to-end runtime verification has not yet been completed for steps 1 through 7.
- This document is now the source of truth for build status, blockers, and test evidence.

## Repository Setup

- 2026-03-30: local Git repository initialized on `main`
- repository metadata added: `README.md`, `.gitattributes`, and updated `.gitignore`
- sensitive local files remain ignored, including `.env` and `supabase/.temp/`
- initial commit created and pushed to `origin/main`
- GitHub remote linked at `https://github.com/jgreen410/artBUD`

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

### 2026-03-30

Scope:
- Repository setup

Executed:
- `git init -b main`
- `git check-ignore .env supabase/.temp/project-ref`
- `git add .`
- `git commit -m "Initial Art Bud MVP scaffold"`
- `git remote add origin https://github.com/jgreen410/artBUD.git`
- `git push -u origin main`

Result:
- Local Git repository initialized successfully
- Sensitive local files remained ignored
- Initial commit created successfully
- GitHub remote connected successfully
- `main` pushed to GitHub successfully

### 2026-03-30

Scope:
- iOS startup stabilization

Executed:
- replaced all-or-nothing font boot with resilient required-plus-optional font loading
- removed eager `expo-system-ui` startup call from the root layout
- aligned `react-native-worklets` with Expo SDK 54 bundled native version via `npx expo install react-native-reanimated react-native-worklets`
- `npm run typecheck`
- `npx expo export --platform web`

Result:
- Static validation passed
- Root boot path is now tolerant of optional custom-font failures
- Reanimated JS now resolves against Expo-compatible `react-native-worklets@0.5.1` instead of the incompatible `0.8.1` tree that was crashing TurboModule startup
- iOS simulator or device retest is still pending from the app runtime

### 2026-03-30

Scope:
- post-detail route stabilization

Executed:
- normalized dynamic post route params before query usage
- sanitized post-detail arrays before render
- added a route-level error boundary for `app/post/[id].tsx`
- `npm run typecheck`
- `npx expo export --platform web`

Result:
- Static validation passed
- post-detail route is now resilient to array-shaped route params and sparse post payloads
- if another screen-level exception still occurs on post tap, the route now surfaces a real retryable error state instead of failing as an opaque router warning

### 2026-03-30

Scope:
- iOS post-detail text render regression

Executed:
- updated `components/ui/Button.tsx` so mixed primitive children are collapsed into a single `<Text>` node instead of leaking raw strings into a `View`
- replaced remaining deprecated `SafeAreaView` imports from `react-native` with `react-native-safe-area-context` on auth and feed entry screens
- `npm run typecheck`
- `npx expo export --platform web`

Result:
- Static validation passed
- the known `Text strings must be rendered within a <Text> component` crash path from post detail is fixed in shared button rendering
- deprecated `SafeAreaView` warnings from the touched screens are removed
- manual iOS device or simulator retest is still pending from the app runtime

### 2026-03-30

Scope:
- detail-route navigation guard regression

Executed:
- extracted root auth redirect logic into `lib/navigation.ts`
- fixed the root guard so authenticated users are allowed to stay on `post`, `community`, and `artist` stack routes instead of being redirected back to tabs
- added community-detail route param normalization and a route-level error boundary
- added route-guard regression tests in `tests/navigation.test.ts`
- added `npm run test`
- `npm run test`
- `npm run typecheck`
- `npx expo export --platform web`

Result:
- Static validation passed
- route-guard tests passed and now cover the exact bug that prevented detail screens from loading
- post and community detail routes are no longer blocked by the root auth redirect logic
- manual iOS device or simulator retest is still pending from the app runtime

### 2026-03-30

Scope:
- feed UI, community hero, icon-only tabs, and keyboard-input refinement pass

Executed:
- rebuilt feed filter chips with centered emoji and heavier label typography
- added feed-card likes plus comments plus direct like actions without card-navigation overlap
- added portfolio engagement overlays
- converted the bottom tabs to icon-only, art-forward icons
- restructured the community-detail hero so metrics and join actions no longer collide with the back button
- added exact community post counts for the hero badge row
- introduced shared keyboard-aware scrolling and a global iOS keyboard `Done` accessory
- applied the shared keyboard-safe pattern to login, signup, onboarding, create-post, and community search
- added a tested post-card action helper to protect the open-vs-like interaction contract
- `npm run test`
- `npm run typecheck`
- `npx expo export --platform web`

Result:
- Static validation passed
- automated tests passed for route guards and post-card interaction contracts
- web bundle export passed after the UI/input refinement changes
- manual device or simulator verification is still pending for chip alignment, icon-only tab legibility, community hero spacing, and live keyboard behavior across iOS and Android

### 2026-03-30

Scope:
- login-screen video hero and auth-entry redesign

Executed:
- added four auth showcase prompts and env-driven video slots in `lib/authShowcase.ts`
- added real SVG auth method marks for Google, Apple, email, and phone
- reformatted `app/(auth)/login.tsx` around a high-contrast auth panel and rotating video-ready hero
- `npm run test`
- `npm run typecheck`
- `npx expo export --platform web`

Result:
- Static validation passed
- login screen is now video-ready without hard-coding clip URLs into the component
- auth entry buttons now use dedicated icon files instead of generic font icons
- manual device or simulator verification is still pending for live video playback, contrast, and keyboard behavior on the redesigned login screen

### 2026-03-30

Scope:
- local login videos and animated wordmark

Executed:
- bound `assets/videos/1.mp4` through `assets/videos/4.mp4` into `lib/authShowcase.ts` as the default hero sources
- updated the auth hero so live video hides the long storyboard copy and keeps the overlay readable
- added `components/auth/HandwrittenWordmark.tsx` and mounted it on the login screen
- `npm run test`
- `npm run typecheck`
- `npx expo export --platform web`

Result:
- Static validation passed
- the login hero now uses the four shipped local clips by default, with `.env` URLs still available as overrides
- the `artBUD` wordmark now animates in as a handwritten reveal on the login panel
- manual device or simulator verification is still pending for playback smoothness and the handwritten animation feel on iOS and Android

### 2026-03-30

Scope:
- auth landing-route parity

Executed:
- rebuilt `app/(auth)/welcome.tsx` to use the same video hero, handwritten wordmark, icon-backed auth methods, and high-contrast panel system as the login route
- `npm run test`
- `npm run typecheck`
- `npx expo export --platform web`

Result:
- Static validation passed
- the signed-out default route now visibly reflects the auth redesign instead of keeping the older static welcome layout
- manual device or simulator verification is still pending for the updated auth landing screen

### 2026-03-30

Scope:
- auth hero transition polish and social-auth troubleshooting

Executed:
- rebuilt `components/auth/AuthVideoHero.tsx` to keep all four local hero videos mounted and crossfade between them
- rebuilt `components/auth/HandwrittenWordmark.tsx` so the lockup renders as handwritten `ART` plus bold `bud`, with extra vertical room to avoid clipping
- fixed Google mobile auth completion in `hooks/useAuth.ts` by exchanging the returned PKCE auth code for a session
- fixed Apple native auth completion in `hooks/useAuth.ts` by passing nonce and authorization code into `signInWithIdToken`
- enabled the `expo-apple-authentication` config plugin in `app.json`
- added callback parsing regression coverage in `tests/auth-redirect.test.ts`
- `npm run test`
- `npm run typecheck`
- `npx expo export --platform web`
- direct Supabase provider-initiation smoke for Google OAuth URL generation

Result:
- Static validation passed
- Google provider initiation passed against the live Supabase project and returned an authorize URL with `redirect_to=artbud://auth/callback`
- callback parsing is now covered for both PKCE `code` redirects and token-based redirects
- full interactive Google sign-in still requires a development build or production build because Expo documents that Expo Go cannot be used for local OAuth or OIDC testing
- full interactive Apple sign-in could not be automated from this terminal because it depends on device-side Apple credentials and native UI, but the Supabase handoff code is now aligned with the official Expo and Supabase examples

### 2026-03-30

Scope:
- temporary social-auth gating and SMS status verification

Executed:
- changed Google and Apple auth buttons on `app/(auth)/welcome.tsx` and `app/(auth)/login.tsx` to show a `Coming Soon` popup
- live Supabase phone-auth smoke via `signInWithOtp({ phone: '+15555550100' })`
- `npm run test`
- `npm run typecheck`
- `npx expo export --platform web`

Result:
- Static validation passed
- auth screens now communicate Google and Apple as intentionally unavailable instead of failing into incomplete mobile OAuth behavior
- live phone-auth smoke failed with `phone_provider_disabled`, so SMS code login is not currently working on the backend

### 2026-03-30

Scope:
- email-only auth presentation

Executed:
- changed phone entry buttons on `app/(auth)/welcome.tsx` and `app/(auth)/login.tsx` to show a `Coming Soon` popup
- removed the active phone form path from `app/(auth)/login.tsx`
- updated auth copy so email is described as the only currently available sign-in path
- `npm run test`
- `npm run typecheck`
- `npx expo export --platform web`

Result:
- Static validation passed
- email is now the only live auth path exposed in the app UI
- phone, Google, and Apple are all intentionally presented as unavailable for now

## Next Required Actions

1. Run a manual simulator or device tap-through for Step 8 and log the result here.
2. Run a manual simulator or device tap-through for Step 9 and log the result here.
3. Run a manual simulator or device tap-through for Step 10 and log the result here.
4. Run a manual simulator or device tap-through for Step 11 and log the result here.
5. Run a manual simulator or device tap-through for Step 12 and log the result here.
6. Run a manual simulator or device tap-through for Step 13 and log the result here.
7. Run a manual simulator or device tap-through for Step 14 and log the result here.
8. Rotate the service-role key, Supabase access token, and database password because they were shared outside local secret storage.
9. Keep `npm run test` passing before marking new navigation work as complete.
10. Run a manual device or simulator pass for the feed/community/tab-bar/keyboard refinement changes and log the results here.
