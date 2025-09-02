import { useState } from 'react';
import { Fighter } from '../types';

export default function QuizForm({ fighters }: { fighters: Fighter[] }) {
const [index] = useState(() => Math.floor(Math.random() * fighters.length));
const fighter = fighters[index];
const [answer, setAnswer] = useState('');
const [result, setResult] = useState<string | null>(null);

const onSubmit = (e: React.FormEvent) => {
e.preventDefault();
setResult(answer.trim() === fighter.name ? '正解!' : '不正解');
};

return (
<form onSubmit={onSubmit}>
<p>{fighter.wiki_lead ?? '—'}</p>
<input
type="text"
value={answer}
onChange={e => setAnswer(e.target.value)}
placeholder="名前を入力"
/>
<button type="submit">回答</button>
{result && <p>{result}</p>}
</form>
);
}
