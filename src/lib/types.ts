export interface Fighter {
  id: string;
  name: string;
  kana?: string | null;
  enName?: string | null;
  birthDate?: string | null;
  weightClass?: string | null;
  affiliation?: string | null;
  record?: {
    wins?: number | null;
    losses?: number | null;
    draws?: number | null;
    noContests?: number | null;
  } | null;
  wikipedia?: {
    title?: string | null;
    lang?: string | null;
    url?: string | null;
    lead?: string | null;
  } | null;
}

export interface Bout {
  id: string;
  fighterId: string;
  opponentId: string;
  date?: string | null;
  event?: string | null;
  notes?: string | null;
}

export type VoteCounts = Record<string, number>;

export interface ExportedVotes {
  exportedAt: string;
  cooldownMs: number;
  votes: Record<string, number>;
}

export interface QuizQuestion {
  id: string;
  text: string;
  choices: string[];
  answerIndex: number;
  meta?: Record<string, string>;
}

