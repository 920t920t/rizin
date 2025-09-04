#!/usr/bin/env node
import fs from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const fightersPath = path.join(root, 'data', 'fighters.json');
const cacheDir = path.join(root, '.cache', 'wikipedia');

async function maybeRead(p){ try { return await fs.readFile(p, 'utf-8'); } catch { return null; } }

async function main(){
  const txt = await fs.readFile(fightersPath, 'utf-8');
  const fighters = JSON.parse(txt);
  let updated = 0;
  for (const f of fighters) {
    const w = f?.wikipedia;
    if (!w?.lang || !w?.title) continue;
    const key = `${w.lang}_${w.title}`;
    const p = path.join(cacheDir, `${key}.json`);
    const cache = await maybeRead(p);
    if (!cache) continue;
    try {
      const { data } = JSON.parse(cache);
      const lead = data?.extract || data?.description || null;
      const url = data?.content_urls?.desktop?.page || data?.content_urls?.mobile?.page || w.url || null;
      f.wikipedia = {
        title: w.title ?? data?.title ?? null,
        lang: w.lang ?? null,
        url,
        lead
      };
      updated++;
    } catch {}
  }
  await fs.writeFile(fightersPath, JSON.stringify(fighters, null, 2) + '\n');
  console.log(`[update-data] fighters updated from cache: ${updated}`);
}

main().catch((e)=>{ console.error('[update-data] ERROR', e); process.exit(1); });

