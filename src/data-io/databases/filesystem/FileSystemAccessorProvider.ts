import { DataAccessorProvider } from "../../../interfaces/internal/io/Database";

/**
 * File system alternate to the DynamoDB accessor provider.
 */
export class FileSystemAccessorProvider implements DataAccessorProvider {
  async create<T>(tableName: string) {
    throw new Error("not yet implemented");
    return null as any;
  }
}
