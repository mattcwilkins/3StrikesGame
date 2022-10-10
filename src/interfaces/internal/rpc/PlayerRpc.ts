import { Rpc } from "../Rpc";
import { BaseballPlayer } from "../data-models/game";
import { Identifier } from "../io/Database";

export interface GetGameStats extends Rpc {
  method: "getGameStats";
  args: [Identifier<BaseballPlayer>];
}

export type PlayerRpcSet = GetGameStats | Rpc;
