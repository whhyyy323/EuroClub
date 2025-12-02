export enum TeamId {
  MAN_UTD = 'MAN_UTD',
  ARSENAL = 'ARSENAL',
  BAYERN = 'BAYERN',
  LIVERPOOL = 'LIVERPOOL',
}

export interface Player {
  name: string;
  position: string;
  number: number;
  nationality: string;
}

export interface Fixture {
  opponent: string;
  date: string;
  competition: string;
  venue: 'Home' | 'Away';
  time: string;
}

export interface TeamData {
  teamName: string;
  squad: Player[];
  fixtures: Fixture[];
  lastUpdated: number;
  sources?: { title: string; uri: string }[];
}

export interface ThemeConfig {
  id: TeamId;
  name: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  gradient: string;
  logoPlaceholder: string; // URL for the logo
}