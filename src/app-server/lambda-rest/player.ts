import { APIGatewayEvent, Context, Handler } from "aws-lambda";
import { BaseballPlayerService } from "../../services/internal/BaseballPlayerService";
import { Rpc } from "../../interfaces/internal/Rpc";

const baseballPlayerService = new BaseballPlayerService();

/**
 * Handles RPC requests for player data.
 */
export const handler: Handler<APIGatewayEvent> = async (
  event,
  context: Context
) => {
  console.info("player lambda", event, context);
  const rpc: Rpc = JSON.parse(event.body || "{}");

  let response;

  switch (rpc.method) {
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
