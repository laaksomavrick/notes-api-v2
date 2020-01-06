import { FolderRepository } from "../folders/FolderRepository";
import { RouteHandlerCollection } from "../framework/RouteHandlerCollection";
import { AuthorizeUserHandler } from "./AuthorizeUserHandler";
import { CreateUserHandler } from "./CreateUserHandler";
import { GetMeHandler } from "./GetMeHandler";
import { UserRepository } from "./UserRepository";
import { UserService } from "./UserService";

export class UserRouteHandlerCollection extends RouteHandlerCollection {
    public build(): void {
        const { app, database, config } = this;

        const userRepository = new UserRepository(database);
        const folderRepository = new FolderRepository(database);

        const userService = new UserService(database, userRepository, folderRepository);

        const createUserHandler = new CreateUserHandler(userRepository, userService);

        const authorizeUserHandler = new AuthorizeUserHandler(userRepository, config);

        const getMeHandler = new GetMeHandler(userRepository);

        app.post("/users", createUserHandler.getHandlers());
        app.post("/auth", authorizeUserHandler.getHandlers());
        app.get("/me", getMeHandler.getHandlers());
    }
}
