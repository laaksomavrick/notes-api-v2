import { DatabaseConfig } from "../lib/config";
import { Database } from "../lib/database";
import { LoggerFactory } from "../lib/logger";

// TODO this is sloppy, here for local dev
// Create a default user "mav@gmail.com" with password "qweqweqwe" with user_id of "1"

(async (): Promise<void> => {
    const logger = LoggerFactory.getLogger();
    let db;
    try {
        const config = new DatabaseConfig();
        db = new Database(config);

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

        await db.query(
            `
                    INSERT INTO folders (id, user_id, name, created_at, updated_at, deleted)
                    VALUES ($1, $2, $3, $4, $5, $6)
          `,
            [
                1,
                1,
                "Default",
                "2019-11-26 00:02:00.336946 +00:00",
                "2019-11-26 00:02:00.336946 +00:00",
                false,
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
