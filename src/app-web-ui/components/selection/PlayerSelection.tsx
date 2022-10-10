import {
  BaseballPlayer,
  BaseballTeam,
} from "../../../interfaces/internal/data-models/game";
import React from "react";

export interface PlayerSelectionProps {
  name: string;
  sequenceNumber: number;
  options: BaseballPlayer[];
  teamLookup: BaseballTeam[];
}

export function PlayerSelection({
  name,
  sequenceNumber,
  options,
  teamLookup,
}: PlayerSelectionProps) {
  return (
    <select
      name={`${name}-select-${sequenceNumber}`}
      id={`${name}-select-${sequenceNumber}`}
    >
      {options.map((player) => {
        return (
          <option key={player.id} value={player.id}>
            {teamLookup.find((team) => team.id === player.team)?.name} -{" "}
            {player.name} - {player.playingPositions.join(",")}
          </option>
        );
      })}
    </select>
  );
}
