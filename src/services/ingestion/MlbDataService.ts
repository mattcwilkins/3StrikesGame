import { NodeClient } from "../../data-io/http/NodeClient";
import {
  MlbDataRosterResponse,
  MlbDataTeamAllSeasonResponse,
} from "../../interfaces/external/BaseballDataService";
import { PlayerDataMapper } from "./mapper/PlayerDataMapper";
import { BaseballPlayerService } from "../internal/BaseballPlayerService";
import { LambdaMemoryCache } from "../internal/memory-cache/LambdaMemoryCache";
import { BaseballTeamService } from "../internal/BaseballTeamService";
import { TeamId } from "../../interfaces/external/MlbDataApi";
import { Identifier } from "../../interfaces/internal/io/Database";
import { BaseballPlayer } from "../../interfaces/internal/data-models/game";
import {
  MlbStatsApiV1PeopleStatsResponse,
  MlbStatsApiV1ScheduleResponse,
} from "../../interfaces/external/MlbStatsApi";
import { BaseballGameStatsService } from "../internal/BaseballGameStatsService";
import { inject } from "../internal/dependency-injection/inject";
import { MetricsService } from "../internal/MetricsService";
import { BaseballSchedulesService } from "../internal/BaseballScheduleService";
import { Timing } from "../internal/constants/Timing";

/**
 * Client to the MLBAM lookup-service.
 */
export class MlbDataService {
  public constructor(
    private client = new NodeClient(),
    private host = "https://lookup-service-prod.mlb.com",
    private baseballPlayerService = inject(BaseballPlayerService),
    private baseballTeamService = inject(BaseballTeamService),
    private baseballGameStatsService = inject(BaseballGameStatsService),
    private baseballSchedulesService = inject(BaseballSchedulesService),
    private metricsService = inject(MetricsService),
    private cache = new LambdaMemoryCache()
  ) {}

  public async loadTeamsAndPlayers() {
    const teams = await this.teamAllSeason();
    const { baseballPlayerService } = this;
    for (const { team_id, name_display_full, franchise_code } of teams
      .team_all_season.queryResults.row) {
      const roster = await this.roster(team_id);
      const players = roster.roster_40.queryResults.row;

      for (const player of players) {
        const localForm = PlayerDataMapper.mapPlayer(player);
        console.info(
          "Saving player data:",
          player.team_name,
          player.name_display_first_last
        );
        await baseballPlayerService.save(localForm);
      }

      console.info("Saving team data:", franchise_code);
      await this.baseballTeamService.save({
        id: team_id,
        name: name_display_full,
        franchiseCode: franchise_code,
        roster: players.map((player) => player.player_id),
        timestamp: 0,
      });
    }
  }

  public async teamAllSeason(
    season: string = new Date().getFullYear().toString(),
    all_star_sw: string = "N",
    sort_order: string = "name_asc"
  ): Promise<MlbDataTeamAllSeasonResponse> {
    const path = `/json/named.team_all_season.bam?sport_code='mlb'&all_star_sw='${all_star_sw}'&sort_order='${sort_order}'&season='${season}'`;
    return this.cache.get("teamAllSeason", () => {
      this.metricsService.increment(
        this.host + "/json/named.team_all_season.bam"
      );
      return this.client.get(this.host + path);
    });
  }

  public async roster(teamId: TeamId): Promise<MlbDataRosterResponse> {
    const path = `/json/named.roster_40.bam?team_id=${teamId}`;
    return this.cache.get(["roster", teamId], () => {
      this.metricsService.increment(this.host + "/json/named.roster_40.bam");
      return this.client.get(this.host + path);
    });
  }

  public async loadGameStats(
    playerId: Identifier<BaseballPlayer>,
    season: string = new Date().getFullYear().toString()
  ): Promise<MlbStatsApiV1PeopleStatsResponse> {
    const path =
      `https://statsapi.mlb.com/api/v1/people/${playerId}/stats?stats=gameLog&leagueListId=mlb_hist` +
      `&group=hitting&gameType=R&sitCodes=1,2,3,4,5,6,7,8,9,10,11,12&season=${season}&language=en`;
    const stats = await this.cache.get(["gameStats", playerId], () => {
      this.metricsService.increment(
        "https://statsapi.mlb.com/api/v1/people/.../stats"
      );
      return this.client.get(path);
    });

    for (const game of stats.stats.find(
      (stat) =>
        stat.type.displayName === "gameLog" &&
        stat.group.displayName === "hitting"
    )?.splits || []) {
      await this.baseballGameStatsService.save(
        PlayerDataMapper.mapGameStats(game)
      );
    }
    return stats;
  }

  public async loadTeamScheduleScores(
    teamId: TeamId,
    season: string = new Date().getFullYear().toString()
  ): Promise<MlbStatsApiV1ScheduleResponse> {
    const path =
      `https://statsapi.mlb.com/api/v1/schedule?lang=en&sportId=1&season=${season}` +
      `&teamId=${teamId}&eventTypes=primary&scheduleTypes=games`;
    const schedule = await this.cache.get(["schedules", teamId], async () => {
      await this.metricsService.increment(
        "https://statsapi.mlb.com/api/v1/schedule"
      );
      return this.client.get(path);
    });

    for (const date of schedule.dates) {
      for (const game of date.games) {
        await this.baseballSchedulesService.save({
          id: teamId + "_" + game.gamePk,
          teamId,
          displayDate: date.date,
          timestamp: new Date(date.date).getTime() + Timing.HALF_DAY,
          runsAllowed:
            (String(game.teams.home.team.id) === teamId
              ? game.teams.away.score
              : game.teams.home.score) || 0,
        });
      }
    }

    return schedule;
  }
}
