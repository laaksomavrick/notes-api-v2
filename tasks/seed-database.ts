import { Database } from "../lib/database";
import { LoggerFactory } from "../lib/logger";

// TODO this is sloppy, here for local dev
// Create a default user "mav@gmail.com" with password "qweqweqwe" with user_id of "1"

(async (): Promise<void> => {
    const logger = LoggerFactory.getLogger();
    let db;
    try {
        // TODO: refactor config into lib/config alongside src/index.ts
        db = new Database({
            database: "notes",
            host: "localhost",
            password: undefined,
            port: 5432,
            user: "postgres",
        });

        await db.init();

        await db.query(
            `
                    INSERT INTO users (id, email, password, created_at, updated_at)
                    VALUES ($1, $2, $3, $4, $5)
          `,
            [
                1,
                "mav@gmail.com",
                "$2b$10$bzeLXq8PD4xGuWE2NIDuQOopTKwyGUmmjEuAf7YKGsLxxUWGwA4Ka",
                "2019-11-26 00:02:00.336946 +00:00",
                "2019-11-26 00:02:00.336946 +00:00",
            ],
        );
        logger.info("done seeding");
    } catch (e) {
        logger.error("something went wrong", e);
        process.exit(1);
    } finally {
        if (db) {
            await db.disconnect();
        }
        process.exit(0);
    }
})();
