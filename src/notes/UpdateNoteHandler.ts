import { NextFunction, Request, Response } from "express";
import { Handler } from "../framework/Handler";
import { BadRequestError, NotFoundError, UnprocessableEntityError } from "../framework/HttpError";
import { NoteRepository } from "./NoteRepository";
import { UpdateNoteDto } from "./UpdateNoteDto";

export class UpdateNoteHandler extends Handler {
    private readonly noteRepository: NoteRepository;

    protected readonly handlers = [this.requireAuth(), this.handle.bind(this)];

    constructor(noteRepository: NoteRepository) {
        super();
        this.noteRepository = noteRepository;
    }

    protected async handle(req: Request, res: Response, next: NextFunction): Promise<void> {
        // Get the noteId from the route
        const userId = this.getUserId(req);
        const noteId = this.getParamId(req, "noteId");

        if (!noteId) {
            throw new BadRequestError();
        }

        // Verify the note exists and belongs to the user
        const noteExists = await this.noteRepository.findByIdAndUserId(noteId, userId, ["id"]);

        if (!noteExists) {
            throw new NotFoundError();
        }

        // Parse dto
        const dto = UpdateNoteDto.build(req);

        if (!dto) {
            throw new BadRequestError();
        }

        // Check that the dto is valid
        const valid = dto.isValid();

        if (!valid) {
            throw new UnprocessableEntityError();
        }

        // Update the note
        const note = await this.noteRepository.update(dto, noteId);

        this.httpOk(res, { note });
    }
}
