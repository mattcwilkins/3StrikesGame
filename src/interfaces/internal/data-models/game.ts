/**
 * Milliseconds unix (JS).
 */
import { Identifier } from "../io/Database";

export type Timestamp = number;

export type BaseballPlayer = {
  id: Identifier;
  name: string;
  playingPositions: BaseballPlayerPosition[];
  timestamp: Timestamp;
  atBats: Identifier<BaseballPlayerAtBat>[];
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
  name: string;
  roster: Identifier<BaseballPlayer>[];
  timestamp: Timestamp;
  outings: Identifier<BaseballTeamDefensiveGamePerformance>[];
};

export type ThreeStriker = {
  id: Identifier; // username.
  timestamp: Timestamp;
  strikes: number;
  selections: Identifier<ThreeStrikeSelection>[];
};

export type ThreeStrikeSelection = {
  id: Identifier;
  firstBaseFielder: Identifier<BaseballPlayer>;
  secondBaseFielder: Identifier<BaseballPlayer>;
  thirdBaseFielder: Identifier<BaseballPlayer>;
  shortStop: Identifier<BaseballPlayer>;
  outfield: Identifier<BaseballPlayer>;

  defensiveTeam: Identifier<BaseballTeam>;

  timestamp: Timestamp; // when selection was created.

  score: number;
  struck: boolean; // whether this selection resulted in a strike for the 3Striker.
};

/**
 * Score is total bases.
 */
export type BaseballPlayerAtBat = {
  id: Identifier;
  totalBases: number;
  walked: boolean;
  hitByPitch: boolean;
  result: string; // for display purposes.
  timestamp: Timestamp; // when at bat was recorded.
};

/**
 * Score is 25 minus runs allowed, minimum of zero.
 */
export type BaseballTeamDefensiveGamePerformance = {
  id: Identifier;
  runsAllowed: number;
  timestamp: Timestamp; // when game was concluded.
};