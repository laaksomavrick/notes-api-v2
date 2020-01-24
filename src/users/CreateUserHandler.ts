import { NextFunction, Request, Response } from "express";
import { Handler } from "../framework/Handler";
import { BadRequestError, ConflictError, UnprocessableEntityError } from "../framework/HttpError";
import { CreateUserDto } from "./CreateUserDto";
import { UserRepository } from "./UserRepository";
import { UserService } from "./UserService";

export class CreateUserHandler extends Handler {
    private readonly userRepository: UserRepository;

    private readonly userService: UserService;

    protected readonly handlers = [this.handle.bind(this)];

    constructor(userRepository: UserRepository, userService: UserService) {
        super();
        this.userRepository = userRepository;
        this.userService = userService;
    }

    protected async handle(req: Request, res: Response, next: NextFunction): Promise<void> {
        const context = this.getContext(req);
        // Parse dto
        const dto = CreateUserDto.build(req.body);

        if (!dto) {
            throw new BadRequestError();
        }

        // Check that the dto is valid
        const valid = dto.isValid();

        if (!valid) {
            throw new UnprocessableEntityError();
        }

        // Check that the user doesn't already exist
        const exists = await this.userRepository.findByEmail(context, dto.email);

        if (exists) {
            throw new ConflictError();
        }

        // Create user
        const user = await this.userService.createUser(context, dto.email, dto.password);

        this.httpOk(res, { user });
    }
}
