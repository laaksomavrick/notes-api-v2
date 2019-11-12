import { Database } from "../lib/database";
import { LoggerFactory } from "../lib/logger";

(async (): Promise<void> => {
    const logger = LoggerFactory.getLogger();
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

        // TODO: check that db doesn't already exist, fail gracefully if so
        // TODO: differentiate between dev and test

        await postgresDb.query("CREATE DATABASE notes;");

        logger.info("notes database created");

        notesDb = new Database({
            database: "notes",
            host: "localhost",
            password: undefined,
            port: 5432,
            user: "postgres",
        });

        await notesDb.query(`
        CREATE TABLE migrations(
            id serial PRIMARY KEY,
            migration_name VARCHAR(256) NOT NULL,
            migration_hash VARCHAR(32) NOT NULL
    );`);

        logger.info("migrations table created");

        logger.info("done");
    } catch (e) {
        logger.error("something went wrong", e);
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
