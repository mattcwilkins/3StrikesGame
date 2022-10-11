import { APIGatewayEvent, Context, Handler } from "aws-lambda";
import { BaseballTeamService } from "../../services/internal/BaseballTeamService";
import { BaseballSchedulesService } from "../../services/internal/BaseballScheduleService";
import { TeamRpcSet } from "../../interfaces/internal/rpc/TeamRpc";

const baseballTeamService = new BaseballTeamService();
const baseballSchedulesService = new BaseballSchedulesService();

/**
 * Handles RPC requests for team data.
 */
export const handler: Handler<APIGatewayEvent> = async (
  event,
  context: Context
) => {
  console.info("team lambda event", event);
  console.info("team lambda context", context);

  const rpc: TeamRpcSet = JSON.parse(event.body || "{}");
  console.info("team lambda rpc", rpc);

  let response;

  switch (rpc.method) {
    case "getTeamSchedule":
      response = await baseballSchedulesService.listScheduleForTeam(
        rpc.args[0]
      );
      break;
    default:
      response = await baseballTeamService.listBaseballTeams();
  }

  return {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
    },
    body: JSON.stringify(response),
  };
};
