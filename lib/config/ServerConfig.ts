import config from "./convict";

export class ServerConfig {
    public env: string;
    public host: string;
    public port: number;
    public jwtSecret: string;

    constructor() {
        this.env = config.get("env");
        this.host = config.get("host");
        this.port = config.get("port");
        this.jwtSecret = config.get("secret.jwt");
    }
}
