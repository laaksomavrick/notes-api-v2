import { Request, Response } from "express";
import { Handler } from "../Handler";
import { BadRequestError, UnprocessableEntityError } from "../HttpError";
import { CreateUserDto } from "./CreateUserDto";

export class CreateUserHandler extends Handler {
    public getHandler(): (req: Request, res: Response) => void {
        return this.handle.bind(this);
    }

    protected handle(req: Request, res: Response): void {
        // Parse dto
        const dto = CreateUserDto.build(req.body);

        if (!dto) {
            throw new BadRequestError();
        }

        const valid = dto.isValid();

        if (!valid) {
            throw new UnprocessableEntityError();
        }

        // Check that the user doesn't already exist

        // Create user

        this.httpOk(res, { user: dto });
    }
}
