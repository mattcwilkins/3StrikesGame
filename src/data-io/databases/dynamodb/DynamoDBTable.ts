import {
  DataAccessor,
  NewRow,
  Row,
  Identifier,
} from "../../../interfaces/internal/io/Database";
import { DynamoDBDocument as DocumentClient } from "@aws-sdk/lib-dynamodb/dist-types/DynamoDBDocument";
import { v4 } from "uuid";

export class DynamoDBTable<T> implements DataAccessor<T> {
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

  public async set<T>(row: Row<T> | NewRow<T>): Promise<Identifier> {
    const { doc } = this;
    const id = row.id || v4();
    await doc.put({
      TableName: this.table,
      Item: {
        ...row,
        id,
      },
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
