import React from "react";

export interface DateSelectionProps {
  initialDate: string;
  onChange(dateString: string): void | Promise<void>;
}

export function DateSelection({ onChange, initialDate }: DateSelectionProps) {
  return (
    <div className={"col-sm-4"}>
      <label htmlFor="date-selection" className={"form-label"}>
        Date
      </label>
      <input
        className={"form-control"}
        type="text"
        id={"date-selection"}
        placeholder={initialDate}
        onInput={(e) =>
          onChange((e.nativeEvent.target as HTMLInputElement)?.value)
        }
      />
    </div>
  );
}
