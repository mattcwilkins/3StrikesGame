import { MemoryCache } from "./MemoryCache";
import {
  MlbDataRosterResponse,
  MlbDataTeamAllSeasonResponse,
} from "../../../interfaces/external/BaseballDataService";
import { TeamId } from "../../../interfaces/external/MlbDataApi";
import { Identifier } from "../../../interfaces/internal/io/Database";
import { BaseballPlayer } from "../../../interfaces/internal/data-models/game";
import { MlbStatsApiV1PeopleStatsResponse } from "../../../interfaces/external/MlbStatsApi";

export type LambdaMemoryCacheData = {
  teamAllSeason: MlbDataTeamAllSeasonResponse;
  roster: {
    [rosterWithTeamId in TeamId]: MlbDataRosterResponse;
  };
  gameStats: {
    [playerId: Identifier<BaseballPlayer>]: MlbStatsApiV1PeopleStatsResponse;
  };
};

/**
 * Memory cache for Lambda, to avoid requesting identical data twice in the same transaction.
 */
export class LambdaMemoryCache extends MemoryCache<LambdaMemoryCacheData> {
  public static instance: LambdaMemoryCache = new LambdaMemoryCache();
  public static getInstance() {
    return LambdaMemoryCache.instance;
  }

  public constructor() {
    super();
    return LambdaMemoryCache.getInstance();
  }

  protected data = {
    teamAllSeason: undefined,
    roster: {} as Record<TeamId, MlbDataRosterResponse>,
    gameStats: {} as Record<
      Identifier<BaseballPlayer>,
      MlbStatsApiV1PeopleStatsResponse
    >,
  };
}
