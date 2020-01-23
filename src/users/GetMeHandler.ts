import { NextFunction, Request, Response } from "express";
import { Handler } from "../framework/Handler";
import { NotFoundError } from "../framework/HttpError";
import { UserRepository } from "./UserRepository";

export class GetMeHandler extends Handler {
    private readonly userRepository: UserRepository;

    protected readonly handlers = [this.requireAuth(), this.handle.bind(this)];

    constructor(userRepository: UserRepository) {
        super();
        this.userRepository = userRepository;
    }

    protected async handle(req: Request, res: Response, next: NextFunction): Promise<void> {
        const context = this.getContext(req);
        const userId = this.getUserId(req);

        const user = await this.userRepository.findById(context, userId, [
            "id",
            "email",
            "created_at",
            "updated_at",
        ]);

        if (!user) {
            throw new NotFoundError();
        }

        this.httpOk(res, { user });
    }
}
