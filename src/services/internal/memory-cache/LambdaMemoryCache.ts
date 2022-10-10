import { MemoryCache } from "./MemoryCache";
import {
  MLBDataRosterResponse,
  MLBDataTeamAllSeasonResponse,
} from "../../../interfaces/external/BaseballDataService";
import { TeamId } from "../../../interfaces/external/MlbDataApi";

export type LambdaMemoryCacheData = {
  teamAllSeason: MLBDataTeamAllSeasonResponse;
  roster: {
    [rosterWithTeamId in TeamId]: MLBDataRosterResponse;
  };
};

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
    roster: {} as Record<TeamId, MLBDataRosterResponse>,
  };
}
