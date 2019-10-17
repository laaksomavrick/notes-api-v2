import { Database } from "../lib/database";
import { LoggerFactory } from "../lib/logger";

(async (): Promise<void> => {
    const logger = LoggerFactory.getLogger();
    // TODO: refactor config into lib/config alongside src/index.ts
    const database = new Database({
        database: "notes",
        host: "localhost",
        port: 5432,
        user: "postgres",
    });

    await database.init();
    await database.query("CREATE DATABASE notes");

    logger.info("notes database created");

    process.exit(0);
})();
