import { NextFunction, Request, Response } from "express";
import { Handler } from "../framework/Handler";
import { BadRequestError, NotFoundError, UnprocessableEntityError } from "../framework/HttpError";
import { FolderRepository } from "./FolderRepository";

export class DeleteFolderHandler extends Handler {
    private readonly folderRepository: FolderRepository;

    protected readonly handlers = [this.requireAuth(), this.handle.bind(this)];

    constructor(folderRepository: FolderRepository) {
        super();
        this.folderRepository = folderRepository;
    }

    protected async handle(req: Request, res: Response, next: NextFunction): Promise<void> {
        const context = this.getContext(req);

        const userId = this.getUserId(req);
        const folderId = this.getParamId(req, "folderId");

        if (!folderId) {
            throw new BadRequestError();
        }

        // Verify the folder exists
        const folderExists = await this.folderRepository.findByIdAndUserId(
            context,
            folderId,
            userId,
            ["id"],
        );

        if (!folderExists) {
            throw new NotFoundError();
        }

        const count = await this.folderRepository.getActiveCountForUser(context, userId);

        if (count <= 1) {
            throw new UnprocessableEntityError();
        }

        // delete the folder
        await this.folderRepository.delete(context, folderId);

        this.httpOk(res, {});
    }
}
