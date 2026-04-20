export interface SqliteClient {
  execute(query: string, params?: unknown[]): Promise<{ rows: unknown[][] }>;
}
