import { Pool, PoolClient, QueryResult } from "pg";
import { DatabaseConfig } from "../config";
import { LoggerFactory } from "../logger";

export class Database {
    private readonly config: DatabaseConfig;

    private readonly logger = LoggerFactory.getLogger();

    private pool: Pool;

    private client: PoolClient | undefined = undefined;

    constructor(config: DatabaseConfig) {
        this.config = config;
        this.pool = new Pool(this.config);
    }

    public async init(): Promise<void> {
        this.client = await this.pool.connect();
        this.logger.info("database successfully connected");
    }

    public async query(
        query: string,
        // tslint:disable-next-line:no-any
        values: any[] = [],
    ): Promise<QueryResult> {
        if (this.client === undefined) {
            await this.init();
        }
        this.logger.debug("executing query", query, values);
        // @ts-ignore
        return this.client.query(query, values);
    }

    public async queryRows(
        query: string,
        // tslint:disable-next-line:no-any
        values: any[] = [],
    ): Promise<unknown[]> {
        const result = await this.query(query, values);
        return result.rows;
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

    public async disconnect(): Promise<void> {
        // @ts-ignore
        return this.client.release();
    }

    public async truncate(tables: string[]): Promise<void> {
        if (tables.length === 0) {
            throw new Error("Tables must have at least one entry");
        } else if (tables.length === 1) {
            const [table] = tables;
            await this.query(`TRUNCATE TABLE ${table} CASCADE`);
        } else {
            const tablesString = tables.join(",");
            await this.query(`TRUNCATE TABLES ${tablesString} CASCADE`);
        }
    }
}
