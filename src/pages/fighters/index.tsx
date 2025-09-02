import { GetStaticProps } from 'next';
import FighterList from '../../components/FighterList';
import { loadData } from '../../lib/loadData';
import { Fighter } from '../../types';

interface Props {
fighters: Fighter[];
}

export default function FightersPage({ fighters }: Props) {
return <FighterList fighters={fighters} />;
}

export const getStaticProps: GetStaticProps<Props> = async () => {
const fighters = loadData<Fighter[]>('fighters');
return { props: { fighters } };
};
