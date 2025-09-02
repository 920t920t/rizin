export interface Fighter {
id: string;
name: string;
age?: number | null;
country?: string | null;
height_cm?: number | null;
weight_kg?: number | null;
wiki_lead?: string | null;
}

export interface FeaturedBout {
fighter_id: string;
opponent_id: string;
event: string;
result?: string | null;
opponent_name?: string;
}

export interface VoteCount {
matchup_key: string;
count: number;
}
