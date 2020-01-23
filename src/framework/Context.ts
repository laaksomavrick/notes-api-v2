import uuid from "uuid";
import { ILoggableParams, LoggerFactory } from "../../lib/logger";

interface ILoggableContextParams {
    reqId: string;
}

export class Context {
    private readonly uuid = uuid();

    private readonly logger = LoggerFactory.getLogger();

    public info(message: string, params?: ILoggableParams): void {
        this.logger.info(message, { ...params, ...this.getLoggableParams() });
    }

    public debug(message: string, params?: ILoggableParams): void {
        this.logger.debug(message, { ...params, ...this.getLoggableParams() });
    }

    public error(message: string, params?: ILoggableParams): void {
        this.logger.error(message, { ...params, ...this.getLoggableParams() });
    }

    private getLoggableParams(): ILoggableContextParams {
        return { reqId: this.uuid };
    }
}
