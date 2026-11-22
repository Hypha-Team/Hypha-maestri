// Real artworks by the artists in the demo. All public domain or CC0 on Wikimedia Commons.
// The list lives in commons.json. scripts/fetch-works.mjs downloads each file into public/works/<key>.<ext>
// (the GitHub Action "Fetch works and deploy" runs it), so the site serves them like user uploads.
// To add a work: add an entry to commons.json (key, Commons file name, original width and height) and push.
import list from './commons.json'
import type { Picture } from './types'

type Entry = { key: string; file: string; w: number; h: number; ext: string }

export const P = Object.fromEntries(
  (list as Entry[]).map((e) => [e.key, { src: `${import.meta.env.BASE_URL}works/${e.key}.${e.ext}`, ratio: e.w / e.h } satisfies Picture]),
) as Record<string, Picture>

/** Every artwork, for places that need a sample picture. */
export const samplePictures: Picture[] = Object.values(P)
