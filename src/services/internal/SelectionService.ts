import { DynamoDBService } from "./base/DynamoDBService";
import { inject } from "./dependency-injection/inject";
import { UserService } from "./UserService";
import { Identifier } from "../../interfaces/internal/io/Database";
import {
  Selection,
  SelectionSubmission,
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
    submission: SelectionSubmission
  ) {
    await this.ready;
    const authorized = await Authorization.authorize(userId, password);

    if (!authorized) {
      throw new NotAuthorizedException("Not authorized");
    }

    const selections: Selection[] = await this.listSelectionsForUser(userId);

    const targetFriday = DateTimeHelper.getFridayOf(
      new Date(submission.forTimestamp)
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

    await this.save({
      ...submission,
      score: 0,
      struck: false,
      createdTimestamp: Date.now(),
      id: uuid || v4(),
      user: userId,
    });
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
