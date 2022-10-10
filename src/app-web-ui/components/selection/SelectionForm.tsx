import React from "react";
import {
  BaseballPlayer,
  BaseballTeam,
} from "../../../interfaces/internal/data-models/game";
import { PlayerServiceClient } from "../../service-clients/PlayerServiceClient";
import { PlayerSelection } from "./PlayerSelection";
import { TeamServiceClient } from "../../service-clients/TeamServiceClient";
import { TeamSelection } from "./TeamSelection";

export interface SelectionFormProps {}

export interface SelectionFormState {
  players: BaseballPlayer[];
  teams: BaseballTeam[];
}

export class SelectionForm extends React.Component<
  SelectionFormProps,
  SelectionFormState
> {
  public state = {
    players: [],
    teams: [],
  };

  private playerServiceClient = new PlayerServiceClient();
  private teamServiceClient = new TeamServiceClient();

  public render() {
    const { players, teams } = this.state;
    return (
      <form className="selection-form">
        <h4>1B</h4>
        <PlayerSelection
          options={players}
          teamLookup={teams}
          sequenceNumber={1}
          name={"player-selection-first-base"}
        />
        <h4>2B</h4>
        <PlayerSelection
          options={players}
          teamLookup={teams}
          sequenceNumber={1}
          name={"player-selection-second-base"}
        />
        <h4>SS</h4>
        <PlayerSelection
          options={players}
          teamLookup={teams}
          sequenceNumber={1}
          name={"player-selection-shortstop"}
        />
        <h4>3B</h4>
        <PlayerSelection
          options={players}
          teamLookup={teams}
          sequenceNumber={1}
          name={"player-selection-third-base"}
        />
        <h4>Outfielder</h4>
        <PlayerSelection
          options={players}
          teamLookup={teams}
          sequenceNumber={1}
          name={"player-selection-outfielder"}
        />
        <h4>Defensive Team</h4>
        <TeamSelection name={"team-defense-selection"} options={teams} />
      </form>
    );
  }

  public async componentDidMount() {
    const [teams, players] = await Promise.all([
      this.teamServiceClient.getTeams(),
      this.playerServiceClient.getPlayers(),
    ]);
    this.setState({
      players: players
        .sort((p1, p2) => {
          if (p1.team === p2.team) {
            return p1.playingPositions.join(",") < p2.playingPositions.join(",")
              ? -1
              : 1;
          }
          return p1.team < p2.team ? -1 : 1;
        })
        .filter((player) => {
          return !player.playingPositions.includes("pitcher");
        }),
      teams,
    });
  }
}
