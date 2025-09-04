#!/usr/bin/env node
import fs from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const file = path.join(root, 'data', 'fighters.json');
const STRICT = process.argv.includes('--strict');

function isStr(x) { return typeof x === 'string' && x.length >= 1; }
function isOptStr(x) { return x == null || typeof x === 'string'; }
function isOptNum(x) { return x == null || (Number.isFinite(x) && typeof x === 'number'); }

async function main() {
  let txt;
  try { txt = await fs.readFile(file, 'utf-8'); }
  catch (e) { console.error(`[fighters] cannot read ${file}:`, e.message || e); process.exit(STRICT ? 1 : 0); }
  let arr;
  try { arr = JSON.parse(txt); }
  catch (e) { console.error('[fighters] invalid JSON:', e.message || e); process.exit(STRICT ? 1 : 0); }
  if (!Array.isArray(arr)) { console.error('[fighters] not an array'); process.exit(STRICT ? 1 : 0); }

  const ids = new Set();
  let duplicates = 0, missingName = 0, badTypes = 0;
  arr.forEach((f) => {
    if (!isStr(f?.id)) badTypes++;
    else if (ids.has(f.id)) duplicates++; else ids.add(f.id);
    if (!isStr(f?.name)) missingName++;
    if (f?.record) {
      const r = f.record;
      if (!(isOptNum(r.wins) && isOptNum(r.losses) && isOptNum(r.draws) && isOptNum(r.noContests))) badTypes++;
    }
    if (f?.wikipedia) {
      const w = f.wikipedia;
      if (!(isOptStr(w.title) && isOptStr(w.lang) && isOptStr(w.url) && isOptStr(w.lead))) badTypes++;
    }
  });

  const summary = { total: arr.length, duplicates, missingName, badTypes };
  console.log('[fighters] summary', summary);
  if (duplicates) console.warn(`[fighters] WARN: duplicate ids = ${duplicates}`);
  if (missingName) console.warn(`[fighters] WARN: missing names = ${missingName}`);
  if (badTypes) console.warn(`[fighters] WARN: type mismatches = ${badTypes}`);

  if (STRICT && (duplicates || missingName || badTypes)) process.exit(1);
}

main().catch((e) => { console.error('[fighters] ERROR:', e); process.exit(STRICT ? 1 : 0); });

