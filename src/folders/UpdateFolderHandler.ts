import { NextFunction, Request, Response } from "express";
import { Handler } from "../framework/Handler";
import { BadRequestError, NotFoundError, UnprocessableEntityError } from "../framework/HttpError";
import { FolderRepository } from "./FolderRepository";
import { UpdateFolderDto } from "./UpdateFolderDto";

export class UpdateFolderHandler extends Handler {
    private readonly folderRepository: FolderRepository;

    protected readonly handlers = [this.requireAuth(), this.handle.bind(this)];

    constructor(folderRepository: FolderRepository) {
        super();
        this.folderRepository = folderRepository;
    }

    protected async handle(req: Request, res: Response, next: NextFunction): Promise<void> {
        // Get the folderId from the route
        const folderId = this.getQueryParamId(req, "folderId");

        if (!folderId) {
            throw new BadRequestError();
        }

        // Verify the folder exists
        const folderExists = await this.folderRepository.findById(folderId, ["id"]);

        if (!folderExists) {
            throw new NotFoundError();
        }

        // Parse dto
        const dto = UpdateFolderDto.build(req.body);

        if (!dto) {
            throw new BadRequestError();
        }

        // Make sure dto is valid
        const valid = dto.isValid();

        if (!valid) {
            throw new UnprocessableEntityError();
        }

        // Update the folder
        const folder = await this.folderRepository.update(dto, folderId);

        this.httpOk(res, { folder });
    }
}