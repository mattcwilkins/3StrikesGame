import { NodeClient } from "../../data-io/http/NodeClient";
import {
  MLBDataRosterResponse,
  MLBDataTeamAllSeasonResponse,
} from "../../interfaces/external/BaseballDataService";
import { PlayerDataMapper } from "./mapper/PlayerDataMapper";
import { BaseballPlayerService } from "../internal/BaseballPlayerService";
import { LambdaMemoryCache } from "../internal/memory-cache/LambdaMemoryCache";
import { BaseballTeamService } from "../internal/BaseballTeamService";
import { TeamId } from "../../interfaces/external/MlbDataApi";

/**
 * Client to the MLBAM lookup-service.
 */
export class MLBDataService {
  public constructor(
    private client = new NodeClient(),
    private host = "https://lookup-service-prod.mlb.com",
    private baseballPlayerService = new BaseballPlayerService(),
    private baseballTeamService = new BaseballTeamService(),
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
        timestamp: Date.now(),
      });
    }
  }

  public async teamAllSeason(
    season: string = new Date().getFullYear().toString(),
    all_star_sw: string = "N",
    sort_order: string = "name_asc"
  ): Promise<MLBDataTeamAllSeasonResponse> {
    const path = `/json/named.team_all_season.bam?sport_code='mlb'&all_star_sw='${all_star_sw}'&sort_order='${sort_order}'&season='${season}'`;
    return this.cache.get("teamAllSeason", () =>
      this.client.get(this.host + path)
    );
  }

  public async roster(teamId: TeamId): Promise<MLBDataRosterResponse> {
    const path = `/json/named.roster_40.bam?team_id=${teamId}`;
    return this.cache.get(["roster", teamId], () =>
      this.client.get(this.host + path)
    );
  }
}
