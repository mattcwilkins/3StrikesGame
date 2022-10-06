import { MLBDataService } from "../services/ingestion/MLBDataService";
import fs from "fs";
import path from "path";
import { MLBDataTeam } from "../interfaces/external/BaseballDataService";

(async () => {
  const bdata = new MLBDataService();

  const teams = await bdata.teamAllSeason();
  const teamIds = teams.team_all_season.queryResults.row.map(
    (t: MLBDataTeam) => t.team_id
  );
  write(
    {
      team_ids: teamIds,
    },
    "team-ids.json"
  );
  for (const teamId of teamIds) {
    const roster = await bdata.roster(teamId);
    write(roster, `teams`, `roster-${teamId}.json`);
  }
})();

function write(data: any, ...fileName: string[]) {
  fs.writeFileSync(
    path.join(__dirname, "..", "..", "src", "reference-data", ...fileName),
    JSON.stringify(data, null, 2),
    "utf-8"
  );
}
