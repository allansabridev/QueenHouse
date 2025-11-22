export interface Boss {
  id: string;
  name: string;
  role: string;
  description: string;
  image: string;
  tiktok: string;
  handle: string;
}

export interface CandidateStats {
  drama: number;
  strategy: number;
  popularity: number;
}

export interface Candidate {
  id: string;
  name: string;
  status: 'PRESENT' | 'ELIMINATED' | 'LEFT';
  image: string;
  tiktok: string;
  handle: string;
  age: number;
  followers: string;
  bio: string;
  ranking?: number;
  stats?: CandidateStats;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export type VoteTemplate = 'POSTERS' | 'GRID' | 'LIST';

export interface NavConfig {
  homeLabel: string;
  candidatesLabel: string;
  voteLabel: string;
  liveLabel: string;
}

export interface BannerConfig {
  isVisible: boolean;
  text: string;
  type: 'INFO' | 'ALERT' | 'LIVE';
}

export interface SiteConfig {
  nav: NavConfig;
  voteTemplate: VoteTemplate;
  countdownTarget: string; // ISO Date string
  banner: BannerConfig;
}

export interface LiveConfig {
  isLive: boolean;
  title: string;
  episodeInfo: string;
  videoEmbedUrl?: string; // If empty, show placeholder
  nextEventTime?: string;
}