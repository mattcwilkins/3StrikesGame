import { Identifier } from "../internal/io/Database";
import { BaseballPlayer, BaseballTeam } from "../internal/data-models/game";

export type MlbStatsApiV1PeopleStatsResponse = {
  copyright: string;
  stats: MlbStatsApiStat[];
};

export type MlbStatsApiStat = {
  type: {
    displayName: "gameLog" | string;
  };
  group: {
    displayName: "hitting" | string;
  };
  exemptions: [];
  splits: MlbStatsApiGameData[];
};

export type MlbStatsApiGameData = {
  season: string;
  date: string; // YYYY-MM-DD
  gameType: "R" | string;
  isHome: boolean;
  isWin: boolean;
  stat: MlbStatsApiGameStatBatter;
  positionsPlayed: MlbStatsApiPositionPlayed[];
  player: MlbStatsApiPlayerData;
  league: {
    id: number;
    name: string; // e.g. 'American League'
    link: string;
  };
  sport: {
    id: 1;
    link: string;
    abbreviation: "MLB";
  };
  team: MlbStatsApiTeamData;
  opponent: MlbStatsApiTeamData;
  game: {
    gamePk: number;
    link: string;
    content: {
      link: string;
    };
    gameNumber: number;
    dayNight: "day" | "night";
  };
};

export type MlbStatsApiPositionPlayed = {
  code: string; // e.g. 9
  name: string; // 'Outfielder'
  type: string; // e.g. 'Outfielder'
  abbreviation: string; // e.g. 'RF'
};

export type MlbStatsApiPlayerData = {
  id: Identifier<BaseballPlayer>;
  fullName: string; // First Last
  link: string;
};

export type MlbStatsApiTeamData = {
  id: Identifier<BaseballTeam>;
  name: string;
  link: string;
};

export type MlbStatsApiGameStatBatter = {
  gamesPlayed: number;
  groundOuts: number;
  airOuts: number;
  runs: number;
  doubles: number;
  triples: number;
  homeRuns: number;
  strikeOuts: number;
  baseOnBalls: number;
  intentionalWalks: number;
  hits: number;
  hitByPitch: number;
  avg: string; // .123
  atBats: number;
  obp: string; // .123
  slg: string; // .123
  ops: string; // .123
  caughtStealing: number;
  stolenBases: number;
  stolenBasePercentage: string; // .123
  groundIntoDoublePlay: number;
  groundIntoTriplePlay: number;
  numberOfPitches: number;
  plateAppearances: number;
  totalBases: number;
  rbi: number;
  leftOnBase: number;
  sacBunts: number;
  sacFlies: number;
  babip: string; // .123
  groundOutsToAirouts: string; // 2.00
  catchersInterference: number;
  atBatsPerHomeRun: string; // 4.00
};
