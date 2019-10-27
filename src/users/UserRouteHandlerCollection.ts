import { RouteHandlerCollection } from "../RouteHandlerCollection";
import { CreateUserHandler } from "./CreateUserHandler";
import { CreateUserMiddleware } from "./CreateUserMiddleware";

export class UserRouteHandlerCollection extends RouteHandlerCollection {
    public build(): void {
        const { app, database } = this;
        // It would be nice if these were encapsulated in some class so testing could be done
        // as one unit of a route instead of as separate chunks
        // E.g
        // const createUserHandlerCollection = CreateUserHandlerCollection::build();
        // app.post(createUserHandlerCollection.getPath(), createUserHandlerCollection.getHandlers());
        // Might be a little too astronautical though :-)

        const createUserHandler = new CreateUserHandler(database);
        const createUserMiddleware = new CreateUserMiddleware(database);

        app.post("/users", createUserMiddleware.getHandler(), createUserHandler.getHandler());
    }
}
