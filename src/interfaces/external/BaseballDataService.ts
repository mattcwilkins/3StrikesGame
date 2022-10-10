import { TeamId } from "./MlbDataApi";
import { Identifier } from "../internal/io/Database";

export type MLBDataTeamAllSeasonResponse = {
  team_all_season: {
    queryResults: {
      row: MLBDataTeam[];
    };
  };
};

export type MLBDataTeam = {
  team_id: TeamId;
  franchise_code: string; // 3-letter.
  name_display_full: string;
};

export type MLBDataRosterResponse = {
  roster_40: {
    queryResults: {
      row: MLBDataPlayer[];
    };
  };
};

export type MLBDataPlayer = {
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
