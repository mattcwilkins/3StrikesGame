import { Context, Handler } from "aws-lambda";
import { BaseballPlayerService } from "../../services/internal/BaseballPlayerService";

const baseballPlayerService = new BaseballPlayerService();

/**
 * Retrieves the list of players available for selection.
 */
export const handler: Handler<{}> = async (event: {}, context: Context) => {
  console.info("getting player list");
  return baseballPlayerService.listBaseballPlayers();
};
