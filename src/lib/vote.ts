import { useEffect, useState } from 'react';

export function generateMatchupKey(idA: string, idB: string): string {
return [idA, idB].sort().join('_');
}

const DAY_MS = 24 * 60 * 60 * 1000;

export function useVote(matchupKey: string, initial = 0) {
const [count, setCount] = useState(initial);
const [cooldown, setCooldown] = useState(false);

useEffect(() => {
const ts = localStorage.getItem(vote_${matchupKey});
if (ts && Date.now() - Number(ts) < DAY_MS) {
setCooldown(true);
}
}, [matchupKey]);

const vote = () => {
const ts = localStorage.getItem(vote_${matchupKey});
if (ts && Date.now() - Number(ts) < DAY_MS) {
setCooldown(true);
return;
}
setCount(c => c + 1);
localStorage.setItem(vote_${matchupKey}, String(Date.now()));
setCooldown(true);
};

return { count, vote, cooldown };
}
