import { RouteHandlerCollection } from "../framework/RouteHandlerCollection";
import { CreateNoteHandler } from "./CreateNoteHandler";
import { GetNotesHandler } from "./GetNotesHandler";
import { NoteRepository } from "./NoteRepository";

export class NoteRouteHandlerCollection extends RouteHandlerCollection {
    public build(): void {
        const { app, database } = this;

        const noteRepository = new NoteRepository(database);

        const getNotesHandler = new GetNotesHandler(noteRepository);
        const createNoteHandler = new CreateNoteHandler(noteRepository);

        app.get("/notes", getNotesHandler.getHandlers());
        app.post("/notes", createNoteHandler.getHandlers());
    }
}
