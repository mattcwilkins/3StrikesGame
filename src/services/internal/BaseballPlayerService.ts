import { BaseballPlayer } from "../../interfaces/internal/data-models/game";
import { DynamoDBService } from "./base/DynamoDBService";
import { Identifier, Row } from "../../interfaces/internal/io/Database";

export class BaseballPlayerService extends DynamoDBService<BaseballPlayer> {
  public constructor() {
    super("players");
  }

  public async listBaseballPlayers() {
    const accessor = await this.ready;
    return accessor.list();
  }

  public async save(
    player: Row<BaseballPlayer>
  ): Promise<Identifier<BaseballPlayer>> {
    const accessor = await this.ready;
    return accessor.set(player);
  }
}
