import { RouteHandlerCollection } from "../framework/RouteHandlerCollection";
import { CreateNoteHandler } from "./CreateNoteHandler";
import { NoteRepository } from "./NoteRepository";

export class NoteRouteHandlerCollection extends RouteHandlerCollection {
    public build(): void {
        const { app, database } = this;

        const noteRepository = new NoteRepository(database);

        const createNoteHandler = new CreateNoteHandler(noteRepository);

        // app.get("/notes?q=folderId=12", getNotesHandler.getHandlers());
        app.post("/notes", createNoteHandler.getHandlers());
    }
}
