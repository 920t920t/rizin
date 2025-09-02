#!/usr/bin/env node
import fs from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const file = path.join(root, 'data', 'votes.json');

const args = new Set(process.argv.slice(2));
const WRITE = args.has('--write');
const STRICT = args.has('--strict');

function normalizeKey(a, b) {
  return [a, b].sort().join('_');
}

async function main() {
  let txt;
  try {
    txt = await fs.readFile(file, 'utf-8');
  } catch (e) {
    console.error(`[votes] ERROR: cannot read ${file}:`, e.message || e);
    process.exit(STRICT ? 1 : 0);
  }

  let obj;
  try {
    obj = JSON.parse(txt);
  } catch (e) {
    console.error('[votes] ERROR: invalid JSON:', e.message || e);
    process.exit(STRICT ? 1 : 0);
  }

  const out = {};
  let total = 0;
  let invalidKeys = 0;
  let nonNumberValues = 0;
  let merged = 0;
  let negatives = 0;

  for (const [k, v] of Object.entries(obj || {})) {
    total += 1;
    const parts = String(k).split('_');
    if (parts.length !== 2 || !parts[0] || !parts[1]) {
      invalidKeys += 1;
      continue;
    }
    const nk = normalizeKey(parts[0], parts[1]);
    if (nk !== k) merged += 1;
    let n = Number(v);
    if (!Number.isFinite(n)) {
      nonNumberValues += 1;
      n = 0;
    }
    if (n < 0) negatives += 1;
    out[nk] = (out[nk] ?? 0) + Math.max(0, Math.floor(n));
  }

  const sorted = Object.fromEntries(
    Object.entries(out).sort(([a], [b]) => a.localeCompare(b))
  );

  const summary = { total, normalizedKeys: Object.keys(sorted).length, merged, invalidKeys, nonNumberValues, negatives };
  const hasIssues = invalidKeys || nonNumberValues || negatives;

  // Report
  console.log(`[votes] summary`, summary);
  if (invalidKeys) console.warn(`[votes] WARN: invalid key format count = ${invalidKeys}`);
  if (nonNumberValues) console.warn(`[votes] WARN: non-number values count = ${nonNumberValues}`);
  if (negatives) console.warn(`[votes] WARN: negative values found = ${negatives} (clamped to 0)`);
  if (merged) console.log(`[votes] info: merged (normalized) duplicate keys = ${merged}`);

  if (WRITE) {
    const json = JSON.stringify(sorted, null, 2) + '\n';
    await fs.writeFile(file, json, 'utf-8');
    console.log(`[votes] wrote normalized file: ${file}`);
  }

  if (STRICT && hasIssues) process.exit(1);
}

main().catch((e) => {
  console.error('[votes] ERROR:', e);
  process.exit(STRICT ? 1 : 0);
});

