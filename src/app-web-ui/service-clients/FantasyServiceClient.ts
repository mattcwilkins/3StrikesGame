import { XhrClient } from "../../data-io/http/XhrClient";
import { WebUIMemoryCache } from "../../services/internal/memory-cache/WebUIMemoryCache";
import { Identifier } from "../../interfaces/internal/io/Database";
import {
  SelectionSubmission,
  User,
} from "../../interfaces/internal/data-models/fantasy";

/**
 * Client to the fantasy lambda.
 */
export class FantasyServiceClient {
  public constructor(
    private xhrClient = new XhrClient(),
    private webUiMemoryCache = new WebUIMemoryCache(),
    private hostPrefix = "https://i654hwgy0i.execute-api.us-east-1.amazonaws.com/prod"
  ) {}

  public async makeSelection(
    userId: Identifier<User>,
    password: string, // unhashed
    selection: SelectionSubmission
  ) {
    const data: Promise<void> = this.xhrClient.post(
      this.hostPrefix + "/fantasy",
      {
        method: "makeSelection",
        args: [userId, password, selection],
      }
    );

    return data;
  }
}
