import { DatabaseConfig, ServerConfig } from "../lib/config";
import { Database } from "../lib/database";
import { Application } from "./Application";

const databaseConfig = new DatabaseConfig();
const database = new Database(databaseConfig);

const serverConfig = new ServerConfig();
const app = new Application(database, serverConfig);

app.serve();
