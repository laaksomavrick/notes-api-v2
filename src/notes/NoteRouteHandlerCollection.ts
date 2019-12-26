import { RouteHandlerCollection } from "../framework/RouteHandlerCollection";
import { CreateNoteHandler } from "./CreateNoteHandler";
import { DeleteNoteHandler } from "./DeleteNoteHandler";
import { GetNotesHandler } from "./GetNotesHandler";
import { NoteRepository } from "./NoteRepository";
import { UpdateNoteHandler } from "./UpdateNoteHandler";

export class NoteRouteHandlerCollection extends RouteHandlerCollection {
    public build(): void {
        const { app, database } = this;

        const noteRepository = new NoteRepository(database);

        const getNotesHandler = new GetNotesHandler(noteRepository);
        const createNoteHandler = new CreateNoteHandler(noteRepository);
        const updateNoteHandler = new UpdateNoteHandler(noteRepository);
        const deleteNoteHandler = new DeleteNoteHandler(noteRepository);

        app.get("/notes", getNotesHandler.getHandlers());
        app.post("/notes", createNoteHandler.getHandlers());
        app.patch("/notes/:noteId", updateNoteHandler.getHandlers());
        app.delete("/notes/:noteId", deleteNoteHandler.getHandlers());
    }
}
