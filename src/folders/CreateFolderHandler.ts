import { NextFunction, Request, Response } from "express";
import { Handler } from "../framework/Handler";
import { BadRequestError, UnprocessableEntityError } from "../framework/HttpError";
import { CreateFolderDto } from "./CreateFolderDto";
import { FolderRepository } from "./FolderRepository";

export class CreateFolderHandler extends Handler {
    private readonly folderRepository: FolderRepository;

    protected readonly handlers = [this.requireAuth(), this.handle.bind(this)];

    constructor(folderRepository: FolderRepository) {
        super();
        this.folderRepository = folderRepository;
    }

    protected async handle(req: Request, res: Response, next: NextFunction): Promise<void> {
        // TODO: limit # of folders to 50 (or some arbitrary number) per user
        // Get the userId
        const userId = this.getUserId(req);

        // Parse dto
        const dto = CreateFolderDto.build(req);

        if (!dto) {
            throw new BadRequestError();
        }

        // Check that the dto is valid
        const valid = dto.isValid();

        if (!valid) {
            throw new UnprocessableEntityError();
        }

        // Create the folder
        const folder = await this.folderRepository.create(dto, userId);

        this.httpOk(res, { folder });
    }
}
