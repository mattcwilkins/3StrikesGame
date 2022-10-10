import { XhrClient } from "../../data-io/http/XhrClient";
import { BaseballTeam } from "../../interfaces/internal/data-models/game";
import { WebUIMemoryCache } from "../../services/internal/memory-cache/WebUIMemoryCache";

export class TeamServiceClient {
  public constructor(
    private xhrClient = new XhrClient(),
    private webUiMemoryCache = new WebUIMemoryCache()
  ) {}

  public async getTeams() {
    const data: Promise<BaseballTeam[]> = this.webUiMemoryCache.get(
      "teams",
      async () =>
        this.xhrClient.post(
          "https://i654hwgy0i.execute-api.us-east-1.amazonaws.com/prod/team",
          {}
        )
    );

    return data;
  }
}
