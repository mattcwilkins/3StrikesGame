import React from "react";
import { Link, Route, Router } from "wouter";
import "bootstrap/dist/css/bootstrap.css";
import "./Root.css";
import { SelectionForm } from "./selection/SelectionForm";
import { User } from "./user/User";

/**
 * Web UI root initializer.
 */
export class Root extends React.Component<{}, {}> {
  public render() {
    const base = location.pathname.includes("3StrikesGame/dist-web")
      ? "/3StrikesGame/dist-web"
      : "/";

    return (
      <Router base={base}>
        <div className={"container"}>
          <h1 className={"display-5"}>
            <Link to={"/"}>3 Strikes Game</Link>
          </h1>
          <h3 className={"display-6"}>Dev Demo</h3>

          <Route path={"/user/:userId"}>
            {(params) => <User userId={params.userId} />}
          </Route>
          <Route path={"/"}>
            <SelectionForm />
          </Route>
        </div>
      </Router>
    );
  }
}
