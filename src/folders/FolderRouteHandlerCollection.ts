import { RouteHandlerCollection } from "../framework/RouteHandlerCollection";
import { CreateFolderHandler } from "./CreateFolderHandler";
import { FolderRepository } from "./FolderRepository";
import { GetFoldersHandler } from "./GetFoldersHandler";

export class FolderRouteHandlerCollection extends RouteHandlerCollection {
    public build(): void {
        const { app, database } = this;

        const folderRepository = new FolderRepository(database);

        const createFolderHandler = new CreateFolderHandler(folderRepository);
        const getFoldersHandler = new GetFoldersHandler(folderRepository);

        app.post("/folders", createFolderHandler.getHandlers());
        app.get("/folders", getFoldersHandler.getHandlers());
    }
}
