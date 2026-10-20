# MEMORY — StreamHub

> Current state only. Rewritten when reality changes; never a diary, never contradictory facts side by side. Read top to bottom at every session start. No secrets.

## Current Position

- Owner: **Master** (always address as Master across all sessions)
- State: Fully responsive viewport across mobile, tablet, iPad, and desktop. Auth initialized to null (Sign In shown for unauthenticated devices). Owner credentials set to Gabriel Tolulope (`G@bby`).

## Fixed Decisions

- Typing into search input must only mutate local `inputVal`; global `searchQuery` is only dispatched on explicit Enter / submit / suggestion selection.
- All devices initialize with `user = null` displaying a dedicated "Sign In" button instead of any mock profile picture.
- Viewport explicitly exports `device-width` and `initialScale: 1` with strict horizontal overflow constraints.
- Streaming embed iframes omit `sandbox` and use `referrerPolicy="strict-origin-when-cross-origin"` so external streaming hosts do not reject playback with sandbox errors.
- Movie stream server 1 defaults to VidLink Pro (with AutoEmbed, VidSrc CC v2, Embed.su mirrors) offering native +10s forward/-10s rewind seeking and minimal ad redirects.

## Architecture

- Search autocomplete matches local catalog instantly with prefix prioritization while background API fetch queries `/api/movies` and `/api/anime`. Recent searches stored in `localStorage` under `streamhub_recent_searches`.
- Owner profile: Gabriel Tolulope with username `G@bby`. Quick sign-in available in AuthModal.

## Features

- Fully responsive layout across mobile phones (320px+), iPads/tablets (640-1024px), laptops, and desktop.
- Autocomplete dropdown with quick action "Search for '{inputVal}'" and prefix-sorted movie suggestions.
- Recent Searches history shown on empty search input with delete and clear-all actions.
- Clean "Sign In" button on all new devices; user profile and channel links available upon authentication.
- Manual reload and logo click clean state back to home screen.

## Environment

<!-- How to run it, what is required, what commonly goes wrong on setup. No secrets. -->

## Gotchas

<!-- Specific: "X silently fails when Y". -->

## Deferred Work

## Deviations

<!-- Where the code diverges from its own conventions and whether that is tolerated. -->

## Open Questions

<!-- Mirror of SYSTEM.md → open_confirmations plus product questions awaiting the owner. -->
