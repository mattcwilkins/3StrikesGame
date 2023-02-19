import React, { FormEvent } from "react";
import {
  BaseballPlayer,
  BaseballPlayerGameStats,
  BaseballTeam,
  BaseballTeamDefensiveGamePerformance,
} from "../../../interfaces/internal/data-models/game";
import { PlayerServiceClient } from "../../service-clients/PlayerServiceClient";
import { PlayerSelection } from "./PlayerSelection";
import { TeamServiceClient } from "../../service-clients/TeamServiceClient";
import { TeamSelection } from "./TeamSelection";
import { DateSelection } from "./DateSelection";
import { Identifier } from "../../../interfaces/internal/io/Database";
import { inject } from "../../../services/internal/dependency-injection/inject";
import { WebUIMemoryCache } from "../../../services/internal/memory-cache/WebUIMemoryCache";
import { Card } from "../card/Card";
import { TeamId } from "../../../interfaces/external/MlbDataApi";
import { store } from "../../storage/LocalStorage";

export interface SelectionFormProps {}

export interface SelectionFormState {
  players: BaseballPlayer[];
  teams: BaseballTeam[];
  date: Date;
  cards: JSX.Element[];
  scores: number[];
  selection: {
    players: Array<Identifier<BaseballPlayer> | undefined>;
    team?: Identifier<BaseballTeam>;
  };
}

