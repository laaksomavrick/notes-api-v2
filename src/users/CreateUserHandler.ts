import { Request, Response } from "express";
import { Handler } from "../Handler";
import { BadRequestError, ConflictError, UnprocessableEntityError } from "../HttpError";
import { CreateUserDto } from "./CreateUserDto";
import { UserRepository } from "./UserRepository";

export class CreateUserHandler extends Handler {
    private readonly userRepository: UserRepository;

    constructor(userRepository: UserRepository) {
        super();
        this.userRepository = userRepository;
    }

    public getHandler(): (req: Request, res: Response) => void {
        return this.handle.bind(this);
    }

    // TODO error handling w/r/t async/await, universal
    // https://medium.com/@Abazhenov/using-async-await-in-express-with-node-8-b8af872c0016
    protected async handle(req: Request, res: Response): Promise<void> {
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
