import { ReactNode } from 'react';
import Header from './Header';
import Footer from './Footer';

export default function Layout({ children }: { children: ReactNode }) {
return (
<div>
<Header />
<main style={{ padding: '1rem' }}>{children}</main>
<Footer />
</div>
);
}
