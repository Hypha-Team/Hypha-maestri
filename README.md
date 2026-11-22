# HYPHA — pitch prototype (Maestri edition)

Version of the HYPHA prototype where the users are great artists from art history, with their real works (public domain / CC0 from Wikimedia Commons). The images are stored in `public/works/`, listed in `src/data/commons.json`. The GitHub Action *Fetch works and deploy* downloads any missing image, saves it in the repo, builds the site and publishes it, on every push to `main`. The original version lives in [Hypha-Team/hypha](https://github.com/Hypha-Team/hypha).

Clickable prototype of HYPHA, the networking platform for Fine Arts students in Lisbon.
Sample data only, no backend. Everything you do is saved in the browser (localStorage).

## Run it

You need Node.js 20 or newer.

```bash
npm install
npm run dev
```

Open the address it prints (http://localhost:5173). To open it on a phone on the same Wi-Fi, use the "Network" address it prints.

## The demo

- **Play demo** (welcome screen, sidebar on desktop, or the "Demo mode" pill on phones) runs the guided story with captions.
  Press **Next**, or click the element circled in red.
- The **Demo mode** pill switches between Marta, Tiago, Prof. Costa and Galeria Fio.
- **Reset demo data** (inside the pill menu) puts everything back to the start. Do this before the pitch.

## Where to change things

| What | File |
| --- | --- |
| Colours, fonts, type scale | `src/theme.css` |
| Animation speed | `src/motion/motion.ts` (`DUR`) |
| Interface texts EN / PT | `src/i18n/en.ts`, `src/i18n/pt.ts` |
| Demo captions and steps | `src/demo/Demo.tsx` (`STEPS`) |
| People | `src/data/people.ts` |
| Works / projects | `src/data/works.ts` |
| Posts, project calls, opportunities, chat replies | `src/data/content.ts` |
| Placeholder artworks | `src/art/generateArt.ts` |
| Logo | `public/logo.jpg` |

**Real photos instead of generated art:** put images in `public/works/` and in `src/data/works.ts` replace
`picture: art('stone', 101, 0.78)` with `picture: { src: '/works/marta-1.jpg', ratio: 0.78 }` (ratio = width / height).

## Live site

https://hypha-team.github.io/hypha-maestri/ (GitHub Pages, branch `gh-pages`).

To publish an update there:

```bash
BASE=/hypha-maestri/ npm run build && cp dist/index.html dist/404.html && touch dist/.nojekyll
```

then push the contents of `dist` to the `gh-pages` branch.

## Deploy for free

**Vercel:** push this folder to a GitHub repository, then on vercel.com choose *Add New → Project*, import the repository and press *Deploy* (Vite is detected automatically). `vercel.json` already handles page links.

**Netlify:** run `npm run build` and drag the `dist` folder onto app.netlify.com/drop. `public/_redirects` already handles page links.

## Built with

Vite, React, TypeScript, Tailwind CSS, React Router, GSAP (+ ScrollTrigger), Lenis, and four React Bits components
(BlurText, Masonry, Magnet, ClickSpark) in `src/components/reactbits/`.
