import pg from "pg";

export class Database {
  private client: pg.PoolClient | undefined = undefined;

  private readonly config: pg.PoolConfig;

  private pool: pg.Pool;

  constructor(config: pg.PoolConfig) {
    this.config = config;
    this.pool = new pg.Pool(this.config);
  }

  public async init(): Promise<void> {
    this.client = await this.pool.connect();
    console.log("database successfully initialized");
  }

  public async ok(): Promise<boolean> {
    try {
      if (this.client === undefined) {
        throw new Error("Database must be initialized using init prior to calling ok");
      }
      await this.client.query("select 1", []);
      return true;
    } catch (e) {
      // TODO: log error
      return false;
    }
  }

}
