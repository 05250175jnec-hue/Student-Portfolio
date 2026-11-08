# Kezang Sherab | Portfolio

Personal portfolio website for Kezang Sherab, a Computer Systems and Networking student at Jigme Namgyel Engineering College (JNEC), Bhutan.

**Live site:** https://YOUR-USERNAME.github.io/YOUR-REPO/  *(replace after deploying)*

## Features
- Sections: Home, About, Skills, Projects, Achievements, Education, Contact
- Responsive layout (desktop, tablet, mobile) with a mobile menu
- Light and dark theme toggle (remembers your choice)
- Interactive network-style hero background and animated prayer-flag bunting
- TikTok video (official embedded player) as a live page background, with an Enter screen that starts the sound, and a ♪ mute button
- Tabbed skills with animated meters
- Certificates in Achievements, each with its PDF and a Coursera verification link
- Contact form with validation, plus labelled email, phone, GitHub, LinkedIn and location
- Respects `prefers-reduced-motion`; keyboard-focus styles and ARIA labels

## Tech
HTML, CSS and vanilla JavaScript, split into separate files. No build step, no dependencies. Fonts: Bricolage Grotesque and Figtree (Google Fonts).

## Project structure
```
index.html              page markup only (no inline CSS or JS)
css/
  variables.css         design tokens: colours, light/dark themes
  base.css              reset, typography, page wrapper, reduced motion
  layout.css            header, navigation, footer, back-to-top button
  components.css        buttons, chips, tabs, cards, skill meters, forms
  sections.css          hero, about, skills, projects, education, achievements, contact
  background.css        live video background, readability scrim, sound button state
js/
  utils.js              shared $ helper
  theme.js              light/dark toggle
  nav.js                mobile menu, active link, back-to-top, footer year
  hero.js               prayer flags, typing effect, network background
  skills.js             skill tabs and meters (edit the SKILLS object to change skills)
  contact.js            form validation and mailto hand-off
  background.js         TikTok video background and sound toggle
assets/images/          profile photo
assets/certificates/    certificate PDFs linked from Achievements
tests/test_site.py      automated browser test (Playwright)
submission.txt          GitHub and deployed links for submission
```

## Live background and music
The page background is a TikTok video, streamed with TikTok's official embedded player (nothing is copied into this repo). It loops with sound. Browsers block sound until a visitor interacts with the page, so the site opens with an **Enter** screen (`#enter` in `index.html`, styled in `css/background.css`). Pressing Enter turns the sound on from the start. The ♪ button mutes and unmutes at any time.

- **Change the video:** edit `VIDEO_ID` at the top of `js/background.js` (the number after `/video/` in the TikTok link).
- **Make the video more or less visible:** change `--scrim-strength` in `css/background.css`.
- TikTok videos are portrait, so on wide screens the video is scaled to fill the page and the top and bottom are cropped.
- Visitors who prefer reduced motion or have data-saver on get the plain page with no video, no Enter screen and no button.
- If TikTok is unreachable or the video can't be embedded, the page stays plain and the button hides itself.

TikTok may block embeds opened straight from a file (`file://`), so view the page through a server (see below) or the deployed site.

## Run locally
Open `index.html` in a browser, or serve the folder:
```
python3 -m http.server 8000
```
then visit http://localhost:8000.

## Test
```
pip install playwright && playwright install chromium
python3 tests/test_site.py
```
Checks: no JavaScript errors, all sections present, circular profile photo loads, no sideways scrolling, mobile menu, skills tabs, theme toggle and form validation on desktop and mobile widths.

## Deploy
**GitHub Pages:** Settings > Pages > Source: *Deploy from a branch* > `main` / `(root)`.
**Vercel:** Import the repository, framework preset *Other*, leave build settings empty, then Deploy.
