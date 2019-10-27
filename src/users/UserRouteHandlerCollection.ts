import { RouteHandlerCollection } from "../RouteHandlerCollection";
import { CreateUserHandler } from "./CreateUserHandler";

export class UserRouteHandlerCollection extends RouteHandlerCollection {
    public build(): void {
        const { app, database } = this;

        const createUserHandler = new CreateUserHandler();

        app.post("/users", createUserHandler.getHandler());
    }
}
