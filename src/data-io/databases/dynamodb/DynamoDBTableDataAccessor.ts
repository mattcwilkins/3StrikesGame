import {
  DataAccessor,
  Identifier,
  NewRow,
  Row,
} from "../../../interfaces/internal/io/Database";
import { DynamoDBDocument as DocumentClient } from "@aws-sdk/lib-dynamodb/dist-types/DynamoDBDocument";
import { v4 } from "uuid";
import { ScanCommandInput } from "@aws-sdk/lib-dynamodb";

/**
 * Layer 1 over the DynamoDB SDK client, functions as a DAO.
 */
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

  public async list(conditions: Record<string, any> = {}): Promise<Row<T>[]> {
    const { doc } = this;

    const params: ScanCommandInput = {
      TableName: this.table,
      FilterExpression: Object.entries(conditions)
        .map(([k, v]) => {
          return `${k} = :${k}`;
        })
        .join(" and "),
      ExpressionAttributeValues: Object.entries(conditions).reduce(
        (acc, [k, v]) => {
          acc[`:${k}`] = v;
          return acc;
        },
        {} as typeof conditions
      ),
    };
    if (Object.keys(conditions).length === 0) {
      delete params.FilterExpression;
      delete params.ExpressionAttributeValues;
    }

    const list = await doc.scan(params);
    return list.Items as Row<T>[];
  }

  public async set<T>(row: Row<T> | NewRow<T>): Promise<Identifier> {
    const { doc } = this;
    const id = row.id;

    if (!id) {
      throw new Error(
        "Cannot upsert without id: \n" + JSON.stringify(row, null, 2)
      );
    }

    for (const [k, v] of Object.entries(row)) {
      if (v === undefined) {
        throw new Error(
          "Undefined value in set/save command at key=" +
            k +
            ": \n" +
            JSON.stringify(row, null, 2)
        );
      }
    }

    await doc.update({
      TableName: this.table,
      Key: {
        id,
      },
      ...createUpdateParamsFor(
        (() => {
          const withoutId: Partial<Row<T>> = { ...row };
          delete withoutId.id;
          return withoutId;
        })()
      ),
    });
    return (await this.get(id)).id;
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
