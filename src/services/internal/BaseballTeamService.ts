import {
  BaseballPlayer,
  BaseballTeam,
} from "../../interfaces/internal/data-models/game";
import { DynamoDBService } from "./base/DynamoDBService";
import { Identifier, Row } from "../../interfaces/internal/io/Database";

/**
 * Level-2 abstraction for the teams table in DynamoDB.
 */
export class BaseballTeamService extends DynamoDBService<BaseballTeam> {
  public constructor() {
    super("teams");
  }

  public async listBaseballTeams() {
    const accessor = await this.ready;
    return accessor.list();
  }
}
