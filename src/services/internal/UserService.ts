import { DynamoDBService } from "./base/DynamoDBService";
import { User } from "../../interfaces/internal/data-models/fantasy";

/**
 * Users table.
 */
export class UserService extends DynamoDBService<User> {
  public constructor() {
    super("users");
  }
}
