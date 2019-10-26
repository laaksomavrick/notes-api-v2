import bodyParser from "body-parser";
import cors from "cors";
import express, { Express } from "express";
import { ServerConfig } from "../lib/config";
import { Database } from "../lib/database";
import { LoggerFactory } from "../lib/logger";
import { ErrorHandler } from "./ErrorHandler";
import UserModule from "./users";

export class Application {
    private server: Express;

    private readonly database: Database;

    private readonly config: ServerConfig;

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

        // TODO figure out a nice way to represent this in classes/type

        const userModule = new UserModule(this);

        const modules = [userModule];
        for (const module of modules) {
            module.build(app);
        }

        const errorHandler = new ErrorHandler(app);
        errorHandler.bindHandler();

        return app;
    }
}
