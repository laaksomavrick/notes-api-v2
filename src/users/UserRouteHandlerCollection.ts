import { RouteHandlerCollection } from "../framework/RouteHandlerCollection";
import { CreateUserHandler } from "./create/CreateUserHandler";
import { UserRepository } from "./UserRepository";

export class UserRouteHandlerCollection extends RouteHandlerCollection {
    public build(): void {
        const { app, database } = this;

        const userRepository = new UserRepository(database);

        const createUserHandler = new CreateUserHandler(userRepository);

        app.post("/users", createUserHandler.getHandler());
    }
}
