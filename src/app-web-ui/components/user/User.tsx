import React from "react";
import { inject } from "../../../services/internal/dependency-injection/inject";
import { FantasyServiceClient } from "../../service-clients/FantasyServiceClient";
import { Selection } from "../../../interfaces/internal/data-models/fantasy";

export interface UserState {}

export interface UserProps {
  userId: string;
}

export class User extends React.Component<UserProps, UserState> {
  public state: {
    selections: Selection[];
  } = {
    selections: [],
  };

  private fantasyServiceClient = inject(FantasyServiceClient);

  public async componentDidMount() {
    const selections =
      (await this.fantasyServiceClient.listSelectionsForUser(
        this.props.userId
      )) || [];
    this.setState({
      selections,
    });
  }

  public render() {
    const { userId } = this.props;

    return (
      <div>
        <h3>{userId}</h3>
        <h5>Selections</h5>
        <ul>
          {this.state.selections.map((selection) => (
            <li key={selection.id}>
              <pre>{JSON.stringify(selection, null, 2)}</pre>
            </li>
          ))}
        </ul>
      </div>
    );
  }
}
