import { NextFunction, Request, Response } from "express";
import { Handler } from "../framework/Handler";
import { BadRequestError, NotFoundError } from "../framework/HttpError";
import { NoteRepository } from "./NoteRepository";

export class DeleteNoteHandler extends Handler {
    private readonly noteRepository: NoteRepository;

    protected readonly handlers = [this.requireAuth(), this.handle.bind(this)];

    constructor(noteRepository: NoteRepository) {
        super();
        this.noteRepository = noteRepository;
    }

    protected async handle(req: Request, res: Response, next: NextFunction): Promise<void> {
        const userId = this.getUserId(req);
        const noteId = this.getParamId(req, "noteId");

        if (!noteId) {
            throw new BadRequestError();
        }

        // Verify the note exists
        const noteExists = await this.noteRepository.findByIdAndUserId(noteId, userId, ["id"]);

        if (!noteExists) {
            throw new NotFoundError();
        }

        // delete the note
        await this.noteRepository.delete(noteId);

        this.httpOk(res, {});
    }
}
