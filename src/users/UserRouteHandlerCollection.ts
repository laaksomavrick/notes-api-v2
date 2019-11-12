import { RouteHandlerCollection } from "../framework/RouteHandlerCollection";
import { AuthorizeUserHandler } from "./AuthorizeUserHandler";
import { CreateUserHandler } from "./CreateUserHandler";
import { UserRepository } from "./UserRepository";

export class UserRouteHandlerCollection extends RouteHandlerCollection {
    public build(): void {
        const { app, database, config } = this;

        const userRepository = new UserRepository(database);

        const createUserHandler = new CreateUserHandler(userRepository);

        const authorizeUserHandler = new AuthorizeUserHandler(userRepository, config);

        app.post("/users", createUserHandler.getHandler());
        app.post("/auth", authorizeUserHandler.getHandler());
    }
}
