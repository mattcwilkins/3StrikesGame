import { DataAccessorProvider } from "../../../interfaces/internal/io/Database";

export class FileSystem implements DataAccessorProvider {
  async create<T>(tableName: string) {
    throw new Error("not yet implemented");
    return null as any;
  }
}
