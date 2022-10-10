import { MLBDataPlayer } from "../../../interfaces/external/BaseballDataService";
import {
  BaseballPlayer,
  BaseballPlayerPosition,
} from "../../../interfaces/internal/data-models/game";

/**
 * Maps external data to internal data.
 */
export class PlayerDataMapper {
  public static mapPlayer(player: MLBDataPlayer): BaseballPlayer {
    return {
      id: player.player_id,
      name: player.name_display_first_last,
      playingPositions: [PlayerDataMapper.mapPosition(player.primary_position)],
      timestamp: Date.now(),
      atBats: [],
      team: player.team_id,
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
