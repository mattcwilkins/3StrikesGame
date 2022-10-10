/**
 * Unique identifier required for all data objects.
 * @param <T> indicates an identifier for a particular data type.
 */
export type Identifier<T = unknown> = string;

/**
 * A unique row of data.
 */
export type Row<T> = T & {
  id: Identifier;
};

/**
 * A partial update.
 */
export type RowUpdate<T> = Partial<T> & {
  id: Identifier;
};

/**
 * Represents an unsaved new object.
 */
export type NewRow<T> = T & {
  id: undefined;
};

/**
 * Data Access Object.
 */
export interface DataAccessor<T> {
  /**
   * @param row - to be saved.
   * @returns the Identifier of the created or updated row.
   */
  set(row: Row<T> | NewRow<T> | RowUpdate<T>): Promise<Identifier>;

  /**
   * @param id - retrieves single object.
   */
  get(id: Identifier): Promise<Row<T>>;

  /**
   * Returns all items. This is not practical on unbounded tables.
   * TODO: pagination options.
   */
  list(conditions?: Record<string, any>): Promise<Row<T>[]>;

  /**
   * @param id - to be deleted.
   */
  delete(id: Identifier): Promise<void>;
}

/**
 * Creates a DAO for a given table name (object type).
 */
export interface DataAccessorProvider {
  create<T>(tableName: string): Promise<DataAccessor<T>>;
}
