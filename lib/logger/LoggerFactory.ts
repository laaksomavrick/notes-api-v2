import { Logger } from "./Logger";

export class LoggerFactory {
  private static logger: Logger = new Logger();

  public static getLogger(): Logger {
    return this.logger;
  }

}
