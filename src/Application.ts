import bodyParser from "body-parser";
import cors from "cors";
import express, { Express } from "express";
import { DatabaseConfig, ServerConfig } from "../lib/config";
import { Database } from "../lib/database";
import { LoggerFactory } from "../lib/logger";
import { ErrorHandler } from "./ErrorHandler";
import FolderRouteHandlerCollection from "./folders";
import { HelloWorldRouteHandlerCollection } from "./hello_world/HelloWorldRouteHandlerCollection";
import NoteRouteHandlerCollection from "./notes";
import { RequestLogger } from "./RequestLogger";
import SearchRouteHandlerCollection from "./search/SearchRouteHandlerCollection";
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
        if (!this.config.helloWorldMode) {
            await this.database.init();
        }
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

        const requestLogger = new RequestLogger(this);
        requestLogger.bindHandler();

        if (this.config.helloWorldMode) {
            const helloWorldRouteHandlerCollection = new HelloWorldRouteHandlerCollection(this);
            helloWorldRouteHandlerCollection.build();
        } else {
            // TODO figure out a nice way to represent this in classes/type
            const userRouteHandlerCollection = new UserRouteHandlerCollection(this);
            const folderRouteHandlerCollection = new FolderRouteHandlerCollection(this);
            const noteRouteHandlerCollection = new NoteRouteHandlerCollection(this);
            const searchRouteHandlerCollection = new SearchRouteHandlerCollection(this);

            const routeHandlerCollections = [
                userRouteHandlerCollection,
                folderRouteHandlerCollection,
                noteRouteHandlerCollection,
                searchRouteHandlerCollection,
            ];

            for (const routeHandlerCollection of routeHandlerCollections) {
                routeHandlerCollection.build();
            }
        }

        const errorHandler = new ErrorHandler(this);
        errorHandler.bindHandler();
    }
}
