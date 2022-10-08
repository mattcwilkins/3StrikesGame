import React from "react";
import "./Root.css";
import { XhrClient } from "../../data-io/http/XhrClient";

export class Root extends React.Component<{}, { data: any }> {
  public state = { data: null };

  public render() {
    const { data } = this.state;
    return (
      <div>
        <h1>hello, world</h1>
        <pre>{JSON.stringify(data, null, 2)}</pre>
      </div>
    );
  }

  public async componentDidMount() {
    // data test
    const httpClient = new XhrClient();
    const data = await httpClient.post(
      "https://i654hwgy0i.execute-api.us-east-1.amazonaws.com/prod/player",
      {}
    );
    this.setState({
      data,
    });
  }
}
