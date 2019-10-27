import { Express } from "express";
import { Database } from "../lib/database";
import { Logger } from "../lib/logger";
import { Application } from "./Application";

export abstract class RouteHandlerCollection {
    protected readonly database: Database;

    protected readonly logger: Logger;

    protected readonly app: Express;

    constructor(application: Application) {
        this.database = application.database;
        this.logger = application.logger;
        this.app = application.server;
    }

    public abstract build(express: Express, application: Application): void;
}
