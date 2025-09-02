import { Fighter } from '../types';
import FighterCard from './FighterCard';

export default function FighterList({ fighters }: { fighters: Fighter[] }) {
return (
<ul style={{ listStyle: 'none', padding: 0 }}>
{fighters.map(f => (
<FighterCard key={f.id} fighter={f} />
))}
</ul>
);
}
