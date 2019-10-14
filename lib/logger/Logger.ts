import winston from "winston";

export class Logger {
    private logger: winston.Logger;

    constructor() {
        this.logger = winston.createLogger({
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.align(),
                winston.format.simple(),
            ),
            transports: [new winston.transports.Console()],
        });
    }

    // tslint:disable-next-line:no-any
    public info(message: string, ...meta: any[]): void {
        this.logger.info(message, meta);
    }

    // tslint:disable-next-line:no-any
    public debug(message: string, ...meta: any[]): void {
        this.logger.debug(message, meta);
    }

    // tslint:disable-next-line:no-any
    public error(message: string, ...meta: any[]): void {
        this.logger.error(message, meta);
    }
}
