import Link from 'next/link';

export default function Header() {
return (
<nav style={{ padding: '1rem', borderBottom: '1px solid #ccc' }}>
<Link href="/fighters">ファイター一覧</Link>
{" | "}
<Link href="/quiz">クイズ</Link>
</nav>
);
}
