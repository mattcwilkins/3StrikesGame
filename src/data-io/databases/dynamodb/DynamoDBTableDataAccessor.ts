import {
  DataAccessor,
  Identifier,
  NewRow,
  Row,
} from "../../../interfaces/internal/io/Database";
import { DynamoDBDocument as DocumentClient } from "@aws-sdk/lib-dynamodb/dist-types/DynamoDBDocument";
import { v4 } from "uuid";

export class DynamoDBTableDataAccessor<T> implements DataAccessor<T> {
  public constructor(
    public readonly table: string,
    private doc: DocumentClient
  ) {}

  public async get<T>(id: Identifier): Promise<Row<T>> {
    const { doc } = this;
    const get = await doc.get({
      TableName: this.table,
      Key: {
        id,
      },
    });
    return get.Item as Row<T>;
  }

  public async list(): Promise<Row<T>[]> {
    const { doc } = this;
    const list = await doc.query({
      TableName: this.table,
    });
    return list.Items as Row<T>[];
  }

  public async set<T>(row: Row<T> | NewRow<T>): Promise<Identifier> {
    const { doc } = this;
    const id = row.id || v4();
    await doc.update({
      TableName: this.table,
      Key: {
        id,
      },
      ...createUpdateParamsFor(row),
    });
    return this.get(id);
  }

  public async delete<T>(id: Identifier) {
    const { doc } = this;
    await doc.delete({
      TableName: this.table,
      Key: {
        id,
      },
    });
  }
}

/**
 * @private
 */
const createUpdateParamsFor = <T extends Record<string, any>>(item: T) => {
  const Item: Record<string, any> = {
    ...item,
  };
  let updateExpression = "set";
  let ExpressionAttributeNames: Record<string, any> = {};
  let ExpressionAttributeValues: Record<string, any> = {};
  for (const property of Object.keys(Item)) {
    updateExpression += ` #${property} = :${property} ,`;
    ExpressionAttributeNames["#" + property] = property;
    ExpressionAttributeValues[":" + property] = Item[property];
  }

  updateExpression = updateExpression.slice(0, -1);

  return {
    UpdateExpression: updateExpression,
    ExpressionAttributeNames: ExpressionAttributeNames,
    ExpressionAttributeValues: ExpressionAttributeValues,
  };
};
