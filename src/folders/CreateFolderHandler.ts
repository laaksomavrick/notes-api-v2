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
        // Get the userId
        const userId = this.getUserId(req);

        // Parse dto
        const dto = CreateFolderDto.build(req.body);

        if (!dto) {
            throw new BadRequestError();
        }

        // Check that the dto is valid
        const valid = dto.isValid();

        if (!valid) {
            throw new UnprocessableEntityError();
        }

        const folder = await this.folderRepository.create(dto, userId);

        // Create the folder
        this.httpOk(res, { folder });
    }
}
