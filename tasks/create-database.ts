import { Database } from "../lib/database";
import { LoggerFactory } from "../lib/logger";

(async (): Promise<void> => {
    const logger = LoggerFactory.getLogger();
    const dbName = "notes";

    let postgresDb;
    let notesDb;

    try {
        // TODO: refactor config into lib/config alongside src/index.ts
        postgresDb = new Database({
            database: "postgres",
            host: "localhost",
            password: undefined,
            port: 5432,
            user: "postgres",
        });

        await postgresDb.init();

        const existsQuery = await postgresDb.query(`
            SELECT 1 AS exists FROM pg_database WHERE datname='${dbName}'
        `);

        const [existsQueryResult] = existsQuery.rows;
        const exists = existsQueryResult.exists;

        if (exists === 1) {
            logger.info(`${dbName} already exists, skipping creation`);
        } else {
            await postgresDb.query(`CREATE DATABASE ${dbName};`);
            logger.info(`${dbName} database created`);
        }

        notesDb = new Database({
            database: "notes",
            host: "localhost",
            password: undefined,
            port: 5432,
            user: "postgres",
        });

        await notesDb.query(`
        CREATE TABLE IF NOT EXISTS migrations(
            id serial PRIMARY KEY,
            migration_name VARCHAR(256) NOT NULL,
            migration_hash VARCHAR(32) NOT NULL
    );`);

        logger.info("migrations table created");
        logger.info("done");
    } catch (e) {
        logger.error("something went wrong", e);
        process.exit(1);
    } finally {
        if (postgresDb) {
            await postgresDb.disconnect();
        }
        if (notesDb) {
            await notesDb.disconnect();
        }
        process.exit(0);
    }
})();
