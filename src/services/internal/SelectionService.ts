import { DynamoDBService } from "./base/DynamoDBService";
import { inject } from "./dependency-injection/inject";
import { UserService } from "./UserService";
import { Identifier } from "../../interfaces/internal/io/Database";
import {
  Selection,
  User,
  UserGroup,
} from "../../interfaces/internal/data-models/fantasy";
import { Authorization } from "./authorization/Authorization";
import { NotAuthorizedException } from "./exceptions/NotAuthorizedException";
import { UserGroupService } from "./UserGroupService";
import { DateTimeHelper } from "./DateTimeHelper";
import { v4 } from "uuid";

/**
 * Selections table.
 */
export class SelectionService extends DynamoDBService<Selection> {
  public constructor(
    private userService = inject(UserService),
    private userGroupService = inject(UserGroupService)
  ) {
    super("selections");
  }

  public async makeSelection(
    userId: Identifier<User>,
    password: string,
    selection: Selection
  ) {
    await this.ready;
    const authorized = await Authorization.authorize(userId, password);

    if (!authorized) {
      throw new NotAuthorizedException("Not authorized");
    }

    const selections: Selection[] = await this.listSelectionsForUser(userId);

    const targetFriday = DateTimeHelper.getFridayOf(
      new Date(selection.forTimestamp)
    );

    let uuid;

    for (const oldSelection of selections) {
      const oldSelectionFriday = DateTimeHelper.getFridayOf(
        new Date(oldSelection.forTimestamp)
      );
      if (oldSelectionFriday.getTime() === targetFriday.getTime()) {
        uuid = oldSelection.id;
        break;
      }
    }

    selection.id = uuid || v4();
    selection.user = userId;

    await this.save(selection);
  }

  public async listSelectionsForUser(
    userId: Identifier<User>
  ): Promise<Selection[]> {
    return this.list({
      user: userId,
    });
  }

  public async listSelectionsForUserGroup(
    groupId: Identifier<UserGroup>
  ): Promise<Selection[]> {
    const group = await this.userGroupService.get(groupId);
    const userIds = group.users;

    const selections: Selection[] = [];

    for (const userId of userIds) {
      selections.push(...(await this.list({ user: userId })));
    }

    return selections;
  }
}
