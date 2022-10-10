import { DynamoDBAccessorProvider } from "../../../data-io/databases/dynamodb/DynamoDBAccessorProvider";
import {
  DataAccessor,
  Identifier,
  NewRow,
  Row,
  RowUpdate,
} from "../../../interfaces/internal/io/Database";
import { DynamoDBTableDataAccessor } from "../../../data-io/databases/dynamodb/DynamoDBTableDataAccessor";

export class DynamoDBService<T> {
  protected ready: Promise<DataAccessor<T>>;

  public constructor(protected tableName: string) {
    this.ready = new Promise(async (resolve) => {
      const dataAccessorProvider = new DynamoDBAccessorProvider();
      const tableAccessor: DynamoDBTableDataAccessor<T> =
        await dataAccessorProvider.create<T>(this.tableName);
      resolve(tableAccessor);
    });
  }

  public async get(id: Identifier<T>): Promise<T> {
    const accessor: DataAccessor<T> = await this.ready;
    return accessor.get(id);
  }

  public async list(): Promise<T[]> {
    const accessor = await this.ready;
    return accessor.list();
  }

  public async save(
    row: Row<T> | RowUpdate<T> | NewRow<T>
  ): Promise<Identifier<T>> {
    const accessor = await this.ready;
    return accessor.set(row);
  }

  public async delete(id: Identifier<T>): Promise<void> {
    const accessor = await this.ready;
    return accessor.delete(id);
  }
}
