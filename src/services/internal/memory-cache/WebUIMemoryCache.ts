import { MemoryCache } from "./MemoryCache";
import {
  BaseballPlayer,
  BaseballTeam,
} from "../../../interfaces/internal/data-models/game";

export type WebUICacheData = {
  players: BaseballPlayer[];
  teams: BaseballTeam[];
};

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
    teams: undefined,
  };
}
