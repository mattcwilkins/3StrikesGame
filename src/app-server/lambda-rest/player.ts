import { Context, Handler } from "aws-lambda";
import { BaseballPlayerService } from "../../services/internal/BaseballPlayerService";

const baseballPlayerService = new BaseballPlayerService();

/**
 * Retrieves the list of players available for selection.
 */
export const handler: Handler<{}> = async (event: {}, context: Context) => {
  console.info("player lambda", event, context);
  const playerList = await baseballPlayerService.listBaseballPlayers();

  return {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
    },
    body: JSON.stringify(playerList),
  };
};
