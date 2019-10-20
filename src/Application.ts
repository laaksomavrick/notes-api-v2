import bodyParser from "body-parser";
import cors from "cors";
import express, { Express, Router } from "express";
import { ServerConfig } from "../lib/config";
import { Database } from "../lib/database";
import { LoggerFactory } from "../lib/logger";
import { HelloWorldHandler } from "./HelloWorldHandler";

export class Application {
    private server: Express;

    private database: Database;

    private config: ServerConfig;

    private logger = LoggerFactory.getLogger();

    constructor(database: Database, config: ServerConfig) {
        this.server = this.buildApp();
        this.database = database;
        this.config = config;
    }

    public async serve(): Promise<void> {
        await this.database.init();
        this.server.listen(this.config.port, () => {
            this.logger.info("app listening on 3000");
        });
    }

    // TODO: may want to pull this out at some point
    private buildApp(): Express {
        const app = express();
        app.use(bodyParser.urlencoded({ extended: true }));
        app.use(bodyParser.json());
        app.use(cors());

        const helloWorldHandler = new HelloWorldHandler();

        const router = Router();
        router.get(helloWorldHandler.path, helloWorldHandler.handle.bind(helloWorldHandler));

        app.use(router);
        return app;
    }
}
