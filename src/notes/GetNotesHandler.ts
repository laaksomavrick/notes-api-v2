import { NextFunction, Request, Response } from "express";
import { Handler } from "../framework/Handler";
import { BadRequestError } from "../framework/HttpError";
import { GetNotesDto } from "./GetNotesDto";
import { NoteRepository } from "./NoteRepository";

export class GetNotesHandler extends Handler {
    private readonly noteRepository: NoteRepository;

    protected readonly handlers = [this.requireAuth(), this.handle.bind(this)];

    constructor(noteRepository: NoteRepository) {
        super();
        this.noteRepository = noteRepository;
    }

    protected async handle(req: Request, res: Response, next: NextFunction): Promise<void> {
        const context = this.getContext(req);

        // Get the userId
        const userId = this.getUserId(req);

        // Optionally, get the folderId if it exists (dto)
        const dto = GetNotesDto.build(req);

        if (!dto) {
            throw new BadRequestError();
        }

        // Retrieve notes
        const notes = await this.noteRepository.findAllNotes(context, dto, userId);

        this.httpOk(res, { notes });
    }
}
