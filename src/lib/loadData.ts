import fs from 'fs';
import path from 'path';

export function loadData<T>(file: string): T {
const filePath = path.join(process.cwd(), 'data', ${file}.json);
const raw = fs.readFileSync(filePath, 'utf-8');
return JSON.parse(raw) as T;
}
