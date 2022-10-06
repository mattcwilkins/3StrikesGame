#!/usr/bin/env node

import { MLBDataService } from "../services/ingestion/MLBDataService";
import fs from "fs";
import path from "path";
import { BaseballPlayerService } from "../services/internal/BaseballPlayerService";

(async () => {
  const bdata = new MLBDataService();
  await bdata.loadPlayers();

  const playerService = new BaseballPlayerService();
  const players = await playerService.listBaseballPlayers();

  console.log(players);

  write(players, "dynamodb", "players.json");
})();

function write(data: any, ...fileName: string[]) {
  fs.writeFileSync(
    path.join(__dirname, "..", "..", "src", "reference-data", ...fileName),
    JSON.stringify(data, null, 2),
    "utf-8"
  );
}
