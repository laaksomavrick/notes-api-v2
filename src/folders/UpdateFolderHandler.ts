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
        const context = this.getContext(req);

        // Get the folderId from the route
        const userId = this.getUserId(req);
        const folderId = this.getParamId(req, "folderId");

        if (!folderId) {
            throw new BadRequestError();
        }

        // Verify the folder exists and belongs to the user
        const folderExists = await this.folderRepository.findByIdAndUserId(
            context,
            folderId,
            userId,
            ["id"],
        );

        if (!folderExists) {
            throw new NotFoundError();
        }

        // Parse dto
        const dto = UpdateFolderDto.build(req);

        if (!dto) {
            throw new BadRequestError();
        }

        // Make sure dto is valid
        const valid = dto.isValid();

        if (!valid) {
            throw new UnprocessableEntityError();
        }

        // Update the folder
        const folder = await this.folderRepository.update(context, dto, folderId);

        this.httpOk(res, { folder });
    }
}
