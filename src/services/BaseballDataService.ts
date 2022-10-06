import { NodeClient } from "../data-io/http/NodeClient";
import { ListTeamsResponse } from "../interfaces/internal/services/BaseballDataService";

export class BaseballDataService {
  public constructor(
    private client = new NodeClient(),
    private host = "https://lookup-service-prod.mlb.com"
  ) {}

  public async listTeams(
    season: string = new Date().getFullYear().toString(),
    all_star_sw: string = "N",
    sort_order: string = "name_asc"
  ): Promise<ListTeamsResponse> {
    const path = `/json/named.team_all_season.bam?sport_code='mlb'&all_star_sw='${all_star_sw}'&sort_order='${sort_order}'&season='${season}'`;
    return this.client.get(this.host + path);
  }

  public async listPlayers(teamId: string) {
    const path = `/json/named.roster_40.bam?team_id=${teamId}`;
    return this.client.get(this.host + path);
  }
}
