import { APIGatewayEvent, Context, Handler } from "aws-lambda";
import { BaseballTeamService } from "../../services/internal/BaseballTeamService";
import { Rpc } from "../../interfaces/internal/Rpc";

const baseballTeamService = new BaseballTeamService();

/**
 * Handles RPC requests for team data.
 */
export const handler: Handler<APIGatewayEvent> = async (
  event,
  context: Context
) => {
  console.info("team lambda event", event);
  console.info("team lambda context", context);

  const rpc: Rpc = JSON.parse(event.body || "{}");
  console.info("team lambda rpc", rpc);

  let response;

  switch (rpc.method) {
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
