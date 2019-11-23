import { RouteHandlerCollection } from "../framework/RouteHandlerCollection";
import { CreateFolderHandler } from "./CreateFolderHandler";
import { FolderRepository } from "./FolderRepository";

export class FolderRouteHandlerCollection extends RouteHandlerCollection {
    public build(): void {
        const { app, database } = this;

        const folderRepository = new FolderRepository(database);

        const createFolderHandler = new CreateFolderHandler(folderRepository);

        app.post("/folders", createFolderHandler.getHandlers());
    }
}
