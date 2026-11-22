// Downloads every artwork listed in src/data/commons.json from Wikimedia Commons into public/works/.
// Files already present are skipped. Run: node scripts/fetch-works.mjs
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'

const list = JSON.parse(readFileSync('src/data/commons.json', 'utf8'))
mkdirSync('public/works', { recursive: true })
const UA = 'HYPHA-prototype/1.0 (student pitch project; https://github.com/Hypha-Team/hypha-maestri)'
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

let failed = 0
for (const e of list) {
  const out = `public/works/${e.key}.${e.ext}`
  if (existsSync(out)) continue
  const width = Math.min(1600, e.w)
  const url = `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(e.file)}?width=${width}`
  let ok = false
  for (let attempt = 1; attempt <= 4 && !ok; attempt++) {
    try {
      const res = await fetch(url, { headers: { 'User-Agent': UA }, redirect: 'follow' })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const buf = Buffer.from(await res.arrayBuffer())
      writeFileSync(out, buf)
      console.log(`ok   ${out}  ${(buf.length / 1024).toFixed(0)} KB`)
      ok = true
    } catch (err) {
      console.log(`retry ${e.key} (${attempt}): ${err.message}`)
      await sleep(3000 * attempt)
    }
  }
  if (!ok) failed++
  await sleep(800)
}
if (failed) {
  console.error(`${failed} file(s) failed`)
  process.exit(1)
}
