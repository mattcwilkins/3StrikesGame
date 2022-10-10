import { APIGatewayEvent, Context, Handler } from "aws-lambda";
import { BaseballPlayerService } from "../../services/internal/BaseballPlayerService";
import { BaseballGameStatsService } from "../../services/internal/BaseballGameStatsService";
import { PlayerRpcSet } from "../../interfaces/internal/rpc/PlayerRpc";

const baseballPlayerService = new BaseballPlayerService();
const baseballGameStatsService = new BaseballGameStatsService();

/**
 * Handles RPC requests for player data.
 */
export const handler: Handler<APIGatewayEvent> = async (
  event,
  context: Context
) => {
  console.info("player lambda event", event);
  console.info("player lambda context", context);

  const rpc: PlayerRpcSet = JSON.parse(event.body || "{}");
  console.info("player lambda rpc", rpc);

  let response;

  switch (rpc.method) {
    case "getStats":
      response = await baseballGameStatsService.getGameStats(rpc.args[0]);
      break;
    default:
      response = await baseballPlayerService.listBaseballPlayers();
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
