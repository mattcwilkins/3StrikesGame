import { Context, Handler } from "aws-lambda";
import { MlbDataService } from "../../services/ingestion/MlbDataService";

const mlbDataService = new MlbDataService();

/**
 * Loads roster data into DB.
 */
export const handler: Handler<{}> = async (event: {}, context: Context) => {
  console.info("Starting to load players from external data.");
  await mlbDataService.loadTeamsAndPlayers();
  console.info("Finished loading players from external data.");
};
