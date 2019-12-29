import bodyParser from "body-parser";
import cors from "cors";
import express, { Express } from "express";
import { DatabaseConfig, ServerConfig } from "../lib/config";
import { Database } from "../lib/database";
import { LoggerFactory } from "../lib/logger";
import { ErrorHandler } from "./ErrorHandler";
import FolderRouteHandlerCollection from "./folders";
import NoteRouteHandlerCollection from "./notes";
import UserRouteHandlerCollection from "./users";

export class Application {
    public readonly server: Express;

    public readonly database: Database;

    public readonly config: ServerConfig;

    public logger = LoggerFactory.getLogger();

    constructor(database: Database, config: ServerConfig) {
        this.server = express();
        this.database = database;
        this.config = config;
        this.buildApp();
    }

    public static build(): Application {
        const databaseConfig = new DatabaseConfig();
        const database = new Database(databaseConfig);
        const serverConfig = new ServerConfig();
        return new Application(database, serverConfig);
    }

    public async serve(): Promise<void> {
        await this.database.init();
        this.server.listen(this.config.port, () => {
            this.logger.info("app listening", {
                env: this.config.env,
                host: this.config.host,
                port: this.config.port,
            });
        });
    }

    // TODO: may want to pull this out at some point
    private buildApp(): void {
        this.server.use(bodyParser.urlencoded({ extended: true }));
        this.server.use(bodyParser.json());
        this.server.use(cors());

        // TODO figure out a nice way to represent this in classes/type

        const userRouteHandlerCollection = new UserRouteHandlerCollection(this);
        const folderRouteHandlerCollection = new FolderRouteHandlerCollection(this);
        const noteRouteHandlerCollection = new NoteRouteHandlerCollection(this);

        const routeHandlerCollections = [
            userRouteHandlerCollection,
            folderRouteHandlerCollection,
            noteRouteHandlerCollection,
        ];
        for (const routeHandlerCollection of routeHandlerCollections) {
            routeHandlerCollection.build();
        }

        const errorHandler = new ErrorHandler(this);
        errorHandler.bindHandler();
    }
}
