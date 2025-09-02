import { GetStaticProps } from 'next';
import QuizForm from '../../components/QuizForm';
import { loadData } from '../../lib/loadData';
import { Fighter } from '../../types';

interface Props {
fighters: Fighter[];
}

export default function QuizPage({ fighters }: Props) {
return <QuizForm fighters={fighters} />;
}

export const getStaticProps: GetStaticProps<Props> = async () => {
const fighters = loadData<Fighter[]>('fighters');
return { props: { fighters } };
};
