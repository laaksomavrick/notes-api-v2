import { NextFunction, Request, Response } from "express";
import { Handler } from "../framework/Handler";
import { BadRequestError, ConflictError, UnprocessableEntityError } from "../framework/HttpError";
import { CreateUserDto } from "./CreateUserDto";
import { UserRepository } from "./UserRepository";

export class CreateUserHandler extends Handler {
    private readonly userRepository: UserRepository;

    constructor(userRepository: UserRepository) {
        super();
        this.userRepository = userRepository;
    }

    public getHandler(): (req: Request, res: Response, next: NextFunction) => void {
        return this.handleErrors(this.handle.bind(this));
    }

    protected async handle(req: Request, res: Response, next: NextFunction): Promise<void> {
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
        const exists = await this.userRepository.findByEmail(dto.email);

        if (exists) {
            throw new ConflictError();
        }

        // Create user
        const user = await this.userRepository.create(dto);

        this.httpOk(res, { user });
    }
}
