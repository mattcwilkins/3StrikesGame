import { DynamoDBAccessorProvider } from "../../../data-io/databases/dynamodb/DynamoDBAccessorProvider";
import { DataAccessor } from "../../../interfaces/internal/io/Database";

export class DynamoDBService<T> {
  protected ready: Promise<DataAccessor<T>>;

  public constructor(protected tableName: string) {
    this.ready = new Promise(async (resolve) => {
      const dataAccessorProvider = new DynamoDBAccessorProvider();
      const tableAccessor = await dataAccessorProvider.create<T>(
        this.tableName
      );
      resolve(tableAccessor);
    });
  }
}
