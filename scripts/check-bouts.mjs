#!/usr/bin/env node
import fs from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const boutsFile = path.join(root, 'data', 'featured_bouts.json');
const fightersFile = path.join(root, 'data', 'fighters.json');
const STRICT = process.argv.includes('--strict');

function isStr(x) { return typeof x === 'string' && x.length >= 1; }

async function main() {
  let bouts = [], fighters = [];
  try { bouts = JSON.parse(await fs.readFile(boutsFile, 'utf-8')); }
  catch (e) { console.error('[bouts] cannot read featured_bouts.json:', e.message || e); process.exit(STRICT ? 1 : 0); }
  try { fighters = JSON.parse(await fs.readFile(fightersFile, 'utf-8')); }
  catch (e) { console.error('[bouts] cannot read fighters.json:', e.message || e); process.exit(STRICT ? 1 : 0); }

  const fighterIds = new Set(fighters.map(f => f?.id).filter(Boolean));
  const ids = new Set();
  let duplicates=0, badTypes=0, missingRefs=0;

  if (!Array.isArray(bouts)) { console.error('[bouts] not an array'); process.exit(STRICT ? 1 : 0); }
  bouts.forEach((b) => {
    if (!isStr(b?.id)) badTypes++;
    else if (ids.has(b.id)) duplicates++; else ids.add(b.id);
    if (!(isStr(b?.fighterId) && isStr(b?.opponentId))) badTypes++;
    if (!fighterIds.has(b?.fighterId) || !fighterIds.has(b?.opponentId)) missingRefs++;
  });

  const summary = { total: bouts.length, duplicates, badTypes, missingRefs };
  console.log('[bouts] summary', summary);
  if (duplicates) console.warn(`[bouts] WARN: duplicate ids = ${duplicates}`);
  if (badTypes) console.warn(`[bouts] WARN: type mismatches = ${badTypes}`);
  if (missingRefs) console.warn(`[bouts] WARN: invalid fighter references = ${missingRefs}`);

  if (STRICT && (duplicates || badTypes || missingRefs)) process.exit(1);
}

main().catch((e) => { console.error('[bouts] ERROR:', e); process.exit(STRICT ? 1 : 0); });

