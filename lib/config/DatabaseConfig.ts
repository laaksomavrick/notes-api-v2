import config from "./convict";

export class DatabaseConfig {
    public database: string;
    public host: string;
    public port: number;
    public user: string;
    public password: string | undefined;

    constructor() {
        this.database = config.get("database.schema");
        this.host = config.get("database.host");
        this.port = config.get("database.port");
        this.user = config.get("database.username");
        this.password = config.get("database.password");
    }
}
