import fs from 'node:fs/promises';
import path from 'node:path';
import type { Bout, Fighter, VoteCounts } from './types';

const root = path.resolve(process.cwd());

async function readJson<T>(relPath: string): Promise<T> {
  const p = path.join(root, relPath);
  const txt = await fs.readFile(p, 'utf-8');
  return JSON.parse(txt) as T;
}

export async function loadFighters(): Promise<Fighter[]> {
  return readJson<Fighter[]>('data/fighters.json');
}

export async function loadBouts(): Promise<Bout[]> {
  return readJson<Bout[]>('data/featured_bouts.json');
}

export async function loadVotes(): Promise<VoteCounts> {
  try {
    return await readJson<VoteCounts>('data/votes.json');
  } catch {
    return {};
  }
}

