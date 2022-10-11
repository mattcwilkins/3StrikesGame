import React, { FormEvent } from "react";
import {
  BaseballPlayer,
  BaseballPlayerGameStats,
  BaseballTeam,
} from "../../../interfaces/internal/data-models/game";
import { PlayerServiceClient } from "../../service-clients/PlayerServiceClient";
import { PlayerSelection } from "./PlayerSelection";
import { TeamServiceClient } from "../../service-clients/TeamServiceClient";
import { TeamSelection } from "./TeamSelection";
import { DateSelection } from "./DateSelection";
import { Identifier } from "../../../interfaces/internal/io/Database";
import { inject } from "../../../services/internal/dependency-injection/inject";
import { WebUIMemoryCache } from "../../../services/internal/memory-cache/WebUIMemoryCache";

export interface SelectionFormProps {}

export interface SelectionFormState {
  players: BaseballPlayer[];
  teams: BaseballTeam[];
  date: Date;
  cards: JSX.Element[];
  scores: number[];
}

/**
 * Selection form for a 3 Strikes game selection by a game player.
 */
export class SelectionForm extends React.Component<
  SelectionFormProps,
  SelectionFormState
> {
  public state: SelectionFormState = {
    players: [],
    teams: [],
    date: new Date("2022-08-23"),
    cards: [],
    scores: [],
  };

  private playerServiceClient = new PlayerServiceClient();
  private teamServiceClient = new TeamServiceClient();

  public render() {
    const { players, teams, date, scores } = this.state;
    return (
      <div className={"d-grid gap-3"}>
        <form className="selection-form row">
          <PlayerSelection
            options={players}
            teamLookup={teams}
            sequenceNumber={1}
            positions={["first", "catcher", "fielder"]}
            name={"player-selection-first-base"}
            onInput={this.onInputHandler(1)}
          />
          <PlayerSelection
            options={players}
            teamLookup={teams}
            sequenceNumber={2}
            positions={["second", "catcher", "fielder"]}
            name={"player-selection-second-base"}
            onInput={this.onInputHandler(2)}
          />
          <PlayerSelection
            options={players}
            teamLookup={teams}
            sequenceNumber={3}
            positions={["short", "catcher", "fielder"]}
            name={"player-selection-shortstop"}
            onInput={this.onInputHandler(3)}
          />
          <PlayerSelection
            options={players}
            teamLookup={teams}
            sequenceNumber={4}
            positions={["third", "catcher", "fielder"]}
            name={"player-selection-third-base"}
            onInput={this.onInputHandler(4)}
          />
          <PlayerSelection
            options={players}
            teamLookup={teams}
            sequenceNumber={5}
            positions={["left", "center", "right", "fielder"]}
            name={"player-selection-outfielder"}
            onInput={this.onInputHandler(5)}
          />
          <TeamSelection name={"team-defense-selection"} options={teams} />
          <DateSelection
            initialDate={"2022-08-23"}
            onChange={(dateStr) => this.setState({ date: new Date(dateStr) })}
          />
        </form>
        <h4 className={"display-4"}>
          <em>
            Total Score: {scores.filter(Boolean).reduce((a, b) => a + b, 0)}
          </em>
        </h4>
        {this.renderCards()}
      </div>
    );
  }

  public renderCards() {
    const { cards } = this.state;
    return <div className={"row"}>{cards.filter(Boolean)}</div>;
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

  private onInputHandler(sequenceNumber: number) {
    return (e: FormEvent<HTMLSelectElement>) =>
      this.onSelect(
        sequenceNumber,
        (e.nativeEvent?.target as HTMLSelectElement)?.value
      );
  }

  private async onSelect(
    sequenceNumber: number,
    playerId: Identifier<BaseballPlayer>
  ) {
    const { cards, scores } = this.state;
    const key = playerId + "_" + sequenceNumber;
    if (!playerId) {
      scores[sequenceNumber - 1] = 0;
      cards[sequenceNumber - 1] = <div key={key} className="col-lg-3" />;

      this.setState({
        cards,
        scores,
      });
      return;
    }
    const { date, players } = this.state;
    const cache = inject(WebUIMemoryCache);
    const player = players.find((p) => p.id === playerId)!;

    scores[sequenceNumber - 1] = 0;
    cards[sequenceNumber - 1] = (
      <div className="col-lg-3" key={key}>
        <div className="card scorecard">
          <div className="card-body">
            <h5 className="display-6">{player.name}</h5>
            <div className="card-text">
              <div className="spinner-border text-success" role={"status"}>
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
    this.setState({
      cards,
      scores,
    });

    const data: BaseballPlayerGameStats[] = await cache.get(
      ["playerGameData", playerId],
      async () =>
        this.playerServiceClient.getPlayerGameStats(
          playerId,
          new Date(date).getTime()
        )
    );

    scores[sequenceNumber - 1] = this.getScore(data);
    cards[sequenceNumber - 1] = (
      <div className="col-lg-3" key={key}>
        <div className="card scorecard">
          <div className="card-body">
            <h5 className="display-6">{player.name}</h5>
            <div className="card-text">
              {data
                .sort((a, b) => a.timestamp - b.timestamp)
                .map((gameStats) => (
                  <div key={gameStats.id}>
                    <em>
                      {new Date(gameStats.timestamp).getMonth() + 1}/
                      {new Date(gameStats.timestamp).getDate() + 1}
                    </em>{" "}
                    <strong>{gameStats.totalBases}</strong> TB,{" "}
                    <strong>{gameStats.walks}</strong> BB,{" "}
                    <strong>{gameStats.hitByPitches}</strong> HBP
                    <br />
                    <em>
                      <span style={{ fontSize: "75%" }}>
                        {gameStats.team} - {gameStats.opponent}
                      </span>
                    </em>
                  </div>
                ))}
              {data.length === 0 && "No Games Played"}
              <br />
              <div style={{ bottom: "1rem", position: "absolute" }}>
                <em>Score: {scores[sequenceNumber - 1]}</em>
              </div>
            </div>
          </div>
        </div>
      </div>
    );

    this.setState({
      cards,
      scores,
    });
  }

  private getScore(data: BaseballPlayerGameStats[]): number {
    let score = 0;
    data.forEach(({ totalBases, walks, hitByPitches }) => {
      score += totalBases + walks + hitByPitches;
    });
    return score;
  }
}
