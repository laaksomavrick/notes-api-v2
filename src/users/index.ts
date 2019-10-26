import { Express } from "express";
import { Application } from "../Application";
import { CreateUserHandler } from "./CreateUserHandler";
import { CreateUserMiddleware } from "./CreateUserMiddleware";

// TODO parent class
class UserModule {
    private readonly application: Application;

    constructor(application: Application) {
        this.application = application;
    }

    public build(app: Express): void {
        // It would be nice if these were encapsulated in some class so testing could be done
        // as one unit of a route instead of as separate chunks
        const createUserHandler = new CreateUserHandler();
        const createUserMiddleware = new CreateUserMiddleware();

        app.post("/users", createUserMiddleware.getHandler(), createUserHandler.getHandler());
    }
}

export default UserModule;
