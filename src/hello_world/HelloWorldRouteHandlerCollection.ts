import { Request, Response } from "express";
import { RouteHandlerCollection } from "../framework/RouteHandlerCollection";

export class HelloWorldRouteHandlerCollection extends RouteHandlerCollection {
    public build(): void {
        const { app } = this;

        app.get("*", (req: Request, res: Response): void => {
            res.send("Hello, world");
        });
    }
}
