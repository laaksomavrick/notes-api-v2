import { NextFunction, Request, Response } from "express";
import { Handler } from "../framework/Handler";
import { BadRequestError, UnprocessableEntityError } from "../framework/HttpError";
import { PaginatedResourceDto } from "../framework/PaginatedResourceDto";
import { FolderRepository } from "./FolderRepository";

export class GetFoldersHandler extends Handler {
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
        const dto = PaginatedResourceDto.build(req.body);

        if (!dto) {
            throw new BadRequestError();
        }

        const valid = dto.isValid();

        if (!valid) {
            throw new UnprocessableEntityError();
        }

        // Retrieve folder page
        const folders = await this.folderRepository.getAllFoldersForUser(dto, userId);

        this.httpOk(res, { folders });
    }
}
