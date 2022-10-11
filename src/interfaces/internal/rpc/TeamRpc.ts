import { Rpc } from "../Rpc";
import { TeamId } from "../../external/MlbDataApi";

export interface GetTeamScheduleScores extends Rpc {
  method: "getTeamSchedule";
  args: [TeamId];
}

export type TeamRpcSet = GetTeamScheduleScores;
