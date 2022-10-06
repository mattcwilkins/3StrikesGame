import { BaseballDataService } from "../services/BaseballDataService";
import fs from "fs";
import path from "path";
import { Team } from "../interfaces/internal/services/BaseballDataService";

(async () => {
  const bdata = new BaseballDataService();

  const teams = await bdata.listTeams();
  const teamIds = teams.team_all_season.queryResults.row.map(
    (t: Team) => t.team_id
  );
  write(
    {
      team_ids: teamIds,
    },
    "team-ids.json"
  );
  for (const teamId of teamIds) {
    const roster = await bdata.listPlayers(teamId);
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
