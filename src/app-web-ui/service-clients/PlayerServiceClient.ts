import { XhrClient } from "../../data-io/http/XhrClient";
import { BaseballPlayer } from "../../interfaces/internal/data-models/game";
import { WebUIMemoryCache } from "../../services/internal/memory-cache/WebUIMemoryCache";

export class PlayerServiceClient {
  public constructor(
    private xhrClient = new XhrClient(),
    private webUiMemoryCache = new WebUIMemoryCache()
  ) {}

  public async getPlayers() {
    const data: Promise<BaseballPlayer[]> = this.webUiMemoryCache.get(
      "players",
      async () =>
        this.xhrClient.post(
          "https://i654hwgy0i.execute-api.us-east-1.amazonaws.com/prod/player",
          {}
        )
    );

    return data;
  }
}
