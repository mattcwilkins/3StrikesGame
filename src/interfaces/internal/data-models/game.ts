import { Identifier } from "../io/Database";

/**
 * Milliseconds unix (JS).
 */
export type Timestamp = number;

export type BaseballPlayer = {
  id: Identifier;
  name: string;
  playingPositions: BaseballPlayerPosition[];
  timestamp: Timestamp;
  gameDataTimestamp: Timestamp;
  gameStats: Identifier<BaseballPlayerGameStats>[];
  team: Identifier<BaseballTeam>;
};

export type BaseballPlayerPosition =
  | "first"
  | "second"
  | "third"
  | "short"
  | "left"
  | "center"
  | "right"
  | "infield"
  | "outfield"
  | "fielder"
  | "dh"
  | "pitcher"
  | "catcher";

export type BaseballTeam = {
  id: Identifier;
  name: string; // full-name.
  franchiseCode: string; // 3-letter.
  roster: Identifier<BaseballPlayer>[];
  timestamp: Timestamp;
  outings: Identifier<BaseballTeamDefensiveGamePerformance>[];
};

/**
 * Score is total bases and any reached-base scenarios.
 */
export type BaseballPlayerGameStats = {
  id: Identifier;
  playerId: Identifier<BaseballPlayer>;
  totalBases: number;
  walks: number;
  hitByPitches: number;
  result: string; // for display purposes.
  timestamp: Timestamp; // when at bat was recorded.
  displayDate: string;
  team?: string;
  opponent?: string;

  // optional additional stat data.
  steals?: number;
  sacBunts?: number;
  sacFlies?: number;
  gidp?: number;
  gitp?: number;
  go?: number;
  fo?: number;
  runs?: number;
  hits?: number;
  doubles?: number;
  triples?: number;
  homeRuns?: number;
};

/**
 * Score is 25 minus runs allowed, minimum of zero.
 */
export type BaseballTeamDefensiveGamePerformance = {
  id: Identifier;
  teamId: Identifier<BaseballTeam>;
  runsAllowed: number;
  displayDate: string;
  timestamp: Timestamp; // when game was concluded.
};
