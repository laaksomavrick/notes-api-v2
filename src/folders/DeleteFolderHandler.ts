import { NextFunction, Request, Response } from "express";
import { Handler } from "../framework/Handler";
import { BadRequestError, NotFoundError } from "../framework/HttpError";
import { FolderRepository } from "./FolderRepository";

export class DeleteFolderHandler extends Handler {
    private readonly folderRepository: FolderRepository;

    protected readonly handlers = [this.requireAuth(), this.handle.bind(this)];

    constructor(folderRepository: FolderRepository) {
        super();
        this.folderRepository = folderRepository;
    }

    protected async handle(req: Request, res: Response, next: NextFunction): Promise<void> {
        const userId = this.getUserId(req);
        const folderId = this.getParamId(req, "folderId");

        if (!folderId) {
            throw new BadRequestError();
        }

        // Verify the folder exists
        const folderExists = await this.folderRepository.findByIdAndUserId(folderId, userId, [
            "id",
        ]);

        if (!folderExists) {
            throw new NotFoundError();
        }

        // TODO: cannot delete folder if it's the last one

        // delete the folder
        await this.folderRepository.delete(folderId);

        this.httpOk(res, {});
    }
}
