import { type } from "os";
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
    public info(message: string, ...meta: any[]): void {
        if (process.env.NODE_ENV !== "test") {
            const metaString = this.getMetaString(meta);
            const msg = `${message}${metaString}`;
            this.logger.info(msg);
        }
    }

    // tslint:disable-next-line:no-any
    public debug(message: string, ...meta: any[]): void {
        const metaString = this.getMetaString(meta);
        const msg = `${message}${metaString}`;
        this.logger.debug(msg);
    }

    // tslint:disable-next-line:no-any
    public error(message: string, ...meta: any[]): void {
        const metaString = this.getMetaString(meta);
        const msg = `${message}${metaString}`;
        this.logger.error(msg);
    }

    // tslint:disable-next-line:no-any
    private getMetaString(...meta: any[]): string {
        let metaString = "";

        for (const item of meta) {
            if (Array.isArray(item)) {
                // tslint:disable-next-line:typedef
                const arrayMetaString = item.map(ele => this.getMetaString(ele));
                metaString = `${metaString} ${arrayMetaString}`;
            } else if (typeof item === "object") {
                const keys = Object.keys(item);
                // tslint:disable-next-line:prefer-for-of
                for (let i = 0; i < keys.length; i++) {
                    const key = keys[i];
                    const value = item[key];
                    metaString = `${metaString} ${key}=${value}`;
                }
            } else {
                metaString = `${metaString} ${item}`;
            }
        }
        return metaString;
    }
}
