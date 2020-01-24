import { NextFunction, Request, Response } from "express";
import { Handler } from "../framework/Handler";
import { FolderRepository } from "./FolderRepository";

export class GetFoldersHandler extends Handler {
    private readonly folderRepository: FolderRepository;

    protected readonly handlers = [this.requireAuth(), this.handle.bind(this)];

    constructor(folderRepository: FolderRepository) {
        super();
        this.folderRepository = folderRepository;
    }

    protected async handle(req: Request, res: Response, next: NextFunction): Promise<void> {
        const context = this.getContext(req);

        // Get the userId
        const userId = this.getUserId(req);

        // Retrieve folder page
        const folders = await this.folderRepository.getAllFoldersForUser(context, userId);

        this.httpOk(res, { folders });
    }
}
