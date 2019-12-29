import config from "./convict";

export class ServerConfig {
    public env: string;

    public host: string;

    public port: number;

    public jwtSecret: string;

    public helloWorldMode: boolean;

    constructor() {
        this.env = config.get("env");
        this.host = config.get("host");
        this.port = config.get("port");
        this.jwtSecret = config.get("secret.jwt");
        this.helloWorldMode = config.get("helloWorldMode");
    }
}
