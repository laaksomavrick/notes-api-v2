import { FolderRepository } from "../folders/FolderRepository";
import { RouteHandlerCollection } from "../framework/RouteHandlerCollection";
import { NoteRepository } from "../notes/NoteRepository";
import { SearchAllHandler } from "./SearchAllHandler";
import { SearchService } from "./SearchService";

export default class SearchRouteHandlerCollection extends RouteHandlerCollection {
    public build(): void {
        const { app, database } = this;

        const noteRepository = new NoteRepository(database);
        const folderRepository = new FolderRepository(database);

        const searchService = new SearchService(noteRepository, folderRepository);

        const searchAllHandler = new SearchAllHandler(searchService);

        app.post("/search/all", searchAllHandler.getHandlers());
    }
}
