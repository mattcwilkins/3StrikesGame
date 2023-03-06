import { Rpc } from "../Rpc";
import { Identifier } from "../io/Database";
import { Selection, User } from "../data-models/fantasy";

export interface MakeSelection extends Rpc {
  method: "makeSelection";
  args: [Identifier<User>, string, Selection];
}

export type FantasyRpcSet = MakeSelection;