const STATE_KEY = "SelectionFormState";

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
    selection: store.get(STATE_KEY, {
      players: [] as Array<Identifier<BaseballPlayer>>,
      team: void 0,
    }),
  };

  private playerServiceClient = new PlayerServiceClient();
  private teamServiceClient = new TeamServiceClient();

  public render() {
    const { players, teams, date, scores, selection } = this.state;
    return (
      <div className={"d-grid gap-3"}>
        <form className="selection-form row">
          <PlayerSelection
            options={players}
            teamLookup={teams}
            sequenceNumber={1}
            positions={["first", "catcher", "fielder"]}
            name={"player-selection-first-base"}
            selection={selection.players[1]}
            onInput={this.onInputHandler(1)}
          />
          <PlayerSelection
            options={players}
            teamLookup={teams}
            sequenceNumber={2}
            positions={["second", "catcher", "fielder"]}
            name={"player-selection-second-base"}
            selection={selection.players[2]}
            onInput={this.onInputHandler(2)}
          />
          <PlayerSelection
            options={players}
            teamLookup={teams}
            sequenceNumber={3}
            positions={["short", "catcher", "fielder"]}
            name={"player-selection-shortstop"}
            selection={selection.players[3]}
            onInput={this.onInputHandler(3)}
          />
          <PlayerSelection
            options={players}
            teamLookup={teams}
            sequenceNumber={4}
            positions={["third", "catcher", "fielder"]}
            name={"player-selection-third-base"}
            selection={selection.players[4]}
            onInput={this.onInputHandler(4)}
          />
          <PlayerSelection
            options={players}
            teamLookup={teams}
            sequenceNumber={5}
            positions={["left", "center", "right", "fielder"]}
            name={"player-selection-outfielder"}
            selection={selection.players[5]}
            onInput={this.onInputHandler(5)}
          />
          <TeamSelection
            onInput={(e: FormEvent<HTMLSelectElement>) =>
              this.onSelectTeam(
                (e.nativeEvent?.target as HTMLSelectElement)?.value as TeamId
              )
            }
            name={"team-defense-selection"}
            selection={selection.team}
            options={teams}
          />
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

    this.setState(
      {
        players: players
          .sort((p1, p2) => {
            if (p1.team === p2.team) {
              return p1.playingPositions.join(",") <
                p2.playingPositions.join(",")
                ? -1
                : 1;
            }
            return p1.team < p2.team ? -1 : 1;
          })
          .filter((player) => {
            return !player.playingPositions.includes("pitcher");
          }),
        teams,
      },
      async () => {
        const { selection } = this.state;
        for (let i = 0; i < selection.players.length; ++i) {
          if (selection.players[i]) {
            await this.onSelect(i, selection.players[i]!);
          }
        }
        if (selection.team) {
          await this.onSelectTeam(selection.team as TeamId);
        }
      }
    );
  }

  /**
   * @override
   */
  public setState<K extends keyof SelectionFormState>(
    state:
      | ((
          prevState: Readonly<SelectionFormState>,
          props: Readonly<SelectionFormProps>
        ) => Pick<SelectionFormState, K> | SelectionFormState | null)
      | Pick<SelectionFormState, K>
      | SelectionFormState
      | null,
    callback?: () => void
  ) {
    super.setState(state, callback);
  }

  private onInputHandler(sequenceNumber: number) {
    return (e: FormEvent<HTMLSelectElement>) =>
      this.onSelect(
        sequenceNumber,
        (e.nativeEvent?.target as HTMLSelectElement)?.value
      );
  }

  private async onSelectTeam(teamId: TeamId) {
    this.state.selection.team = teamId;
    store.set(STATE_KEY, this.state.selection);

    const { cards, date, teams, scores } = this.state;
    const index = 5;
    const key = "team_" + teamId;

    if (!teamId) {
      scores[index] = 0;
      cards[index] = <Card key={key} />;
      this.setState({
        cards,
        scores,
      });
      return;
    }

    const cache = inject(WebUIMemoryCache);
    const team = teams.find((team) => team.id === teamId)!;

    scores[index] = 0;
    cards[index] = (
      <Card key={key} title={team.name}>
        <div className="spinner-border text-success" role={"status"}>
          <span className="visually-hidden">Loading...</span>
        </div>
      </Card>
    );
    this.setState({
      cards,
      scores,
    });

    try {
      const defensiveGames: BaseballTeamDefensiveGamePerformance[] = (
        await cache.get(["defensivePerformanceData", teamId], async () =>
          this.teamServiceClient.getSchedule(teamId, new Date(date).getTime())
        )
      ).sort((a, b) => a.timestamp - b.timestamp);
      const score = Math.max(
        0,
        defensiveGames.slice(0, 3).reduce((runsAllowed, game) => {
          return runsAllowed - game.runsAllowed;
        }, 25)
      );

      scores[index] = score;
      cards[index] = (
        <Card key={key} title={team.name}>
          {defensiveGames.map((defensiveGame) => (
            <div key={defensiveGame.id}>
              <em>
                {new Date(defensiveGame.timestamp).getMonth() + 1}/
                {new Date(defensiveGame.timestamp).getDate() + 1}
              </em>{" "}
              <strong>{defensiveGame.runsAllowed}</strong> Runs Allowed
              <br />
              <em>
                <span style={{ fontSize: "75%" }}>
                  {/* TODO home away names */}
                </span>
              </em>
            </div>
          ))}
          {defensiveGames.length === 0 && "No Games"}
          <br />
          <div style={{ bottom: "1rem", position: "absolute" }}>
            <em>Score: {score}</em>
          </div>
        </Card>
      );

      this.setState({
        cards,
        scores,
      });
    } catch (e) {
      scores[index] = 0;
      cards[index] = (
        <Card key={key} title={team.name}>
          <div className="alert alert-danger" role={"status"}>
            <span>Data Error</span>
          </div>
        </Card>
      );
      this.setState({
        cards,
        scores,
      });
    }
  }

  private async onSelect(
    sequenceNumber: number,
    playerId: Identifier<BaseballPlayer>
  ) {
    this.state.selection.players[sequenceNumber] = playerId;
    store.set(STATE_KEY, this.state.selection);

    const { cards, scores } = this.state;
    const key = playerId + "_" + sequenceNumber;
    if (!playerId) {
      scores[sequenceNumber - 1] = 0;
      cards[sequenceNumber - 1] = <Card key={key} />;

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
      <Card key={key} title={player.name}>
        <div className="spinner-border text-success" role={"status"}>
          <span className="visually-hidden">Loading...</span>
        </div>
      </Card>
    );
    this.setState({
      cards,
      scores,
    });

    try {
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
        <Card key={key} title={player.name}>
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
        </Card>
      );

      this.setState({
        cards,
        scores,
      });
    } catch (e) {
      scores[sequenceNumber - 1] = 0;
      cards[sequenceNumber - 1] = (
        <Card key={key} title={player.name}>
          <div className="alert alert-danger" role={"status"}>
            <span>Data Error</span>
          </div>
        </Card>
      );
      this.setState({
        cards,
        scores,
      });
    }
  }

  private getScore(data: BaseballPlayerGameStats[]): number {
    let score = 0;
    data.forEach(({ totalBases, walks, hitByPitches }) => {
      score += totalBases + walks + hitByPitches;
    });
    return score;
  }
}
