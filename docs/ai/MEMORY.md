# MEMORY — StreamHub

> Current state only. Rewritten when reality changes; never a diary, never contradictory facts side by side. Read top to bottom at every session start. No secrets.

## Current Position

- Owner: **Master** (always address as Master across all sessions)
- State: Fully responsive viewport across mobile, tablet, iPad, and desktop. Auth initialized to null (Sign In shown for unauthenticated devices). Owner credentials set to Gabriel Tolulope (`G@bby`).

## Fixed Decisions

- Typing into search input must only mutate local `inputVal`; global `searchQuery` is only dispatched on explicit Enter / submit / suggestion selection.
- All devices initialize with `user = null` displaying a dedicated "Sign In" button instead of any mock profile picture.
- Streaming embed iframes enforce ad protection via transparent mobile gesture shield overlay, window.open nullifier on watch routes, window beforeunload guards, CSP frame-src restrictions, and YouTube-style mobile gesture navigation (double tap -10s left / +10s right with visual ripples, hold for 2X speed, floating navigation HUD, and Server Switcher). Sandbox attribute is omitted by default so providers (AutoEmbed, VidLink, VidSrc) do not halt with "Playback blocked inside restricted frame".
- Mandatory Post-Deploy Verification: After pushing live deployment, immediately verify functionality on live Vercel host across mobile and desktop to guarantee zero redirect loops, working playback, and flawless gesture controls.

## Architecture

- Search autocomplete matches local catalog instantly with prefix prioritization while background API fetch queries `/api/movies` and `/api/anime`. Recent searches stored in `localStorage` under `streamhub_recent_searches`.
- Owner profile: Gabriel Tolulope with username `G@bby`. Quick sign-in available in AuthModal.

## Features

- Fully responsive layout across mobile phones (320px+), iPads/tablets (640-1024px), laptops, and desktop with iOS home-indicator safe-area padding (`env(safe-area-inset-bottom)`).
- Native mobile `navigator.share` sheet integration across sidebar and video card with clipboard fallback.
- Horizontal scroll filter pill controls for compact screens.
- Autocomplete dropdown with quick action "Search for '{inputVal}'" and prefix-sorted movie suggestions.
- Recent Searches history shown on empty search input with delete and clear-all actions.
- Clean "Sign In" button on all new devices; user profile and channel links available upon authentication.
- Manual reload and logo click clean state back to home screen.

## Environment

<!-- How to run it, what is required, what commonly goes wrong on setup. No secrets. -->

## Gotchas

- VidLink Pro `/tv/` endpoint returns HTTP 500 when provided movie TMDB IDs. Media with `movie-` IDs or `mediaType === 'movie'` must never evaluate `isTvShow = true` on watch page. Animated movies (`category: 'Cartoons'`) must retain movie classification unless explicit season counts exist.

## Deferred Work

## Deviations

<!-- Where the code diverges from its own conventions and whether that is tolerated. -->

## Open Questions

<!-- Mirror of SYSTEM.md → open_confirmations plus product questions awaiting the owner. -->
