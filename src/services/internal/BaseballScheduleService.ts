import { BaseballTeamDefensiveGamePerformance } from "../../interfaces/internal/data-models/game";
import { DynamoDBService } from "./base/DynamoDBService";
import { TeamId } from "../../interfaces/external/MlbDataApi";
import { BaseballTeamService } from "./BaseballTeamService";
import { Timing } from "./constants/Timing";
import { inject } from "./dependency-injection/inject";
import { MlbDataService } from "../ingestion/MlbDataService";
import { MlbStatsApiV1ScheduleResponse } from "../../interfaces/external/MlbStatsApi";

/**
 * Schedules table.
 */
export class BaseballSchedulesService extends DynamoDBService<BaseballTeamDefensiveGamePerformance> {
  public constructor(private baseballTeamService = new BaseballTeamService()) {
    super("schedules");
  }

  public async listScheduleForTeam(teamId: TeamId) {
    const team = await this.baseballTeamService.get(teamId);
    const teamDataTimestamp = team.timestamp || 0;
    const now = Date.now();
    const dataAge = now - teamDataTimestamp;

    if (dataAge > Timing.ONE_HOUR) {
      await inject(MlbDataService).loadTeamScheduleScores(teamId);
      await this.baseballTeamService.save({
        id: teamId,
        timestamp: Date.now(),
      });
    }
    const accessor = await this.ready;
    return accessor.list({
      teamId,
    });
  }
}
