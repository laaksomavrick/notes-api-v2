import bodyParser from "body-parser";
import cors from "cors";
import express, { Router } from "express";
import { DatabaseConfig, ServerConfig } from "../lib/config";
import { Database } from "../lib/database";
import { LoggerFactory } from "../lib/logger";
import { helloWorldHandler } from "./handlers";

const logger = LoggerFactory.getLogger();
const serverConfig = new ServerConfig();
const databaseConfig = new DatabaseConfig();

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

const router = Router();
router.get("*", helloWorldHandler);

app.use(router);

const database = new Database(databaseConfig);

(async (): Promise<void> => {
    await database.init();
    app.listen(serverConfig.port, () => {
        logger.info("app listening on 3000");
    });
})();
