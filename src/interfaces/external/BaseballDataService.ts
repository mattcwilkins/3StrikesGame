import { TeamId } from "./MlbDataApi";
import { Identifier } from "../internal/io/Database";

export type MlbDataTeamAllSeasonResponse = {
  team_all_season: {
    queryResults: {
      row: MlbDataTeam[];
    };
  };
};

export type MlbDataTeam = {
  team_id: TeamId;
  franchise_code: string; // 3-letter.
  name_display_full: string;
};

export type MlbDataRosterResponse = {
  roster_40: {
    queryResults: {
      row: MlbDataPlayer[];
    };
  };
};

export type MlbDataPlayer = {
  player_id: Identifier;
  name_display_first_last: string;
  name_last: string;
  name_first: string;
  jersey_number: string;

  team_id: Identifier;
  team_name: string;

  primary_position: string;
  position_txt: string;
};
