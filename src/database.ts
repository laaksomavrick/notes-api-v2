import pg from "pg";
import { LoggerFactory } from "../lib/logger";

export class Database {
  private readonly config: pg.PoolConfig;

  private readonly logger = LoggerFactory.getLogger();

  private pool: pg.Pool;

  private client: pg.PoolClient | undefined = undefined;

  constructor(config: pg.PoolConfig) {
    this.config = config;
    this.pool = new pg.Pool(this.config);
  }

  public async init(): Promise<void> {
    this.client = await this.pool.connect();
    this.logger.info("database successfully initialized");
  }

  public async ok(): Promise<boolean> {
    if (this.client === undefined) {
      throw new Error("Database must be initialized using init prior to calling ok");
    }
    try {
      await this.client.query("select 1", []);
      return true;
    } catch (e) {
      // TODO: log error
      return false;
    }
  }

}
