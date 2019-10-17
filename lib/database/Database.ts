import { Pool, PoolClient, PoolConfig, QueryResult } from "pg";
import { LoggerFactory } from "../logger";

export class Database {
    private readonly config: PoolConfig;

    private readonly logger = LoggerFactory.getLogger();

    private pool: Pool;

    private client: PoolClient | undefined = undefined;

    constructor(config: PoolConfig) {
        this.config = config;
        this.pool = new Pool(this.config);
    }

    public async init(): Promise<void> {
        this.client = await this.pool.connect();
        this.logger.info("database successfully initialized");
    }

    public async query<T>(query: string): Promise<QueryResult<T>> {
        if (this.client === undefined) {
            await this.init();
        }
        this.logger.debug("executing query", query);
        // @ts-ignore
        return this.client.query(query);
    }

    public async ok(): Promise<boolean> {
        if (this.client === undefined) {
            await this.init();
        }
        try {
            // @ts-ignore
            await this.client.query("select 1", []);
            return true;
        } catch (e) {
            // TODO: log error
            return false;
        }
    }
}
