#!/usr/bin/env node

import { MlbDataService } from "../services/ingestion/MlbDataService";
import fs from "fs";
import path from "path";
import { BaseballPlayerService } from "../services/internal/BaseballPlayerService";
import { BaseballTeamService } from "../services/internal/BaseballTeamService";
import { BaseballGameStatsService } from "../services/internal/BaseballGameStatsService";
import { BaseballSchedulesService } from "../services/internal/BaseballScheduleService";

Error.stackTraceLimit = 100;

(async () => {
  await getTeamScheduleData();
})();

async function getTeamScheduleData() {
  const service = new BaseballSchedulesService();
  const bdata = new MlbDataService();

  write(
    await bdata.loadTeamScheduleScores("119"),
    "stats-api-team-schedule-119.json"
  );

  write(
    await service.listScheduleForTeam("119"),
    "dynamodb",
    "team-schedule-119.json"
  );
}

async function getPlayerGameData() {
  const service = new BaseballGameStatsService();
  const bdata = new MlbDataService();

  write(
    await bdata.loadGameStats("592450"),
    "stats-api-game-stats-592450.json"
  );

  write(
    await service.getGameStats("545358"),
    "dynamodb",
    "game-stats-545358.json"
  );
}

async function playersAndTeams() {
  const bdata = new MlbDataService();

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
}

function write(data: any, ...fileName: string[]) {
  fs.writeFileSync(
    path.join(__dirname, "..", "..", "src", "reference-data", ...fileName),
    JSON.stringify(data, null, 2),
    "utf-8"
  );
}
