/*
  Procedural placeholder artworks.
  Every artwork image in the demo comes from here, so there are no copyright issues.
  To use real photos later: give a Work a picture like { src: '/works/marta-1.jpg', ratio: 0.8 }
  instead of { art: {...} } — nothing else needs to change.
*/
import type { ArtSpec, Picture } from '../data/types'

/** Small deterministic random generator: the same seed always gives the same artwork. */
function rng(seed: number) {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const PALETTES: string[][] = [
  ['#2E3A33', '#C9B79C', '#8C5A3C', '#E9E2D6'], // moss, sand, rust
  ['#1F2A44', '#D9C9A8', '#B4553B', '#EDE6DA'], // ink blue, terracotta
  ['#3B3430', '#A89F94', '#6F7F73', '#E8E3DC'], // stone greys
  ['#5A2E2A', '#E2B58C', '#2F4A5A', '#F2E9DE'], // oxblood, peach, teal
  ['#20302B', '#7FA38F', '#E7C873', '#F0ECE3'], // forest, sage, ochre
  ['#2B2B3A', '#8E86B5', '#D98E73', '#EEE9F0'], // violet dusk
  ['#3A2F25', '#B8946A', '#D8CFC0', '#F4EFE7'], // wood and plaster
  ['#11263A', '#3F7CA6', '#C7D9E3', '#F2EEE8'], // harbour blue
  ['#402A3C', '#C97B84', '#F1C9A5', '#F6EEE8'], // rose clay
  ['#262626', '#6E6E6E', '#BDB7AE', '#EFEBE5'], // graphite
]

const W = 600

type Ctx = { r: () => number; w: number; h: number; p: string[] }

const pick = <T,>(r: () => number, list: T[]) => list[Math.floor(r() * list.length)]
const f = (n: number) => n.toFixed(1)

// ---- styles ---------------------------------------------------------------

function stone({ r, w, h, p }: Ctx) {
  const cx = w / 2 + (r() - 0.5) * w * 0.1
  const base = h * 0.78
  const fw = w * (0.28 + r() * 0.18)
  const fh = h * (0.35 + r() * 0.2)
  const pts: string[] = []
  const n = 9
  for (let i = 0; i <= n; i++) {
    const a = Math.PI + (i / n) * Math.PI
    const rx = fw * (0.8 + r() * 0.35)
    const ry = fh * (0.85 + r() * 0.3)
    pts.push(`${f(cx + Math.cos(a) * rx)},${f(base - 10 + Math.sin(a) * ry)}`)
  }
  const hole = r() > 0.4
  return `
  <defs><linearGradient id="g" x1="0" x2="1"><stop offset="0" stop-color="${p[1]}"/><stop offset="1" stop-color="${p[2]}"/></linearGradient>
  <radialGradient id="l" cx="0.3" cy="0.2" r="0.9"><stop offset="0" stop-color="#fff" stop-opacity="0.5"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient></defs>
  <rect width="${w}" height="${h}" fill="${p[3]}"/>
  <rect y="${f(base + 30)}" width="${w}" height="${h}" fill="${p[1]}" opacity="0.35"/>
  <ellipse cx="${f(cx + 30)}" cy="${f(base + 32)}" rx="${f(fw * 1.2)}" ry="14" fill="${p[0]}" opacity="0.18"/>
  <rect x="${f(cx - fw * 0.9)}" y="${f(base)}" width="${f(fw * 1.8)}" height="34" fill="${p[0]}" opacity="0.85"/>
  <polygon points="${pts.join(' ')}" fill="url(#g)" stroke-linejoin="round"/>
  <polygon points="${pts.join(' ')}" fill="url(#l)"/>
  <clipPath id="cut"><polygon points="${pts.join(' ')}"/></clipPath>
  <g clip-path="url(#cut)">${Array.from({ length: 90 }, () => { const x = cx + (r() - 0.5) * fw * 2; const y = base - r() * fh * 1.3; const l = 6 + r() * 10; return `<line x1="${f(x)}" y1="${f(y)}" x2="${f(x + l)}" y2="${f(y - l * 0.4)}" stroke="${p[0]}" stroke-width="1.2" stroke-linecap="round" opacity="0.16"/>` }).join('')}</g>
  ${hole ? `<ellipse cx="${f(cx + (r() - 0.5) * fw * 0.6)}" cy="${f(base - fh * 0.55)}" rx="${f(fw * 0.18)}" ry="${f(fh * 0.16)}" fill="${p[3]}"/>` : ''}`
}

function strata({ r, w, h, p }: Ctx) {
  let out = `<rect width="${w}" height="${h}" fill="${p[3]}"/>`
  let y = 0
  while (y < h) {
    const bh = 20 + r() * 90
    const c = pick(r, p)
    const wob = 8 + r() * 20
    out += `<path d="M0 ${f(y)} C ${f(w * 0.3)} ${f(y - wob)}, ${f(w * 0.6)} ${f(y + wob)}, ${w} ${f(y)} L ${w} ${f(y + bh + 10)} L 0 ${f(y + bh + 10)} Z" fill="${c}" opacity="${f(0.75 + r() * 0.25)}"/>`
    y += bh
  }
  return out
}

function orbs({ r, w, h, p }: Ctx) {
  let out = `<defs>`
  for (let i = 0; i < 4; i++) {
    out += `<radialGradient id="o${i}"><stop offset="0" stop-color="${p[i % 3]}"/><stop offset="1" stop-color="${p[i % 3]}" stop-opacity="0"/></radialGradient>`
  }
  out += `</defs><rect width="${w}" height="${h}" fill="${p[3]}"/>`
  for (let i = 0; i < 7; i++) {
    const rad = 80 + r() * 220
    out += `<circle cx="${f(r() * w)}" cy="${f(r() * h)}" r="${f(rad)}" fill="url(#o${i % 4})" opacity="${f(0.55 + r() * 0.4)}"/>`
  }
  return out
}

function blocks({ r, w, h, p }: Ctx) {
  let out = `<rect width="${w}" height="${h}" fill="${p[3]}"/>`
  for (let i = 0; i < 9; i++) {
    const bw = 60 + r() * 260
    const bh = 40 + r() * 260
    const x = r() * (w - bw * 0.5)
    const y = r() * (h - bh * 0.5)
    const c = pick(r, p.slice(0, 3))
    out += r() > 0.75
      ? `<circle cx="${f(x)}" cy="${f(y)}" r="${f(bw / 2.4)}" fill="${c}" opacity="0.9"/>`
      : `<rect x="${f(x)}" y="${f(y)}" width="${f(bw)}" height="${f(bh)}" fill="${c}" opacity="${f(0.7 + r() * 0.3)}" transform="rotate(${f((r() - 0.5) * 14)} ${f(x)} ${f(y)})"/>`
  }
  return out
}

function flow({ r, w, h, p }: Ctx) {
  let out = `<rect width="${w}" height="${h}" fill="${p[3]}"/>`
  const lines = 18 + Math.floor(r() * 14)
  const amp = 20 + r() * 60
  const freq = 0.004 + r() * 0.01
  const ph = r() * 10
  for (let i = 0; i < lines; i++) {
    const y0 = (i / lines) * h * 1.1
    let d = `M -10 ${f(y0)}`
    for (let x = 0; x <= w + 20; x += 20) {
      const y = y0 + Math.sin(x * freq + ph + i * 0.25) * amp * (0.4 + i / lines)
      d += ` L ${x} ${f(y)}`
    }
    out += `<path d="${d}" fill="none" stroke="${i % 5 === 0 ? p[2] : p[0]}" stroke-width="${f(1.2 + r() * 3)}" stroke-linecap="round" opacity="0.85"/>`
  }
  return out
}

function hatch({ r, w, h, p }: Ctx) {
  let out = `<rect width="${w}" height="${h}" fill="#F3EEE6"/>`
  const cx = w * (0.35 + r() * 0.3)
  const cy = h * (0.35 + r() * 0.3)
  const rad = Math.min(w, h) * (0.25 + r() * 0.15)
  for (let i = 0; i < 520; i++) {
    const a = r() * Math.PI * 2
    const d = Math.sqrt(r()) * rad
    const x = cx + Math.cos(a) * d
    const y = cy + Math.sin(a) * d
    const len = 10 + r() * 24
    const ang = -0.9 + (d / rad) * 0.5
    out += `<line x1="${f(x)}" y1="${f(y)}" x2="${f(x + Math.cos(ang) * len)}" y2="${f(y + Math.sin(ang) * len)}" stroke="${p[0]}" stroke-width="${f(0.6 + r() * 1.1)}" opacity="${f(0.5 + (1 - d / rad) * 0.5)}" stroke-linecap="round"/>`
  }
  for (let i = 0; i < 3; i++) {
    out += `<ellipse cx="${f(cx + (r() - 0.5) * 20)}" cy="${f(cy + (r() - 0.5) * 20)}" rx="${f(rad * (0.9 + r() * 0.2))}" ry="${f(rad * (0.8 + r() * 0.3))}" fill="none" stroke="${p[0]}" stroke-width="1" opacity="0.5"/>`
  }
  return out
}

function horizon({ r, w, h, p }: Ctx) {
  const hy = h * (0.45 + r() * 0.2)
  return `
  <defs><linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${p[1]}"/><stop offset="1" stop-color="${p[3]}"/></linearGradient>
  <linearGradient id="sea" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${p[2]}"/><stop offset="1" stop-color="${p[0]}"/></linearGradient>
  <filter id="soft"><feGaussianBlur stdDeviation="6"/></filter></defs>
  <rect width="${w}" height="${h}" fill="url(#sky)"/>
  <circle cx="${f(w * (0.2 + r() * 0.6))}" cy="${f(hy - 60 - r() * 80)}" r="${f(26 + r() * 30)}" fill="${p[3]}" opacity="0.9" filter="url(#soft)"/>
  <path d="M0 ${f(hy)} Q ${f(w * 0.25)} ${f(hy - 30 - r() * 40)} ${f(w * 0.5)} ${f(hy - 10)} T ${w} ${f(hy - 20)} V ${h} H 0 Z" fill="url(#sea)"/>
  <rect y="${f(hy + 20)}" width="${w}" height="2" fill="${p[3]}" opacity="0.25"/>`
}

function lamp({ r, w, h, p }: Ctx) {
  const cx = w / 2
  const top = h * 0.18
  const shade = 90 + r() * 70
  const arm = r() > 0.5
  return `
  <defs><radialGradient id="glow" cx="0.5" cy="0.2" r="0.8"><stop offset="0" stop-color="#FFE9B8" stop-opacity="0.95"/><stop offset="1" stop-color="#FFE9B8" stop-opacity="0"/></radialGradient></defs>
  <rect width="${w}" height="${h}" fill="${p[0]}"/>
  <ellipse cx="${cx}" cy="${f(top + shade * 1.6)}" rx="${f(shade * 2.2)}" ry="${f(shade * 2)}" fill="url(#glow)"/>
  <line x1="${cx}" y1="0" x2="${cx}" y2="${f(top)}" stroke="${p[1]}" stroke-width="3"/>
  ${arm ? `<path d="M ${cx} ${f(top)} q ${f(shade)} ${f(shade * 0.6)} 0 ${f(shade)}" fill="none" stroke="${p[1]}" stroke-width="4"/>` : ''}
  <path d="M ${f(cx - shade / 2)} ${f(top + shade * 0.8)} L ${f(cx - shade / 5)} ${f(top)} L ${f(cx + shade / 5)} ${f(top)} L ${f(cx + shade / 2)} ${f(top + shade * 0.8)} Z" fill="${p[1]}"/>
  <ellipse cx="${cx}" cy="${f(top + shade * 0.8)}" rx="${f(shade / 2)}" ry="8" fill="#FFF3D6"/>
  <rect y="${f(h * 0.86)}" width="${w}" height="${f(h * 0.14)}" fill="${p[2]}" opacity="0.6"/>`
}

function screen({ r, w, h, p }: Ctx) {
  let out = `<rect width="${w}" height="${h}" fill="${p[0]}"/>`
  for (let i = 0; i < 14; i++) {
    const y = r() * h
    const bh = 4 + r() * 40
    out += `<rect x="${f(r() * w * 0.3 - 20)}" y="${f(y)}" width="${f(w * (0.4 + r() * 0.8))}" height="${f(bh)}" fill="${pick(r, p.slice(1))}" opacity="${f(0.4 + r() * 0.6)}"/>`
  }
  for (let y = 0; y < h; y += 4) out += `<rect y="${y}" width="${w}" height="1.4" fill="#000" opacity="0.18"/>`
  return out
}

function poster({ r, w, h, p }: Ctx) {
  let out = `<rect width="${w}" height="${h}" fill="${p[3]}"/>`
  const rows = 4 + Math.floor(r() * 4)
  let y = 40
  for (let i = 0; i < rows; i++) {
    const bh = 18 + r() * 70
    const bw = w * (0.3 + r() * 0.6)
    out += `<rect x="40" y="${f(y)}" width="${f(bw)}" height="${f(bh)}" rx="${f(bh / 2.2)}" fill="${i === 0 ? p[2] : p[0]}"/>`
    y += bh + 14
  }
  out += `<circle cx="${f(w * 0.72)}" cy="${f(h * 0.72)}" r="${f(80 + r() * 60)}" fill="${p[1]}"/>`
  for (let i = 0; i < 6; i++) out += `<rect x="40" y="${f(h - 120 + i * 14)}" width="${f(120 + r() * 160)}" height="5" fill="${p[0]}" opacity="0.5"/>`
  return out
}

function sketch({ r, w, h, p }: Ctx) {
  let out = `<rect width="${w}" height="${h}" fill="#F6F2EA"/>`
  for (let x = 0; x < w; x += 24) out += `<line x1="${x}" y1="0" x2="${x}" y2="${h}" stroke="#9BB4C4" stroke-width="0.6" opacity="0.5"/>`
  for (let y = 0; y < h; y += 24) out += `<line x1="0" y1="${y}" x2="${w}" y2="${y}" stroke="#9BB4C4" stroke-width="0.6" opacity="0.5"/>`
  const cx = w / 2
  const cy = h / 2
  for (let i = 0; i < 5; i++) {
    const s = 60 + r() * 120
    out += `<path d="M ${f(cx - s)} ${f(cy + s * 0.6)} Q ${f(cx)} ${f(cy - s * (0.6 + r()))} ${f(cx + s)} ${f(cy + s * 0.6)}" fill="none" stroke="${p[0]}" stroke-width="${f(1 + r() * 1.5)}" opacity="0.8" stroke-linecap="round"/>`
  }
  out += `<line x1="${f(cx - 160)}" y1="${f(cy + 110)}" x2="${f(cx + 160)}" y2="${f(cy + 110)}" stroke="${p[2]}" stroke-width="2"/>`
  out += `<line x1="${f(cx - 160)}" y1="${f(cy + 102)}" x2="${f(cx - 160)}" y2="${f(cy + 118)}" stroke="${p[2]}" stroke-width="2"/>`
  out += `<line x1="${f(cx + 160)}" y1="${f(cy + 102)}" x2="${f(cx + 160)}" y2="${f(cy + 118)}" stroke="${p[2]}" stroke-width="2"/>`
  return out
}

const STYLES = { stone, strata, orbs, blocks, flow, hatch, horizon, lamp, screen, poster, sketch }


const cache = new Map<string, string>()

/** Returns an SVG string for an artwork. */
export function artSvg(spec: ArtSpec): string {
  const key = JSON.stringify(spec)
  const hit = cache.get(key)
  if (hit) return hit
  const r = rng(spec.seed)
  const w = W
  const h = Math.round(W / spec.ratio)
  const p = spec.palette ?? PALETTES[spec.seed % PALETTES.length]
  const body = STYLES[spec.style]({ r, w, h, p })
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" preserveAspectRatio="xMidYMid slice">${body}</svg>`
  cache.set(key, svg)
  return svg
}

/** Returns a data: URL usable in <img src>. */
export function artUrl(spec: ArtSpec): string {
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(artSvg(spec))}`
}

/** Image URL and aspect ratio for any Picture (generated or real). */
export function pictureSrc(p: Picture): { src: string; ratio: number } {
  return 'art' in p ? { src: artUrl(p.art), ratio: p.art.ratio } : p
}

/** Convenience for sample data. */
export const art = (style: ArtSpec['style'], seed: number, ratio = 0.8, palette?: string[]): Picture => ({
  art: { style, seed, ratio, palette },
})
