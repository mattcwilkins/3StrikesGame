import { XhrClient } from "../../data-io/http/XhrClient";
import { BaseballTeam } from "../../interfaces/internal/data-models/game";
import { WebUIMemoryCache } from "../../services/internal/memory-cache/WebUIMemoryCache";

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
}
