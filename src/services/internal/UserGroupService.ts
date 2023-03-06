import { DynamoDBService } from "./base/DynamoDBService";
import { UserGroup } from "../../interfaces/internal/data-models/fantasy";

/**
 * UserGroups table.
 */
export class UserGroupService extends DynamoDBService<UserGroup> {
  public constructor() {
    super("userGroups");
  }
}
