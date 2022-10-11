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
    <div className={"col-sm-4"}>
      <label htmlFor={`${name}-select`} className={"form-label"}>
        Defensive Team (NYI)
      </label>
      <select
        name={`${name}-select`}
        id={`${name}-select`}
        className={"form-control"}
        disabled
      >
        {options
          .sort((a, b) => {
            return a.name < b.name ? -1 : 1;
          })
          .map((team) => {
            return (
              <option key={team.id} value={team.id}>
                {team.name}
              </option>
            );
          })}
      </select>
    </div>
  );
}
