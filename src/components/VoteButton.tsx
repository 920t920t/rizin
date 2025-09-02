import { useVote, generateMatchupKey } from '../lib/vote';

interface Props {
selfId: string;
opponentId: string;
initial?: number;
}

export default function VoteButton({ selfId, opponentId, initial = 0 }: Props) {
const matchup = generateMatchupKey(selfId, opponentId);
const { count, vote, cooldown } = useVote(matchup, initial);

return (
<button onClick={vote} disabled={cooldown} style={{ marginLeft: '1rem' }}>
見たい ({count})
</button>
);
}
