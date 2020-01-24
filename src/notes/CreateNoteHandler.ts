import { NextFunction, Request, Response } from "express";
import { Handler } from "../framework/Handler";
import { BadRequestError, UnprocessableEntityError } from "../framework/HttpError";
import { CreateNoteDto } from "./CreateNoteDto";
import { NoteRepository } from "./NoteRepository";

export class CreateNoteHandler extends Handler {
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

        // Parse dto
        const dto = CreateNoteDto.build(req);

        if (!dto) {
            throw new BadRequestError();
        }

        // Check that the dto is valid
        const valid = dto.isValid();

        if (!valid) {
            throw new UnprocessableEntityError();
        }

        // Create the folder
        const note = await this.noteRepository.create(context, dto, userId);

        this.httpOk(res, { note });
    }
}
