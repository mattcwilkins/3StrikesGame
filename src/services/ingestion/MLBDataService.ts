import { NodeClient } from "../../data-io/http/NodeClient";
import {
  MLBDataRosterResponse,
  MLBDataTeamAllSeasonResponse,
} from "../../interfaces/external/BaseballDataService";
import { PlayerDataMapper } from "./mapper/PlayerDataMapper";
import { BaseballPlayerService } from "../internal/BaseballPlayerService";

export class MLBDataService {
  public constructor(
    private client = new NodeClient(),
    private host = "https://lookup-service-prod.mlb.com",
    private baseballPlayerService = new BaseballPlayerService()
  ) {}

  public async loadPlayers() {
    const teams = await this.teamAllSeason();
    const { baseballPlayerService } = this;
    for (const { team_id } of teams.team_all_season.queryResults.row) {
      const roster = await this.roster(team_id);
      const players = roster.roster_40.queryResults.row;
      for (const player of players) {
        const localForm = PlayerDataMapper.mapPlayer(player);

        console.info("Saving player:", JSON.stringify(localForm, null, 2));
        await baseballPlayerService.save(localForm);
      }
    }
  }

  public async teamAllSeason(
    season: string = new Date().getFullYear().toString(),
    all_star_sw: string = "N",
    sort_order: string = "name_asc"
  ): Promise<MLBDataTeamAllSeasonResponse> {
    const path = `/json/named.team_all_season.bam?sport_code='mlb'&all_star_sw='${all_star_sw}'&sort_order='${sort_order}'&season='${season}'`;
    return this.client.get(this.host + path);
  }

  public async roster(teamId: string): Promise<MLBDataRosterResponse> {
    const path = `/json/named.roster_40.bam?team_id=${teamId}`;
    return this.client.get(this.host + path);
  }
}
