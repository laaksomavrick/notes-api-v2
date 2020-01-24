import { Request, Response } from "express";
import { RouteHandlerCollection } from "../framework/RouteHandlerCollection";

export class HelloWorldRouteHandlerCollection extends RouteHandlerCollection {
    public build(): void {
        const { app } = this;

        app.get("*", (req: Request, res: Response): void => {
            const now = new Date();
            // tslint:disable-next-line:no-any
            (req as any).context.info(`Received request at ${now}`);
            res.send("Hello, world");
        });
    }
}
