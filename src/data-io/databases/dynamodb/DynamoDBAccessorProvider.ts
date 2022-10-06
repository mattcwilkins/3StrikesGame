import { DataAccessorProvider } from "../../../interfaces/internal/io/Database";
import {
  DescribeTableOutput,
  DynamoDB as Client,
} from "@aws-sdk/client-dynamodb";
import { DynamoDBDocument as DocumentClient } from "@aws-sdk/lib-dynamodb";
import { region } from "../../../config";
import { DynamoDBTableDataAccessor } from "./DynamoDBTableDataAccessor";

export class DynamoDBAccessorProvider implements DataAccessorProvider {
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
        BillingMode: "PAY_PER_REQUEST",
      });
    }
    return new DynamoDBTableDataAccessor<T>(tableName, doc);
  }
}
