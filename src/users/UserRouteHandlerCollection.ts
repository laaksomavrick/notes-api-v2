import { RouteHandlerCollection } from "../framework/RouteHandlerCollection";
import { AuthorizeUserHandler } from "./AuthorizeUserHandler";
import { CreateUserHandler } from "./CreateUserHandler";
import { GetMeHandler } from "./GetMeHandler";
import { UserRepository } from "./UserRepository";

export class UserRouteHandlerCollection extends RouteHandlerCollection {
    public build(): void {
        const { app, database, config } = this;

        const userRepository = new UserRepository(database);

        const createUserHandler = new CreateUserHandler(userRepository);

        const authorizeUserHandler = new AuthorizeUserHandler(userRepository, config);

        const getMeHandler = new GetMeHandler(userRepository);

        app.post("/users", createUserHandler.getHandlers());
        app.post("/auth", authorizeUserHandler.getHandlers());
        app.get("/me", getMeHandler.getHandlers());
    }
}
