#!/usr/bin/env node
import fs from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const fightersPath = path.join(root, 'data', 'fighters.json');
const sourcesPath = path.join(root, 'data', 'sources.json');
const cacheDir = path.join(root, '.cache', 'wikipedia');

async function maybeRead(p) { try { return await fs.readFile(p, 'utf-8'); } catch { return null; } }

async function main(){
  const [fightersTxt, sourcesTxt] = await Promise.all([
    fs.readFile(fightersPath, 'utf-8'),
    fs.readFile(sourcesPath, 'utf-8'),
  ]);
  const fighters = JSON.parse(fightersTxt);
  const sources = JSON.parse(sourcesTxt);
  const byId = new Map(fighters.map(f => [f.id, f]));
  let added = 0;
  for (const s of sources.fighters || []) {
    if (!s?.id) continue;
    if (byId.has(s.id)) continue;
    let name = s?.wikipedia?.title || s.id;
    if (s?.wikipedia?.lang && s?.wikipedia?.title) {
      const key = `${s.wikipedia.lang}_${s.wikipedia.title}`;
      const cache = await maybeRead(path.join(cacheDir, `${key}.json`));
      if (cache) {
        try { const { data } = JSON.parse(cache); name = data?.title || name; } catch {}
      }
    }
    fighters.push({
      id: s.id,
      name,
      kana: null,
      enName: null,
      birthDate: null,
      weightClass: null,
      affiliation: null,
      profile: null,
      record: { wins: null, losses: null, draws: null, noContests: null },
      wikipedia: {
        title: s?.wikipedia?.title || null,
        lang: s?.wikipedia?.lang || null,
        url: null,
        lead: null,
      },
    });
    added++;
  }
  if (added > 0) {
    await fs.writeFile(fightersPath, JSON.stringify(fighters, null, 2) + '\n');
  }
  console.log(`[add-from-sources] added=${added}`);
}

main().catch((e)=>{ console.error('[add-from-sources] ERROR', e); process.exit(1); });

