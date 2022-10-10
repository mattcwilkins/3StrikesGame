import { MlbDataPlayer } from "../../../interfaces/external/BaseballDataService";
import {
  BaseballPlayer,
  BaseballPlayerGameStats,
  BaseballPlayerPosition,
} from "../../../interfaces/internal/data-models/game";
import { MlbStatsApiGameData } from "../../../interfaces/external/MlbStatsApi";

/**
 * Maps external data to internal data.
 */
export class PlayerDataMapper {
  public static mapPlayer(player: MlbDataPlayer): BaseballPlayer {
    return {
      id: player.player_id,
      name: player.name_display_first_last,
      playingPositions: [PlayerDataMapper.mapPosition(player.primary_position)],
      timestamp: Date.now(),
      gameStats: [],
      gameDataTimestamp: 0,
      team: player.team_id,
    };
  }

  public static mapGameStats(
    gameData: MlbStatsApiGameData
  ): BaseballPlayerGameStats {
    const stats = gameData.stat;

    return {
      id: gameData.player.id + "-" + gameData.game.gamePk,
      doubles: stats.doubles,
      fo: stats.airOuts,
      gidp: stats.groundIntoDoublePlay,
      gitp: stats.groundIntoTriplePlay,
      go: stats.groundOuts,
      hitByPitches: stats.hitByPitch,
      hits: stats.hits,
      homeRuns: stats.homeRuns,
      playerId: String(gameData.player.id),
      result: "",
      runs: stats.runs,
      sacBunts: stats.sacBunts,
      sacFlies: stats.sacFlies,
      steals: stats.stolenBases,
      timestamp: new Date(gameData.date).getTime(),
      totalBases: stats.totalBases,
      triples: stats.triples,
      walks: stats.baseOnBalls + stats.intentionalWalks,
    };
  }

  public static mapPosition(positionCode: string): BaseballPlayerPosition {
    switch (positionCode) {
      case "1":
        return "pitcher";
      case "2":
        return "catcher";
      case "3":
        return "first";
      case "4":
        return "second";
      case "5":
        return "third";
      case "6":
        return "short";
      case "7":
        return "left";
      case "8":
        return "center";
      case "9":
        return "right";
      default:
        return "fielder";
    }
  }
}
