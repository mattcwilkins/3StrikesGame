import {
  BaseballPlayer,
  BaseballTeam,
} from "../../../interfaces/internal/data-models/game";
import React from "react";

export interface TeamSelectionProps {
  name: string;
  options: BaseballTeam[];
}

export function TeamSelection({ name, options }: TeamSelectionProps) {
  return (
    <select name={`${name}-select`} id={`${name}-select`}>
      {options.map((team) => {
        return (
          <option key={team.id} value={team.id}>
            {team.name}
          </option>
        );
      })}
    </select>
  );
}
