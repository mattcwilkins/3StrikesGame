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
      <div>
        <h1>3 Strikes Game Dev Demo</h1>
        <h3>Sample selection form</h3>
        <SelectionForm />
      </div>
    );
  }
}
