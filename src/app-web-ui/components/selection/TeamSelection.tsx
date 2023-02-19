import {
  BaseballPlayer,
  BaseballTeam,
} from "../../../interfaces/internal/data-models/game";
import React, { FormEvent } from "react";
import { Identifier } from "../../../interfaces/internal/io/Database";

export interface TeamSelectionProps {
  name: string;
  options: BaseballTeam[];
  selection?: Identifier<BaseballTeam>;
  onInput: (e: FormEvent<HTMLSelectElement>) => void | Promise<void>;
}

export function TeamSelection({
  name,
  options,
  selection,
  onInput,
}: TeamSelectionProps) {
  return (
    <div className={"col-sm-4"}>
      <label htmlFor={`${name}-select`} className={"form-label"}>
        Defensive Team
      </label>
      <select
        onInput={onInput}
        name={`${name}-select`}
        id={`${name}-select`}
        className={"form-control"}
        value={selection}
      >
        <option value="">Select...</option>
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
