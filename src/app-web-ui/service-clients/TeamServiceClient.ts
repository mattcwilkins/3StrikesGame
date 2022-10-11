import { XhrClient } from "../../data-io/http/XhrClient";
import {
  BaseballPlayerGameStats,
  BaseballTeam,
  BaseballTeamDefensiveGamePerformance,
  Timestamp,
} from "../../interfaces/internal/data-models/game";
import { WebUIMemoryCache } from "../../services/internal/memory-cache/WebUIMemoryCache";
import { TeamId } from "../../interfaces/external/MlbDataApi";
import { GetGameStats } from "../../interfaces/internal/rpc/PlayerRpc";
import { DateTimeHelper } from "../../services/internal/DateTimeHelper";
import { Timing } from "../../services/internal/constants/Timing";
import { GetTeamScheduleScores } from "../../interfaces/internal/rpc/TeamRpc";

/**
 * Client to the team lambda.
 */
export class TeamServiceClient {
  public constructor(
    private xhrClient = new XhrClient(),
    private webUiMemoryCache = new WebUIMemoryCache(),
    private hostPrefix = "https://i654hwgy0i.execute-api.us-east-1.amazonaws.com/prod"
  ) {}

  public async getTeams() {
    const data: Promise<BaseballTeam[]> = this.webUiMemoryCache.get(
      "teams",
      async () => this.xhrClient.post(this.hostPrefix + "/team", {})
    );

    return data;
  }

  public async getSchedule(teamId: TeamId, weekOf: Timestamp = Date.now()) {
    const data: BaseballTeamDefensiveGamePerformance[] =
      await this.webUiMemoryCache.get(
        ["defensivePerformanceData", teamId],
        async () =>
          this.xhrClient.post(this.hostPrefix + "/team", {
            method: "getTeamSchedule",
            args: [teamId],
          } as GetTeamScheduleScores)
      );

    const fridayInWeek = DateTimeHelper.getFridayOf(new Date(weekOf)).getTime();
    const wednesdayAfter = fridayInWeek + Timing.SCORING_PERIOD_LENGTH;

    return data.filter(
      (game) => fridayInWeek < game.timestamp && game.timestamp < wednesdayAfter
    );
  }
}
