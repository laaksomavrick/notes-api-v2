import crypto from "crypto";
import fs from "fs";
import path from "path";
import { Database } from "../lib/database";
import { LoggerFactory } from "../lib/logger";

const MIGRATIONS_DIRECTORY = path.join(process.cwd(), "migrations");

(async (): Promise<void> => {
    const logger = LoggerFactory.getLogger();
    let notesDb: Database;
    try {
        logger.info("running migrations");

        // TODO: refactor config into lib/config alongside src/index.ts
        notesDb = new Database({
            database: "notes",
            host: "localhost",
            password: undefined,
            port: 5432,
            user: "postgres",
        });

        const filenames = await fs.promises.readdir(MIGRATIONS_DIRECTORY);
        const migrationsInFolder = filenames.map((filename: string) => ({
            filename,
            hash: crypto
                .createHash("md5")
                .update(filename)
                .digest("hex"),
        }));

        const migrationsInDb = await notesDb.queryRows(`
            SELECT *
            FROM migrations
            ORDER BY id
        `);

        for (const [i, migrationInDb] of migrationsInDb.entries()) {
            const match = migrationsInFolder[i];
            // @ts-ignore
            if (match.hash !== migrationInDb.migration_hash) {
                throw new Error(`Unknown migration found: ${JSON.stringify(match)}`);
            }
        }

        for (const [index, { filename, hash }] of migrationsInFolder.entries()) {
            const alreadyRan = migrationsInDb[index];
            if (alreadyRan) {
                // @ts-ignore
                logger.info("skipping", alreadyRan.migration_name);
                continue;
            }

            const filepath = path.join(MIGRATIONS_DIRECTORY, filename);
            const sql = await fs.promises.readFile(filepath, "utf8");

            await notesDb.query(sql);
            await notesDb.query(
                `
                INSERT INTO migrations (migration_name, migration_hash) VALUES ($1, $2)
            `,
                [filename, hash],
            );

            logger.info("ran migration", filename);
        }
    } catch (e) {
        logger.error("something went wrong", e);
        process.exit(1);
    } finally {
        logger.info("done");
        process.exit(0);
    }
})();
