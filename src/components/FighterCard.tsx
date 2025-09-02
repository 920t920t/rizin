import Link from 'next/link';
import { Fighter } from '../types';

export default function FighterCard({ fighter }: { fighter: Fighter }) {
return (
<li style={{ border: '1px solid #ccc', margin: '0.5rem', padding: '0.5rem' }}>
<Link href={/fighters/${fighter.id}}>{fighter.name}</Link>
<div>年齢: {fighter.age ?? '—'}</div>
<div>国籍: {fighter.country ?? '—'}</div>
</li>
);
}
