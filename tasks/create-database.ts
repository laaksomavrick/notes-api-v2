import { Database } from "../lib/database";
import { LoggerFactory } from "../lib/logger";

(async (): Promise<void> => {
    const logger = LoggerFactory.getLogger();
    // TODO: refactor config into lib/config alongside src/index.ts
    const database = new Database({
        database: "postgres",
        host: "localhost",
        port: 5432,
        user: "postgres",
    });

    await database.init();

    await database.query("CREATE DATABASE notes;");

    logger.info("notes database created");

    await database.query(`
        CREATE TABLE notes.migrations(
            id serial PRIMARY KEY,
            migration_name VARCHAR(256) NOT NULL,
            migration_hash VARCHAR(32) NOT NULL
    );`);

    logger.info("migrations table created");

    logger.info("done");

    process.exit(0);
})();
