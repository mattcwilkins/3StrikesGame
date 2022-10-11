import {
  BaseballPlayer,
  BaseballPlayerGameStats,
} from "../../interfaces/internal/data-models/game";
import { DynamoDBService } from "./base/DynamoDBService";
import { Identifier } from "../../interfaces/internal/io/Database";
import { BaseballPlayerService } from "./BaseballPlayerService";
import { Timing } from "./constants/Timing";
import { MlbDataService } from "../ingestion/MlbDataService";
import { inject } from "./dependency-injection/inject";

/**
 * For the gameStats table.
 */
export class BaseballGameStatsService extends DynamoDBService<BaseballPlayerGameStats> {
  public constructor(private playerService = inject(BaseballPlayerService)) {
    super("gameStats");
  }

  public async getGameStats(
    playerId: Identifier<BaseballPlayer>
  ): Promise<BaseballPlayerGameStats[]> {
    const player = await this.playerService.get(playerId);
    const gameDataTimestamp = player.gameDataTimestamp || 0;
    const now = Date.now();
    const dataAge = now - gameDataTimestamp;

    if (dataAge > Timing.ONE_DAY) {
      await inject(MlbDataService).loadGameStats(playerId);
      await this.playerService.save({
        id: playerId,
        gameDataTimestamp: Date.now(),
      });
    }

    const accessor = await this.ready;
    return accessor.list({
      playerId,
    });
  }
}
