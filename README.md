# Rishav & Sneha — Wedding Invitation Website

A cinematic single-page wedding invitation: a tap-to-enter video gate, a
day/night toggle hero, a second full-screen photo, three individually-
scratchable heart cards that reveal the Day/Month/Year of the wedding with a
confetti burst, a live countdown, a moments video, a per-ceremony video
itinerary, a venue section with map QR codes, a note section, and a family
blessings section. Plain HTML/CSS/JS — no build step. Open `index.html`
directly or host the folder anywhere (Netlify, GitHub Pages, any static
host).

## What to customize

**Names** — search `index.html` for "Rishav" and "Sneha" and replace
throughout (entry gate, footer, page title).

**Wedding date** (drives the countdown and the Day/Month/Year scratch hearts):
- `js/main.js` → `const WEDDING_DATE = new Date('2026-12-07T00:00:00')`

**Ceremony itinerary / dates** — edit the `.event-block` sections inside
`.events-section` in `index.html` (Tilak / Haldi & Marwa / The Golden
Affair / Nach Le Tonight / The Celebration of Forever / Reception).

**Venue details** — edit the four `.venue-card` blocks inside
`.venue-section` in `index.html` (one per date: 5th/6th/7th/9th December). Each
card has a name, address, a QR code image, and a "Get Directions" link. Both
the QR code and the button point to the same Google Maps link — update the
`href` on `.venue-directions-btn` and the `data=` parameter in the QR image
`src` together when you change a venue. The QR codes are generated on the fly
via the free public api.qrserver.com service (just an image URL, no signup
needed) — if you'd rather not depend on a third party, swap those `<img>`
tags for a QR image you generate and host yourself.

## Media — placeholder slots to fill in

Every photo/video/audio spot is a placeholder today so the site works and
looks intentional with zero assets, and upgrades automatically the moment you
drop a real file in with the matching name (missing files fail silently via
`onerror`/`onerror`-equivalent handling — nothing breaks):

- `assets/video/entry.mp4` — cinematic entry-gate video. Missing → falls back to a simple "Tap to enter" screen.
- `assets/images/HeroLight.png`, `assets/images/HeroDark.png` — full-screen hero photos for the day/night toggle.
- `assets/images/SecondImage.png` — full-screen photo shown right after the hero as the user scrolls down.
- `assets/video/moments.mp4` — vertical highlight reel.
- `assets/video/event-tilak.mp4`, `event-5-haldi.mp4`, `event-haldi.mp4`, `event-sangeet.mp4`, `event-wedding.mp4`, `event-reception.mp4` — one looping clip per ceremony.
- `assets/images/note.png` — a heartfelt note/photo shown near the end, before the family blessings section.
- `assets/audio/bg-music.mp3` — background track, toggled via the speaker button (use something you have the rights to use).

See the `README.txt` in each `assets/` subfolder for exact filenames and
recommended specs.

## Structure

```
index.html          all sections/markup
css/style.css        theme tokens, layout, animations
js/main.js           entry gate, day/night + audio toggles, countdown,
                     scratch hearts + confetti, ambient particles,
                     scroll reveal
assets/images/       drop HeroLight.png, HeroDark.png, SecondImage.png, note.png here
assets/video/        drop entry.mp4, moments.mp4, event-*.mp4 here
assets/audio/        drop bg-music.mp3 here
```
