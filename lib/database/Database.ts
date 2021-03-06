import { stripIndent } from "common-tags";
import { Pool, PoolClient, QueryResult } from "pg";
import { Context } from "../../src/framework/Context";
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
        this.logger.info("database successfully connected", {
            db: this.config.database,
            host: this.config.host,
            port: this.config.port,
            user: this.config.user,
        });
    }

    public async query(
        query: string,
        // tslint:disable-next-line:no-any
        values: any[] = [],
        context?: Context,
    ): Promise<QueryResult> {
        let loggableQuery;
        if (this.client === undefined) {
            await this.init();
        }
        loggableQuery = stripIndent(query);
        loggableQuery = loggableQuery.replace(/\n/g, " ");
        if (context) {
            context.info("db exec", { query: loggableQuery, values });
        } else {
            this.logger.info("db exec", { query: loggableQuery, values });
        }
        // @ts-ignore
        return this.client.query(query, values);
    }

    public async queryRows(
        query: string,
        // tslint:disable-next-line:no-any
        values: any[] = [],
    ): Promise<unknown[]> {
        query = stripIndent(query);
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
        } else {
            const promises = [];
            for (const table of tables) {
                const query = this.query(`TRUNCATE TABLE ${table} CASCADE`);
                promises.push(query);
            }
            await Promise.all(promises);
        }
    }

    // tslint:disable-next-line:no-any
    public async transaction(execs: () => Promise<void>): Promise<any> {
        if (this.client === undefined) {
            await this.init();
        }

        try {
            await this.query("BEGIN");
            await execs();
            await this.query("COMMIT");
        } catch (e) {
            await this.query("ROLLBACK");
            throw e;
        }
    }
}
