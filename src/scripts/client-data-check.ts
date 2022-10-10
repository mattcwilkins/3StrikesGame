#!/usr/bin/env node

import { MLBDataService } from "../services/ingestion/MLBDataService";
import fs from "fs";
import path from "path";
import { BaseballPlayerService } from "../services/internal/BaseballPlayerService";
import { BaseballTeamService } from "../services/internal/BaseballTeamService";

(async () => {
  const bdata = new MLBDataService();
  write(
    await bdata.teamAllSeason(new Date().getFullYear().toString()),
    "teamsAllSeason.json"
  );

  await bdata.loadTeamsAndPlayers();

  const playerService = new BaseballPlayerService();
  const players = await playerService.listBaseballPlayers();
  write(players, "dynamodb", "players.json");

  const teamService = new BaseballTeamService();
  const teams = await teamService.listBaseballTeams();
  write(teams, "dynamodb", "teams.json");
})();

function write(data: any, ...fileName: string[]) {
  fs.writeFileSync(
    path.join(__dirname, "..", "..", "src", "reference-data", ...fileName),
    JSON.stringify(data, null, 2),
    "utf-8"
  );
}
