import winston, { format } from "winston";

const { colorize, combine, timestamp, errors, printf, splat } = format;

export interface ILoggableParams {
    // tslint:disable-next-line:no-any
    [key: string]: any;
}

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
            }): string => {
                return `[${timestamp}] ${level} - ${message}`;
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
    public info(message: string, params?: ILoggableParams): void {
        if (process.env.NODE_ENV !== "test") {
            const metaString = this.getMetaString(params);
            const msg = `${message}${metaString}`;
            this.logger.info(msg);
        }
    }

    // tslint:disable-next-line:no-any
    public debug(message: string, params?: ILoggableParams): void {
        const metaString = this.getMetaString(params);
        const msg = `${message}${metaString}`;
        this.logger.debug(msg);
    }

    // tslint:disable-next-line:no-any
    public error(message: string, params?: ILoggableParams): void {
        const metaString = this.getMetaString(params);
        const msg = `${message}${metaString}`;
        this.logger.error(msg);
    }

    // tslint:disable-next-line:no-any
    private getMetaString(params?: ILoggableParams): string {
        if (!params) {
            return "";
        }

        const keys = Object.keys(params);
        let metaString = "";
        // tslint:disable-next-line:prefer-for-of
        for (let i = 0; i < keys.length; i++) {
            const key = keys[i];
            const value = params[key];
            metaString = `${metaString} ${key}=${value}`;
        }

        return metaString;
    }
}
