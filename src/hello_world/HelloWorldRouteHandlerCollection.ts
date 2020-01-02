import { Request, Response } from "express";
import { RouteHandlerCollection } from "../framework/RouteHandlerCollection";

export class HelloWorldRouteHandlerCollection extends RouteHandlerCollection {
    public build(): void {
        const { app, logger } = this;

        app.get("*", (req: Request, res: Response): void => {
            const now = new Date();
            logger.info(`Received request at ${now}`);
            res.send("Hello, world");
        });
    }
}
