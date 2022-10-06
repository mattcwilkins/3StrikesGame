import { Context, Handler } from "aws-lambda";
import { MLBDataService } from "../../services/ingestion/MLBDataService";

const mlbDataService = new MLBDataService();

/**
 * Loads roster data into DB.
 */
export const handler: Handler<{}, void> = async (
  event: {},
  context: Context
) => {
  console.info("Starting to load players from external data.");
  await mlbDataService.loadPlayers();
  console.info("Finished loading players from external data.");
};
