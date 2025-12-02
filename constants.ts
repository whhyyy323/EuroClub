import { TeamId, ThemeConfig } from './types';

export const TEAMS: Record<TeamId, ThemeConfig> = {
  [TeamId.MAN_UTD]: {
    id: TeamId.MAN_UTD,
    name: "Manchester United",
    primaryColor: "bg-red-700",
    secondaryColor: "bg-black",
    accentColor: "text-red-700",
    gradient: "from-red-900 to-black",
    logoPlaceholder: "https://upload.wikimedia.org/wikipedia/en/7/7a/Manchester_United_FC_crest.svg"
  },
  [TeamId.ARSENAL]: {
    id: TeamId.ARSENAL,
    name: "Arsenal FC",
    primaryColor: "bg-red-600",
    secondaryColor: "bg-white",
    accentColor: "text-red-600",
    gradient: "from-red-600 to-red-400",
    logoPlaceholder: "https://upload.wikimedia.org/wikipedia/en/5/53/Arsenal_FC.svg"
  },
  [TeamId.BAYERN]: {
    id: TeamId.BAYERN,
    name: "FC Bayern Munich",
    primaryColor: "bg-red-800",
    secondaryColor: "bg-blue-900",
    accentColor: "text-red-800",
    gradient: "from-red-700 via-red-800 to-blue-900",
    logoPlaceholder: "https://upload.wikimedia.org/wikipedia/commons/1/1b/FC_Bayern_M%C3%BCnchen_logo_%282017%29.svg"
  },
  [TeamId.LIVERPOOL]: {
    id: TeamId.LIVERPOOL,
    name: "Liverpool FC",
    primaryColor: "bg-red-700",
    secondaryColor: "bg-teal-900",
    accentColor: "text-red-700",
    gradient: "from-red-700 to-red-900",
    logoPlaceholder: "https://upload.wikimedia.org/wikipedia/en/0/0c/Liverpool_FC.svg"
  }
};