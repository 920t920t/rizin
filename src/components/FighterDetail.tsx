import { Fighter, FeaturedBout, VoteCount } from '../types';
import VoteButton from './VoteButton';
import { generateMatchupKey } from '../lib/vote';

interface Props {
fighter: Fighter;
bouts: FeaturedBout[];
votes: VoteCount[];
}

export default function FighterDetail({ fighter, bouts, votes }: Props) {
const voteMap = Object.fromEntries(votes.map(v => [v.matchup_key, v.count]));
return (
<div>
<h1>{fighter.name}</h1>
<p>{fighter.wiki_lead ?? '—'}</p>
<ul>
<li>年齢: {fighter.age ?? '—'}</li>
<li>国籍: {fighter.country ?? '—'}</li>
<li>身長: {fighter.height_cm ?? '—'}cm</li>
<li>体重: {fighter.weight_kg ?? '—'}kg</li>
</ul>
<h2>注目の対戦</h2>
<ul>
{bouts.map(b => {
const matchup = generateMatchupKey(fighter.id, b.opponent_id);
const initial = voteMap[matchup] ?? 0;
return (
<li key={b.opponent_id}>
vs {b.opponent_name ?? b.opponent_id} ({b.event}) {b.result ?? ''}
<VoteButton opponentId={b.opponent_id} selfId={fighter.id} initial={initial} />
</li>
);
})}
</ul>
</div>
);
}
