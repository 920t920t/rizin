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
  let wins = 0, losses = 0, draws = 0, ncs = 0;
  const tables = html.split(/<table[^>]*>/i).slice(1).map(t => '<table>' + t);
  const isMmaTable = (tbl) => /総合|格闘技|MMA|戦績/.test(tbl) && /<tr/i.test(tbl);
  const rowsFrom = (tbl) => tbl.split(/<tr[^>]*>/i).slice(1).map(r => '<tr>' + r);
  const getText = (s) => s
    .replace(/<script[\s\S]*?<\/script>/gi,'')
    .replace(/<style[\s\S]*?<\/style>/gi,'')
    .replace(/<[^>]+>/g,' ')
    .replace(/&nbsp;|&amp;|&lt;|&gt;|&quot;|&#\d+;?/g,' ')
    .trim();

  const targetTables = tables.filter(isMmaTable);
  const scanTables = targetTables.length ? targetTables : tables;

  for (const tbl of scanTables) {
    for (const row of rowsFrom(tbl)) {
      const text = getText(row);
      if (/対戦相手|Result|Opponent|戦績|試合|通算/i.test(text)) continue;
      if (/勝利|勝ち|\b勝\b/.test(text)) wins++;
      else if (/敗北|敗け|\b敗\b/.test(text)) losses++;
      else if (/引き分け|ドロー|\b分\b/.test(text)) draws++;
      else if (/無効試合|ノーコンテスト|\bNC\b/.test(text)) ncs++;
    }
  }
  return { wins, losses, draws, ncs };
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

