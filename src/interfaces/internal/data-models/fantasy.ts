import { BaseballPlayer, BaseballTeam, Timestamp } from "./game";
import { Identifier } from "../io/Database";

/**
 * The nomenclature user will be used to differentiate fantasy players from
 * baseball players.
 */
export type User = {
  id: Identifier; // username.
  userGroupId: Identifier<UserGroup>;
  authorizationHash: string; // hashed password.
  timestamp: Timestamp;
  strikes: number;
  selections: Identifier<Selection>[];
};

export type UserGroup = {
  id: Identifier; // use group name.
  admin: Identifier<User>;
  password: string; // hashed pw usd for people to join the group.
  users: Identifier<User>[];
};

export type Selection = SelectionSubmission & {
  id: Identifier;
  user: Identifier<User>;

  /**
   * Time the selection was created.
   */
  createdTimestamp: Timestamp;

  score: number;
  struck: boolean; // whether this selection resulted in a strike for the 3Striker.
};

export type SelectionSubmission = {
  /**
   * The date the selection is for.
   * Can be retrospective for testing purposes.
   */
  forTimestamp: Timestamp;

  firstBaseFielder: Identifier<BaseballPlayer>;
  secondBaseFielder: Identifier<BaseballPlayer>;
  thirdBaseFielder: Identifier<BaseballPlayer>;
  shortStop: Identifier<BaseballPlayer>;
  outfield: Identifier<BaseballPlayer>;

  defensiveTeam: Identifier<BaseballTeam>;
};
