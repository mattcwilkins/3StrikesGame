import { XhrClient } from "../../data-io/http/XhrClient";
import {
  BaseballPlayer,
  BaseballPlayerGameStats,
  Timestamp,
} from "../../interfaces/internal/data-models/game";
import { WebUIMemoryCache } from "../../services/internal/memory-cache/WebUIMemoryCache";
import { Identifier } from "../../interfaces/internal/io/Database";
import { GetGameStats } from "../../interfaces/internal/rpc/PlayerRpc";
import { Timing } from "../../services/internal/constants/Timing";
import { DateTimeHelper } from "../../services/internal/DateTimeHelper";

/**
 * Client to the player lambda.
 */
export class PlayerServiceClient {
  public constructor(
    private xhrClient = new XhrClient(),
    private webUiMemoryCache = new WebUIMemoryCache(),
    private hostPrefix = "https://i654hwgy0i.execute-api.us-east-1.amazonaws.com/prod"
  ) {}

  public async getPlayers() {
    const data: Promise<BaseballPlayer[]> = this.webUiMemoryCache.get(
      "players",
      async () => this.xhrClient.post(this.hostPrefix + "/player", {})
    );

    return data;
  }

  public async getPlayerGameStats(
    playerId: Identifier<BaseballPlayer>,
    weekOf: Timestamp = Date.now()
  ): Promise<BaseballPlayerGameStats[]> {
    const data: BaseballPlayerGameStats[] = await this.webUiMemoryCache.get(
      ["playerGameData", playerId],
      async () =>
        this.xhrClient.post(this.hostPrefix + "/player", {
          method: "getGameStats",
          args: [playerId],
        } as GetGameStats)
    );

    const fridayInWeek = DateTimeHelper.getFridayOf(new Date(weekOf)).getTime();
    const wednesdayAfter = fridayInWeek + Timing.SCORING_PERIOD_LENGTH;

    return data.filter(
      (gameStats) =>
        fridayInWeek < gameStats.timestamp &&
        gameStats.timestamp < wednesdayAfter
    );
  }
}
