import React from "react";
import "bootstrap/dist/css/bootstrap.css";
import "./Root.css";
import { SelectionForm } from "./selection/SelectionForm";

/**
 * Web UI root initializer.
 */
export class Root extends React.Component<{}, {}> {
  public render() {
    return (
      <div className={"container"}>
        <h1 className={"display-5"}>3 Strikes Game</h1>
        <h3 className={"display-6"}>Dev Demo</h3>
        <SelectionForm />
      </div>
    );
  }
}
