import { RouteHandlerCollection } from "../framework/RouteHandlerCollection";
import { CreateFolderHandler } from "./CreateFolderHandler";
import { DeleteFolderHandler } from "./DeleteFolderHandler";
import { FolderRepository } from "./FolderRepository";
import { GetFoldersHandler } from "./GetFoldersHandler";
import { UpdateFolderHandler } from "./UpdateFolderHandler";

export class FolderRouteHandlerCollection extends RouteHandlerCollection {
    public build(): void {
        const { app, database } = this;

        const folderRepository = new FolderRepository(database);

        const createFolderHandler = new CreateFolderHandler(folderRepository);
        const getFoldersHandler = new GetFoldersHandler(folderRepository);
        const updateFolderHandler = new UpdateFolderHandler(folderRepository);
        const deleteFolderHandler = new DeleteFolderHandler(folderRepository);

        app.post("/folders", createFolderHandler.getHandlers());
        app.get("/folders", getFoldersHandler.getHandlers());
        app.patch("/folders/:folderId", updateFolderHandler.getHandlers());
        app.delete("/folders/:folderId", deleteFolderHandler.getHandlers());
    }
}
