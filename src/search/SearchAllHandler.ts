import { NextFunction, Request, Response } from "express";
import { Handler } from "../framework/Handler";
import { BadRequestError, UnprocessableEntityError } from "../framework/HttpError";
import { SearchDto } from "./SearchDto";
import { SearchService } from "./SearchService";

export class SearchAllHandler extends Handler {
    private readonly searchService: SearchService;

    protected readonly handlers = [this.requireAuth(), this.handle.bind(this)];

    constructor(searchService: SearchService) {
        super();
        this.searchService = searchService;
    }

    protected async handle(req: Request, res: Response, next: NextFunction): Promise<void> {
        const context = this.getContext(req);

        // Get the userId
        const userId = this.getUserId(req);

        // Parse dto
        const dto = SearchDto.build(req);

        if (!dto) {
            throw new BadRequestError();
        }

        // Check that the dto is valid
        const valid = dto.isValid();

        if (!valid) {
            throw new UnprocessableEntityError();
        }

        const result = await this.searchService.searchAll(context, dto, userId);

        this.httpOk(res, result);
    }
}
