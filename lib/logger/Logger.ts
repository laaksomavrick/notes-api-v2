import winston from "winston";

import { format } from "winston";
const { colorize, combine, timestamp, errors, printf, splat } = format;

export class Logger {
    private logger: winston.Logger;

    private readonly format = combine(
        // tslint:disable-next-line:typedef
        format(info => {
            info.level = info.level.toUpperCase();
            return info;
        })(),
        colorize(),
        timestamp(),
        splat(),
        errors(),
        printf(
            // tslint:disable-next-line:typedef
            ({
                // tslint:disable-next-line:no-shadowed-variable
                timestamp,
                level,
                message,
                ...rest
            }): string => {
                let restString = JSON.stringify(rest, undefined, 2);
                restString = restString === "{}" ? "" : restString;

                return `[${timestamp}] ${level} - ${message} ${restString}`;
            },
        ),
    );

    constructor() {
        this.logger = winston.createLogger({
            format: this.format,
            transports: [new winston.transports.Console()],
        });
    }

    // tslint:disable-next-line:no-any
    public info(message: string, ...meta: any[]): void {
        if (process.env.NODE_ENV !== "test") {
            this.logger.info(message, ...meta);
        }
    }

    // tslint:disable-next-line:no-any
    public debug(message: string, ...meta: any[]): void {
        this.logger.debug(message, ...meta);
    }

    // tslint:disable-next-line:no-any
    public error(message: string, ...meta: any[]): void {
        this.logger.error(message, ...meta);
    }
}
