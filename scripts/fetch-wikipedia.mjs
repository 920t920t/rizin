#!/usr/bin/env node
import fs from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const sourcesPath = path.join(root, 'data', 'sources.json');
const cacheDir = path.join(root, '.cache', 'wikipedia');

const argv = process.argv.slice(2);
let only = null;
{
  const i = argv.indexOf('--only');
  if (i !== -1 && argv[i + 1]) only = new Set(argv[i + 1].split(','));
}

async function ensureDir(p) { await fs.mkdir(p, { recursive: true }); }

async function fetchSummary(lang, title) {
  const url = `https://${lang}.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`;
  const res = await fetch(url, { headers: { 'accept': 'application/json' } });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  return res.json();
}

async function main() {
  await ensureDir(cacheDir);
  const src = JSON.parse(await fs.readFile(sourcesPath, 'utf-8'));
  const items = src.fighters || [];
  let ok = 0, fail = 0;
  for (const it of items) {
    if (only && !only.has(it.id)) continue;
    const { wikipedia } = it || {};
    if (!wikipedia?.lang || !wikipedia?.title) continue;
    const key = `${wikipedia.lang}_${wikipedia.title}`;
    const out = path.join(cacheDir, `${key}.json`);
    try {
      const data = await fetchSummary(wikipedia.lang, wikipedia.title);
      await fs.writeFile(out, JSON.stringify({ fetchedAt: new Date().toISOString(), data }, null, 2));
      ok++;
      console.log(`[wp] ${key} ✓`);
    } catch (e) {
      fail++;
      console.warn(`[wp] ${key} ✗`, e.message || e);
    }
  }
  console.log(`[wp] done ok=${ok} fail=${fail}`);
}

main().catch((e) => { console.error('[wp] ERROR', e); process.exit(1); });

