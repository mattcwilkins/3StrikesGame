import { Context, Handler } from "aws-lambda";
import { MLBDataService } from "../../services/ingestion/MLBDataService";

const mlbDataService = new MLBDataService();

/**
 * Loads roster data into DB.
 */
export const handler: Handler<{}> = async (event: {}, context: Context) => {
  console.info("Starting to load players from external data.");
  await mlbDataService.loadTeamsAndPlayers();
  console.info("Finished loading players from external data.");
};
