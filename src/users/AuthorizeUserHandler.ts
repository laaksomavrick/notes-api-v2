import bcrypt from "bcrypt";
import { NextFunction, Request, Response } from "express";
import { sign } from "jsonwebtoken";
import { ServerConfig } from "../../lib/config";
import { Handler } from "../framework/Handler";
import {
    BadRequestError,
    ForbiddenError,
    NotFoundError,
    UnprocessableEntityError,
} from "../framework/HttpError";
import { AuthorizeUserDto } from "./AuthorizeUserDto";
import { UserRepository } from "./UserRepository";

export class AuthorizeUserHandler extends Handler {
    private readonly userRepository: UserRepository;

    private readonly config: ServerConfig;

    protected readonly handlers = [this.handle.bind(this)];

    constructor(userRepository: UserRepository, config: ServerConfig) {
        super();
        this.userRepository = userRepository;
        this.config = config;
    }

    protected async handle(req: Request, res: Response, next: NextFunction): Promise<void> {
        // Parse dto
        const dto = AuthorizeUserDto.build(req.body);

        if (!dto) {
            throw new BadRequestError();
        }

        // Check that the dto is valid
        const valid = dto.isValid();

        if (!valid) {
            throw new UnprocessableEntityError();
        }

        // Check that the user exists
        const user = await this.userRepository.findByEmailWithPassword(dto.email);

        if (!user) {
            throw new NotFoundError();
        }

        // Check that the password matches
        const authorized = await bcrypt.compare(dto.password, user.password);

        if (!authorized) {
            throw new ForbiddenError();
        }

        // todo expiry + refresh logic in another handler
        const token = sign({ id: user.id }, this.config.jwtSecret);

        this.httpOk(res, { token });
    }
}
