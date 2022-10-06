import { TeamId } from "../../external/MlbDataApi";

export type ListTeamsResponse = {
  team_all_season: {
    queryResults: {
      row: Team[];
    };
  };
};

export type Team = {
  team_id: TeamId;
};
