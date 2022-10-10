import { MemoryCache } from "./MemoryCache";
import {
  BaseballPlayer,
  BaseballPlayerGameStats,
  BaseballTeam,
} from "../../../interfaces/internal/data-models/game";
import { Identifier } from "../../../interfaces/internal/io/Database";

export type WebUICacheData = {
  players: BaseballPlayer[];
  teams: BaseballTeam[];
  playerGameData: Record<Identifier<BaseballPlayer>, BaseballPlayerGameStats[]>;
};

/**
 * Memory cache for browsers.
 */
export class WebUIMemoryCache extends MemoryCache<WebUICacheData> {
  public static instance: WebUIMemoryCache = new WebUIMemoryCache();
  public static getInstance() {
    return WebUIMemoryCache.instance;
  }

  public constructor() {
    super();
    return WebUIMemoryCache.getInstance();
  }

  protected data = {
    players: undefined,
    playerGameData: {},
    teams: undefined,
  };
}
