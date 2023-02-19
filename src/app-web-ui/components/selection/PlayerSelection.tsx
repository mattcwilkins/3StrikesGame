import {
  BaseballPlayer,
  BaseballPlayerPosition,
  BaseballTeam,
} from "../../../interfaces/internal/data-models/game";
import React, { FormEvent } from "react";
import { Identifier } from "../../../interfaces/internal/io/Database";

export interface PlayerSelectionProps {
  name: string;
  sequenceNumber: number;
  options: BaseballPlayer[];
  teamLookup: BaseballTeam[];
  positions: BaseballPlayerPosition[];
  selection?: Identifier<BaseballPlayer>;
  onInput: (event: FormEvent<HTMLSelectElement>) => void | Promise<void>;
}

export function PlayerSelection({
  name,
  sequenceNumber,
  options,
  teamLookup,
  positions,
  selection,
  onInput,
}: PlayerSelectionProps) {
  return (
    <div className={"col-sm-4"}>
      <label
        htmlFor={`${name}-select-${sequenceNumber}`}
        className={"form-label"}
      >
        {(() => {
          switch (sequenceNumber) {
            case 1:
              return "First Base";
            case 2:
              return "Second Base";
            case 3:
              return "Shortstop";
            case 4:
              return "Third Base";
            case 5:
              return "Outfield";
          }
        })()}
      </label>
      <select
        className={"form-control"}
        name={`${name}-select-${sequenceNumber}`}
        id={`${name}-select-${sequenceNumber}`}
        onInput={onInput}
        value={selection}
      >
        <option value="">Select...</option>
        {options
          .filter((player) =>
            player.playingPositions.find((pos) => positions.includes(pos))
          )
          .map((player) => {
            return (
              <option key={player.id} value={player.id}>
                {teamLookup.find((team) => team.id === player.team)?.name} -{" "}
                {player.name} - {player.playingPositions.join(",")}
              </option>
            );
          })}
      </select>
    </div>
  );
}
