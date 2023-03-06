import { APIGatewayEvent, Context, Handler } from "aws-lambda";
import { FantasyRpcSet } from "../../interfaces/internal/rpc/FantasyRpc";
import { UserService } from "../../services/internal/UserService";
import { SelectionService } from "../../services/internal/SelectionService";

const userService = new UserService();
const selectionService = new SelectionService();

/**
 * Handles RPC requests for fantasy data.
 */
export const handler: Handler<APIGatewayEvent> = async (
  event,
  context: Context
) => {
  console.info("fantasy lambda event", event);
  console.info("fantasy lambda context", context);

  const rpc: FantasyRpcSet = JSON.parse(event.body || "{}");
  console.info("fantasy lambda rpc", rpc);

  let response;

  switch (rpc.method) {
    case "makeSelection":
      response = await selectionService.makeSelection(...rpc.args);
      break;
    default:
      response = {};
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
