import { BaseballPlayer } from "../../interfaces/internal/data-models/game";
import { DynamoDBService } from "./base/DynamoDBService";

/**
 * Level-2 abstraction for the players table in DynamoDB.
 */
export class BaseballPlayerService extends DynamoDBService<BaseballPlayer> {
  public constructor() {
    super("players");
  }

  public async listBaseballPlayers() {
    const accessor = await this.ready;
    return accessor.list();
  }
}
