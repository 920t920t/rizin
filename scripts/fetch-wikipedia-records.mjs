#!/usr/bin/env node
import fs from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const fightersPath = path.join(root, 'data', 'fighters.json');

function sleep(ms){ return new Promise(r=>setTimeout(r, ms)); }

async function fetchHtml(lang, title) {
  const url = `https://${lang}.wikipedia.org/api/rest_v1/page/html/${encodeURIComponent(title)}`;
  const res = await fetch(url, { headers: { 'accept': 'text/html' } });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  return res.text();
}

function countRecords(html) {
  // Prefer the summary table that explicitly lists "総合格闘技 戦績" with bold totals for 勝/敗
  // Fallback to row counting is omitted to avoid overcount; we only return values when confident.
  const tables = html.split(/<table[^>]*?>/i).slice(1).map(t => '<table>' + t);
  const isMmaSummary = (tbl) => /総合\s*格闘技\s*戦績|戦績/.test(tbl) && /<th[^>]*colspan/i.test(tbl);
  const clean = (s) => s
    .replace(/<script[\s\S]*?<\/script>/gi,'')
    .replace(/<style[\s\S]*?<\/style>/gi,'')
    .replace(/<[^>]+>/g,' ')
    .replace(/\s+/g,' ')
    .trim();
  for (const tbl of tables) {
    if (!isMmaSummary(tbl)) continue;
    const bWins = /<td[^>]*>\s*<b>(\d+)<\/b>\s*[^<]*?勝/.exec(tbl);
    const bLoss = /<td[^>]*>\s*<b>(\d+)<\/b>\s*[^<]*?敗/.exec(tbl);
    // Extract draws and NC as the last two numeric cells in the first data row (wins row)
    // Find wins row: it should contain "勝" and have multiple <td>
    const rows = tbl.split(/<tr[^>]*?>/i).slice(1).map(r => '<tr>' + r);
    let draws = null, ncs = null;
    for (const r of rows) {
      if (!/勝/.test(r)) continue;
      const nums = Array.from(r.matchAll(/>(\d+)</g)).map(m => parseInt(m[1],10));
      if (nums.length >= 3) {
        draws = nums[nums.length - 2];
        ncs = nums[nums.length - 1];
        break;
      }
    }
    if (bWins && bLoss) {
      return {
        wins: parseInt(bWins[1], 10),
        losses: parseInt(bLoss[1], 10),
        draws: draws ?? 0,
        ncs: ncs ?? 0
      };
    }
  }
  // Fallback: key/value record table like "総合格闘技 記録"
  const keyValTables = tables.filter((t) => /記録|勝利|敗戦|引き分け|無効試合/.test(t));
  for (const tbl of keyValTables) {
    const rows = tbl.split(/<tr[^>]*?>/i).slice(1).map((r) => '<tr>' + r);
    const getKV = (label) => {
      for (const r of rows) {
        if (new RegExp(label).test(r)) {
          const m = r.match(/<td[^>]*>(\d+)/i);
          if (m) return parseInt(m[1], 10);
        }
      }
      return null;
    };
    const wins = getKV('勝利');
    const losses = getKV('敗戦|敗');
    const draws = getKV('引き分け|ドロー');
    const ncs = getKV('無効試合');
    if (wins != null || losses != null || draws != null || ncs != null) {
      return {
        wins: wins ?? 0,
        losses: losses ?? 0,
        draws: draws ?? 0,
        ncs: ncs ?? 0,
      };
    }
  }
  return { wins: 0, losses: 0, draws: 0, ncs: 0 };
}

async function main(){
  const txt = await fs.readFile(fightersPath, 'utf-8');
  const fighters = JSON.parse(txt);
  let updated = 0, fails = 0;
  for (const f of fighters) {
    const w = f?.wikipedia;
    if (!w?.lang || !w?.title || w.lang !== 'ja') continue;
    try {
      const html = await fetchHtml(w.lang, w.title);
      const { wins, losses, draws, ncs } = countRecords(html);
      if (wins + losses + draws + ncs > 0) {
        f.record = { wins, losses, draws, noContests: ncs };
        updated++;
      }
      await sleep(150);
    } catch (e) {
      fails++;
    }
  }
  await fs.writeFile(fightersPath, JSON.stringify(fighters, null, 2) + '\n');
  console.log(`[records] updated=${updated} fails=${fails}`);
}

main().catch((e)=>{ console.error('[records] ERROR', e); process.exit(1); });
