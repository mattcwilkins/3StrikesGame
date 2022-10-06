import { DataAccessorProvider } from "../../../interfaces/internal/io/Database";
import {
  DescribeTableOutput,
  DynamoDB as Client,
} from "@aws-sdk/client-dynamodb";
import { DynamoDBDocument as DocumentClient } from "@aws-sdk/lib-dynamodb";
import { region } from "../../../config";
import { DynamoDBTable } from "./DynamoDBTable";

export class DynamoDB implements DataAccessorProvider {
  public constructor(
    private dynamodb = new Client({ region }),
    private doc = DocumentClient.from(dynamodb)
  ) {}

  async create<T>(tableName: string) {
    const { doc, dynamodb } = this;
    const describe: null | DescribeTableOutput = await dynamodb
      .describeTable({
        TableName: tableName,
      })
      .catch(() => null);
    if (!describe) {
      await dynamodb.createTable({
        TableName: tableName,
        AttributeDefinitions: [
          {
            AttributeName: "id",
            AttributeType: "S",
          },
        ],
        KeySchema: [
          {
            AttributeName: "id",
            KeyType: "HASH",
          },
        ],
      });
    }
    return new DynamoDBTable(tableName, doc);
  }
}
